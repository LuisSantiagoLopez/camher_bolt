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

// Helper function to get all admins
async function getAdministradores() {
  try {
    const adminQuery = {
      query: `query ListAdministradors {
        listAdministradors {
          items {
            emails
          }
        }
      }`,
    };
    
    const response = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      adminQuery,
      GQLAPIKEY,
    );
    
    return response.data.listAdministradors.items
      .flatMap(admin => admin.emails)
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching administrators:', error);
    throw error;
  }
}

// Helper function to get all contadores
async function getContadores() {
  try {
    const contadorQuery = {
      query: `query ListContadors {
        listContadors {
          items {
            emails
          }
        }
      }`,
    };
    
    const response = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      contadorQuery,
      GQLAPIKEY,
    );
    
    return response.data.listContadors.items
      .flatMap(contador => contador.emails)
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching contadores:', error);
    throw error;
  }
}

// Helper function to send admin notification
async function notifyAdministradores(partID, providerName) {
  const adminEmails = await getAdministradores();
  
  const emailParams = {
    Destination: {
      ToAddresses: adminEmails,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <html>
              <body>
                <h1>Nueva Refacción para Aprobar</h1>
                <p>El proveedor ${providerName} ha enviado una refacción para aprobación (ID: ${partID}).</p>
                <p>Por favor revise y apruebe la refacción en el sistema.</p>
              </body>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Nueva Refacción Requiere Aprobación',
      },
    },
    Source: 'Camher CXP <ctasxpagar@camher.com.mx>',
  };

  await sendEmailWithRetry(emailParams);
}

async function sendEmailWithRetry(params, maxRetries = 3) {
  const ses = new AWS.SES({ 
    apiVersion: '2010-12-01',
    region: REGION,
    maxRetries: 3
  });

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await ses.sendEmail(params).promise();
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Email send attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(`Failed to send email after ${maxRetries} attempts: ${lastError.message}`);
}

// Helper function to send contador notification
async function notifyContadores(partID, providerName) {
  const contadorEmails = await getContadores();
  
  const emailParams = {
    Destination: {
      ToAddresses: contadorEmails,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <html>
              <body>
                <h1>Nueva Factura Requiere Contrarecibo</h1>
                <p>El proveedor ${providerName} ha emitido una factura (ID: ${partID}).</p>
                <p>Por favor emita el contrarecibo correspondiente en el sistema.</p>
              </body>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Nueva Factura Requiere Contrarecibo',
      },
    },
    Source: 'Camher CXP <ctasxpagar@camher.com.mx>',
  };

  await sendEmailWithRetry(emailParams);
}


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

    // Handle special cases first
    if (!VALID_FIELDS.includes(fieldToUpdate)) {
      if (fieldToUpdate === 'adminApproval') {
        // Get part details to check status
        const partQuery = {
          query: `query GetPart($id: ID!) {
            getPart(id: $id) {
              id
              status
              partReq {
                price
                partDescription
              }
            }
          }`,
          variables: { id: partID }
        };

        const partResponse = await sendAppSyncRequest(
          APPSYNCURL,
          REGION,
          'POST',
          partQuery,
          GQLAPIKEY
        );

        const part = partResponse.data.getPart;
        
        // Get all administrators' emails
        const adminEmails = await getAdministradores();
        
        if (adminEmails.length > 0) {
          const emailParams = {
            Destination: { ToAddresses: adminEmails },
            Message: {
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: `
                    <html>
                      <head>
                        <style>
                          body { font-family: Arial, sans-serif; }
                          .container { padding: 20px; }
                          .header { color: #E06D37; }
                          .details { background: #f5f5f5; padding: 15px; margin: 10px 0; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <h1 class="header">Aprobación de Refacción Requerida</h1>
                          <div class="details">
                            <p><strong>ID de Parte:</strong> ${partID}</p>
                            <p><strong>Descripción:</strong> ${part.partReq?.partDescription || 'N/A'}</p>
                            <p><strong>Precio:</strong> $${part.partReq?.price || 0} MXN</p>
                          </div>
                          <p>Se requiere su aprobación para continuar con el proceso.</p>
                        </div>
                      </body>
                    </html>
                  `
                }
              },
              Subject: {
                Charset: 'UTF-8',
                Data: 'Aprobación de Refacción Requerida'
              }
            },
            Source: 'Camher CXP <ctasxpagar@camher.com.mx>'
          };

          await sendEmailWithRetry(emailParams);
        }

        await deleteFileFromS3(bucketName, key);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Admin notification sent successfully' })
        };
      }

      if (fieldToUpdate === 'invoiceImg') {
        // Get all accountants' emails
        const accountantEmails = await getContadores();
        
        if (accountantEmails.length > 0) {
          const emailParams = {
            Destination: { ToAddresses: accountantEmails },
            Message: {
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: `
                    <html>
                      <head>
                        <style>
                          body { font-family: Arial, sans-serif; }
                          .container { padding: 20px; }
                          .header { color: #E06D37; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <h1 class="header">Nueva Factura Recibida</h1>
                          <p>Se ha recibido una nueva factura para la parte ${partID}.</p>
                          <p>Por favor, proceda a emitir el contrarecibo correspondiente.</p>
                        </div>
                      </body>
                    </html>
                  `
                }
              },
              Subject: {
                Charset: 'UTF-8',
                Data: 'Nueva Factura Requiere Contrarecibo'
              }
            },
            Source: 'Camher CXP <ctasxpagar@camher.com.mx>'
          };

          await sendEmailWithRetry(emailParams);
        }
      }

      console.log('Field is not in VALID_FIELDS:', fieldToUpdate);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Invalid field: ${fieldToUpdate}` })
      };
    }

    // Handle regular file updates
    const updatePartMutation = {
      query: `mutation UpdatePartField($id: ID!, $${fieldToUpdate}: String!) {
        updatePart(input: {id: $id, ${fieldToUpdate}: $${fieldToUpdate}}) {
          id
          ${fieldToUpdate}
          Provider {
            emails
            name
          }
        }
      }`,
      variables: {
        id: partID,
        [fieldToUpdate]: accessString,
      },
    };

    const response = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      updatePartMutation,
      GQLAPIKEY
    );

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    // Handle counter receipt notification
    if (
      response.data.updatePart.Provider?.emails?.length > 0 &&
      fieldToUpdate === 'counterReceiptImg'
    ) {
      const signedUrl = await new AWS.S3().getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: `public/${accessString}`,
        Expires: 60 * 60 * 24 * 7 // 7 days
      });

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
                    <style>
                      body { font-family: Arial, sans-serif; }
                      .container { padding: 20px; }
                      .header { color: #E06D37; }
                      .button { 
                        background: #E06D37;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1 class="header">Contrarecibo Disponible</h1>
                      <p>Se ha generado un contrarecibo para la parte ${partID}.</p>
                      <p><a href="${signedUrl}" class="button">Ver Contrarecibo</a></p>
                      <p>Este enlace expirará en 7 días.</p>
                    </div>
                  </body>
                </html>
              `
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Nuevo Contrarecibo Disponible'
          }
        },
        Source: 'Camher CXP <ctasxpagar@camher.com.mx>'
      };

      await sendEmailWithRetry(emailParams);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Operation completed successfully',
        updatePartResponse: response
      })
    };

  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      })
    };
  }
};
