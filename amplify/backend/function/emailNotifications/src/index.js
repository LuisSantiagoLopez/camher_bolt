const AWS = require('aws-sdk');
const https = require('https');
const { URL } = require('url');

const REGION = process.env.REGION;
const APPSYNCURL = process.env.API_CAMHERCXP_GRAPHQLAPIENDPOINTOUTPUT;
const GQLAPIKEY = process.env.API_CAMHERCXP_GRAPHQLAPIKEYOUTPUT;
const USER_POOL_ID = process.env.USER_POOL_ID;

const ses = new AWS.SES({ 
  apiVersion: '2010-12-01',
  region: REGION,
  maxRetries: 3
});

const cognito = new AWS.CognitoIdentityServiceProvider();

async function sendEmailWithRetry(params, maxRetries = 3) {
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

async function getUsersByGroup(groupName) {
  try {
    const users = [];
    let paginationToken = undefined;
    
    do {
      const params = {
        GroupName: groupName,
        UserPoolId: USER_POOL_ID,
        ...(paginationToken && { NextToken: paginationToken })
      };
      
      const response = await cognito.listUsersInGroup(params).promise();
      users.push(...response.Users);
      paginationToken = response.NextToken;
    } while (paginationToken);

    return users.map(user => {
      const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
      return emailAttribute ? emailAttribute.Value : null;
    }).filter(email => email);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function notifyContadores(partId, providerName) {
  const contadorEmails = await getUsersByGroup('contador');
  
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
                  <p>El proveedor ${providerName} ha subido una nueva factura para la parte ${partId}.</p>
                  <p>Por favor, proceda a emitir el contrarecibo correspondiente.</p>
                </div>
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

async function notifyAdministradores(partId, details) {
  const adminEmails = await getUsersByGroup('admin');
  
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
                    <p><strong>ID de Parte:</strong> ${partId}</p>
                    <p><strong>Descripción:</strong> ${details.description || 'N/A'}</p>
                    <p><strong>Precio:</strong> $${details.price || 0} MXN</p>
                  </div>
                  <p>Se requiere su aprobación para continuar con el proceso.</p>
                </div>
              </body>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Aprobación de Refacción Requerida',
      },
    },
    Source: 'Camher CXP <ctasxpagar@camher.com.mx>',
  };

  await sendEmailWithRetry(emailParams);
}

exports.handler = async (event) => {
  try {
    const { type, partId, details } = event;
    
    switch (type) {
      case 'NOTIFY_CONTADORES':
        await notifyContadores(partId, details.providerName);
        break;
      case 'NOTIFY_ADMINISTRADORES':
        await notifyAdministradores(partId, details);
        break;
      default:
        throw new Error('Invalid notification type');
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notifications sent successfully' }),
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};