/* Amplify Params - DO NOT EDIT
	API_CAMHERCXP_GRAPHQLAPIENDPOINTOUTPUT
	API_CAMHERCXP_GRAPHQLAPIIDOUTPUT
	API_CAMHERCXP_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const https = require('https');
const http = require('http');
const AWS = require('aws-sdk');
const { URL } = require('url');

const APPSYNCURL = process.env.API_CAMHERCXP_GRAPHQLAPIENDPOINTOUTPUT;
const GQLAPIKEY = process.env.API_CAMHERCXP_GRAPHQLAPIKEYOUTPUT;
const REGION = process.env.AWS_REGION;

console.log('Lambda Environment:', {
  APPSYNCURL,
  GQLAPIKEY,
  REGION,
  NODE_ENV: process.env.NODE_ENV
});

const VALID_FIELDS = ['invoiceImg', 'partApprovalImg', 'counterReceiptImg'];

// Initialize SES with explicit configuration
const ses = new AWS.SES({ 
  apiVersion: '2010-12-01',
  region: REGION,
  maxRetries: 3
});

// Helper function to send AppSync request
async function sendAppSyncRequest(url, region, method, data, apiKey) {
  console.log('Starting AppSync request:', {
    url,
    method,
    data: JSON.stringify(data)
  });

  try {
    const endpoint = new URL(url).hostname;
    const port = new URL(url).port;
    const req = new AWS.HttpRequest(url, region);

    req.method = method;
    req.headers.host = endpoint;
    req.headers['Content-Type'] = 'application/json';
    req.headers['x-api-key'] = apiKey;
    req.body = JSON.stringify(data);

    const httpRequestModule = apiKey.includes('fakeApi') ? http : https;

    return new Promise((resolve, reject) => {
      const httpRequest = httpRequestModule.request(
        { ...req, host: endpoint, port: port },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            console.log('AppSync raw response:', body);
            try {
              const response = JSON.parse(body);
              if (response.errors && response.errors.length > 0) {
                console.error('GraphQL Errors:', response.errors);
                reject(new Error(response.errors[0].message));
              } else {
                resolve(response);
              }
            } catch (e) {
              console.error('Error parsing response:', e);
              reject(new Error('Error parsing response: ' + e.message));
            }
          });
        },
      );

      httpRequest.on('error', (error) => {
        console.error('HTTP Request Error:', error);
        reject(error);
      });

      httpRequest.write(req.body);
      httpRequest.end();
    });
  } catch (error) {
    console.error('AppSync Request Error:', error);
    throw error;
  }
}

// Helper function to delete a file from S3
async function deleteFileFromS3(bucketName, key) {
  console.log('Deleting file from S3:', { bucketName, key });
  const s3 = new AWS.S3();
  try {
    await s3.deleteObject({
      Bucket: bucketName,
      Key: key,
    }).promise();
    console.log('Successfully deleted file from S3');
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}

// Function to send email with retries
async function sendEmailWithRetry(params, maxRetries = 3) {
  console.log('Attempting to send email:', {
    to: params.Destination.ToAddresses,
    subject: params.Message.Subject.Data
  });

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email send attempt ${attempt}/${maxRetries}`);
      const result = await ses.sendEmail(params).promise();
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Email send attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed to send email after ${maxRetries} attempts: ${lastError.message}`);
}

// Main handler
exports.handler = async function (event) {
  console.log('Event received:', JSON.stringify(event, null, 2));

  try {
    const {
      object: { key },
      bucket: { name: bucketName },
    } = event.Records[0].s3;

    console.log('Processing S3 event:', { key, bucketName });

    if (event.Records[0].eventName !== 'ObjectCreated:Put') {
      console.log('Event is not ObjectCreated:Put, exiting');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Event is not ObjectCreated:Put, exiting',
        }),
      };
    }

    const fileNameWithExtension = key.split('/').pop();
    const folderPath = key.split('/').slice(0, -1).join('/');
    const fieldToUpdate = folderPath.split('/').pop();
    const partID = key.split('/').pop().split('.')[0];
    const accessString = `${fieldToUpdate}/${fileNameWithExtension}`;

    console.log('File details:', {
      fileNameWithExtension,
      folderPath,
      fieldToUpdate,
      partID,
      accessString
    });

    if (!VALID_FIELDS.includes(fieldToUpdate)) {
      console.log('Field is not in VALID_FIELDS:', fieldToUpdate);
      
      if (fieldToUpdate === 'adminApproval') {
        console.log('Processing admin approval for:', partID);
        try {
          await sendAdminApprovalEmail(partID);
          await deleteFileFromS3(bucketName, key);
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Admin approval processed successfully',
            }),
          };
        } catch (error) {
          console.error('Error processing admin approval:', error);
          throw error;
        }
      }

      console.error('Invalid field to update:', fieldToUpdate);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Invalid field: ${fieldToUpdate}`,
        }),
      };
    }

    // Update part with new file info
    const updatePartMutation = {
      query: `mutation UpdatePartField($id: ID!, $${fieldToUpdate}: String!) {
        updatePart(input: {id: $id, ${fieldToUpdate}: $${fieldToUpdate}}) {
          id
          ${fieldToUpdate}
          Provider {
            emails
          }
        }
      }`,
      operationName: 'UpdatePartField',
      variables: {
        id: partID,
        [fieldToUpdate]: accessString,
      },
    };

    console.log('Sending update mutation:', JSON.stringify(updatePartMutation, null, 2));

    const response = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      updatePartMutation,
      GQLAPIKEY,
    );

    console.log('Update response:', JSON.stringify(response, null, 2));

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    // Send email notifications if needed
    let emailResponse;
    if (
      response.data.updatePart.Provider?.emails?.length > 0 &&
      fieldToUpdate === 'counterReceiptImg'
    ) {
      console.log('Preparing to send email notification');
      
      const signedUrl = await new AWS.S3().getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: `public/${accessString}`,
        Expires: 60 * 60 * 24 * 7, // 7 days
      });

      console.log('Generated signed URL:', signedUrl);

      const emailParams = {
        Destination: {
          ToAddresses: response.data.updatePart.Provider.emails,
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <title>Contra recibo ingresado</title>
                    <style>
                      body {
                        color: black;
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.4;
                        margin: 0;
                        padding: 0;
                      }
                      
                      .container {
                        background-color: #f1f1f1;
                        color: #2d2d2d;
                        border-radius: 8px;
                        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
                        max-width: 80%;
                        padding: 40px;
                        margin: 20px auto;
                      }
                      
                      h1 {
                        color: #E06D37;
                        font-size: 24px;
                        font-weight: bold;
                        margin: 0 0 20px;
                        text-align: center;
                      }
                      
                      .logo {
                        display: block;
                        margin: 0 auto;
                        max-width: 200px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <img class="logo" src="https://i.imgur.com/n7ZMPf3.png" alt="Logo">
                      <h1>Contra recibo ingresado</h1>
                      <p>Se ha ingresado un contra recibo en el sistema CXP Camher para una parte en la que está registrado como proveedor.</p>
                      <p>ID de la parte: ${partID}</p>
                      <a href="${signedUrl}">
                        <p style="background-color: #E06D37; border-radius: 8px; font-size: 24px; font-weight: bold; padding: 10px; text-align: center; color: white;">Ver el archivo</p> 
                      </a>
                      <p>Nota: este enlace expirará en 7 días.</p>
                      <p>Si no has solicitado este correo, por favor ignora este mensaje.</p>
                    </div>
                  </body>
                </html>
              `,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Contra recibo ingresado',
          },
        },
        Source: 'Camher CXP <ctasxpagar@camher.com.mx>',
      };

      try {
        emailResponse = await sendEmailWithRetry(emailParams);
        console.log('Email sent successfully:', emailResponse);
      } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Operation completed successfully',
        updatePartResponse: response,
        emailResponse: emailResponse || 'No email sent',
      }),
    };

  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};