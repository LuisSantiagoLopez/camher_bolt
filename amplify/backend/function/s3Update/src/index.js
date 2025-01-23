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

const VALID_FIELDS = ['invoiceImg', 'partApprovalImg', 'counterRecieptImg'];

console.log('APPSYNCURL:', APPSYNCURL);
console.log('GQLAPIKEY:', GQLAPIKEY);
console.log('REGION:', REGION);

// Helper function to generate a signed AppSync request
function sendAppSyncRequest(url, region, method, data, apiKey) {
  const endpoint = new URL(url).hostname;
  const port = new URL(url).port;
  const req = new AWS.HttpRequest(url, region);

  req.method = method;
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.headers['x-api-key'] = apiKey;
  req.body = JSON.stringify(data);

  // Determine whether to use http or https based on apiKey
  const httpRequestModule = apiKey.includes('fakeApi') ? http : https;

  return new Promise((resolve, reject) => {
    const httpRequest = httpRequestModule.request(
      { ...req, host: endpoint, port: port }, // set the port explicitly
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            response.errors && response.errors.length > 0
              ? reject(new Error(response.errors[0].message))
              : resolve(response);
          } catch (e) {
            reject(new Error('Error parsing response: ' + e.message));
          }
        });
      },
    );

    httpRequest.on('error', (error) => {
      console.error(error.stack);
      reject(error);
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
}

// Helper function to delete a file from S3
async function deleteFileFromS3(bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  const s3 = new AWS.S3();

  try {
    await s3.deleteObject(params).promise();
    console.log(`Successfully deleted ${key} from ${bucketName}`);
  } catch (error) {
    console.error(`Error deleting ${key} from ${bucketName}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}

// Email function to send admin approved email to provider
// New function to send adminApproval email
async function sendAdminApprovalEmail(partID) {
  // Query to get Provider emails
  const getProviderEmailsQuery = {
    query: `query GetProviderEmails($id: ID!) {
      getPart(id: $id) {
        partReq {
          isCash
          isImportant
          partDescription
          price
          quantity
          unitaryPrice
        }
        Provider {
          emails
        }
      }
    }`,
    operationName: 'GetProviderEmails',
    variables: {
      id: partID,
    },
  };

  const response = await sendAppSyncRequest(
    APPSYNCURL,
    REGION,
    'POST',
    getProviderEmailsQuery,
    GQLAPIKEY,
  );

  const providerEmails = response.data.getPart.Provider.emails;

  if (!providerEmails || providerEmails.length === 0) {
    console.log('No provider emails to notify');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'No provider emails to notify',
      }),
    };
  }

  const emailParams = {
    Destination: {
      ToAddresses: providerEmails,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <html>
              <head>
                <meta charset="UTF-8">
                <title>Parte Aprobada por Administrador</title>
                <style>
                  body {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 1.4;
                      margin: 0;
                      padding: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                    }
                    
                    .container {
                      background-color: #f1f1f1;
                      color: #2d2d2d;
                      border-radius: 8px;
                      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
                      max-width: 80%;
                      padding: 40px;
                    }
                    
                    h1 {
                      color: #E06D37;
                      font-size: 24px;
                      font-weight: bold;
                      margin: 0 0 20px;
                      text-align: center;
                    }
                    
                    p {
                      margin: 0 0 20px;
                    }
                    
                    .code {
                      background-color: #E06D37;
                      border-radius: 8px;
                      font-size: 24px;
                      font-weight: bold;
                      padding: 10px;
                      text-align: center;
                      color: white;
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
                  <h1>Parte Aprobada por Administrador</h1>
                  <p>Una solicitud de partes ligada a ti como proveedor ha sido aprobada por un administrador de Camher.</p>
                  <p>ID de solicitud: ${partID}</p>
                   <table style="width:100%; margin-bottom: 20px; border-collapse: collapse;">
                  <tr style="background-color: #E06D37; color: white;">
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Descripción</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Cantidad</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Precio Unitario</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Precio Total</th>
                  </tr>
                  ${response.data.getPart.partReq.partDescription
                    .map(
                      (desc, index) => `
                      <tr>
                        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${desc}</td>
                        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                          response.data.getPart.partReq.quantity[index]
                        }</td>
                        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                          response.data.getPart.partReq.unitaryPrice[index]
                        }</td>
                        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
                          response.data.getPart.partReq.unitaryPrice[index] *
                          response.data.getPart.partReq.quantity[index]
                        }</td>
                      </tr>
                     `,
                    )
                    .join('')}
                    <tr style="background-color: #f1f1f1; font-weight: bold;">
                      <td colspan="3" style="padding: 8px; text-align: right; border-top: 1px solid #ddd;">Total:</td>
                      <td style="padding: 8px; text-align: left; border-top: 1px solid #ddd;">${
                        response.data.getPart.partReq.price
                      }</td>
                    </tr>
                  </table>
                  ${
                    response.data.getPart.partReq.isCash
                      ? '<p style="font-weight: bold;">Pago de Contado</p>'
                      : ''
                  }
                    <p>El espacio para cargar la factura estará disponible una vez que se reciban las partes y sean validadas por el mecánico.</p>
                    <a href="https://www.camher-aliadios.com.mx/" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #E06D37; border-radius: 8px; text-align: center; text-decoration: none; margin: 10px 0;">Ir a Panel CXP</a>
                  <p>Si no has solicitado este correo, por favor ignora este mensaje.</p>
                </div>
              </body>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Parte Aprobada por Administrador',
      },
    },
    Source: 'Camher CXP <ctasxpagar@camher.com.mx>',
  };

  try {
    console.log('Sending admin approval email to:', providerEmails);
    const emailResponse = await new AWS.SES().sendEmail(emailParams).promise();
    console.log(
      'Admin Approval Email Response:',
      JSON.stringify(emailResponse, null, 2),
    );
  } catch (error) {
    console.error('Error sending admin approval email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}

exports.handler = async function (event) {
  console.log('Event:', JSON.stringify(event, null, 2));
  if (GQLAPIKEY.includes('fakeApi')) {
    console.log('Running in mockApi mode');
  } else {
    console.log('Running in realApi mode');
  }

  try {
    const {
      object: { key },
      bucket: { name: bucketName },
    } = event.Records[0].s3;

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

    const accessString = `${fieldToUpdate}/${fileNameWithExtension}`; // Using the full filename here

    console.log('accessString:', accessString);

    if (!VALID_FIELDS.includes(fieldToUpdate)) {
      if (fieldToUpdate === 'adminApproval') {
        console.log(
          'Detected adminApproval field, calling sendAdminApprovalEmail function with, partID:',
          partID,
        );
        await sendAdminApprovalEmail(partID);

        console.log('Deleting file from S3:', key);
        // Delete the file from S3
        await deleteFileFromS3(bucketName, key);

        return {
          statusCode: 200,
          body: JSON.stringify({
            message:
              'Approved part email sent to provider and file deleted from S3, no further action required',
          }),
        };
      } else if (fieldToUpdate === 'table') {
        console.log(
          'Detected table field, internally updating customFile with:',
          accessString,
        );
        const updateCustomFileMutation = {
          query: `mutation UpdateCustomFileField($id: ID!, $customFile: String!) {
            updateTable(input: {id: $id, customFile: $customFile}) {
              id
              customFile
            }
          }`,
          operationName: 'UpdateCustomFileField',
          variables: {
            id: partID,
            customFile: accessString,
          },
        };

        console.log(
          'UpdateTableMutation:',
          JSON.stringify(updateCustomFileMutation, null, 2),
        );

        const response = await sendAppSyncRequest(
          APPSYNCURL,
          REGION,
          'POST',
          updateCustomFileMutation,
          GQLAPIKEY,
        );

        console.log('Response:', JSON.stringify(response, null, 2));

        if (response.errors) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              error: response.errors[0].message,
            }),
          };
        }
        return {
          statusCode: 200,
          body: JSON.stringify({
            updatePartResponse: response,
          }),
        };
      } else {
        console.error('Invalid field to update:', fieldToUpdate);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Invalid field to update',
          }),
        };
      }
    }

    // mutation to update the part since a new file has been uploaded
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

    console.log(
      'UpdatePartMutation:',
      JSON.stringify(updatePartMutation, null, 2),
    );

    const response = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      updatePartMutation,
      GQLAPIKEY,
    );

    console.log('Response:', JSON.stringify(response, null, 2));

    if (response.errors) {
      throw new Error(response.errors[0]);
    }

    let emailResponse;
    if (
      response.data.updatePart.Provider &&
      response.data.updatePart.Provider.emails.length > 0 &&
      fieldToUpdate === 'counterRecieptImg'
    ) {
      let signedUrl;
      try {
        signedUrl = await new AWS.S3().getSignedUrlPromise('getObject', {
          Bucket: bucketName,
          Key: `public/${accessString}`,
          Expires: 60 * 60 * 24 * 7, // 7 days
        });
        if (!signedUrl) {
          throw new Error('No signed URL');
        }
        console.log('Signed URL:', signedUrl);
      } catch (error) {
        console.error('Error getting signed URL:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: error.message,
          }),
        };
      }

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
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          height: 100vh;
                        }
                        
                        .container {
                          background-color: #f1f1f1;
                          color: #2d2d2d;
                          border-radius: 8px;
                          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
                          max-width: 80%;
                          padding: 40px;
                        }
                        
                        h1 {
                          color: #E06D37;
                          font-size: 24px;
                          font-weight: bold;
                          margin: 0 0 20px;
                          text-align: center;
                        }
                        
                        p {
                          margin: 0 0 20px;
                        }
                        
                        .code {
                          background-color: #E06D37;
                          border-radius: 8px;
                          font-size: 24px;
                          font-weight: bold;
                          padding: 10px;
                          text-align: center;
                          color: white;
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
                      <p class="code">Ver el archivo</p> 
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

      emailResponse = await new AWS.SES().sendEmail(emailParams).promise();

      console.log('Email Response:', JSON.stringify(emailResponse, null, 2));
    } else {
      console.log('No emails to notify');
      emailResponse = 'No emails to notify';
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatePartResponse: response,
        emailResponse: emailResponse,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
