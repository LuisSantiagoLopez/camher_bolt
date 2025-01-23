const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require('url').URL;
const region = process.env.REGION;
const appsyncUrl = process.env.API_CAMHERCXP_GRAPHQLAPIENDPOINTOUTPUT;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_CAMHERCXP_GRAPHQLAPIKEYOUTPUT;

const listProvidersQuery = `
  query listProviders {
    listProviders {
      items {
        emails
      }
    }
  }
`;

async function fetchProviders() {
  const req = new AWS.HttpRequest(appsyncUrl, region);
  req.method = 'POST';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.headers['x-api-key'] = apiKey;
  req.body = JSON.stringify({
    query: listProvidersQuery,
  });

  try {
    const data = await new Promise((resolve, reject) => {
      const httpRequest = https.request(
        { ...req, host: endpoint },
        (result) => {
          result.on('data', (data) => {
            let parsedData = JSON.parse(data.toString());
            if (parsedData.errors && parsedData.errors.length > 0) {
              reject(parsedData.errors);
            } else {
              resolve(parsedData);
            }
          });
          result.on('error', (error) => {
            reject(error);
          });
        },
      );
      httpRequest.write(req.body);
      httpRequest.end();
    });
    return data;
  } catch (error) {
    console.error('Error in listProviders query:', error);
    return `Error fetching existing providers`;
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  if (event.request.userAttributes.email) {
    console.log('trigger function invoked');

    // Fetch providers and check if a provider with the given email already exists
    const providersData = await fetchProviders();
    const providers = providersData.data.listProviders.items;

    const providerEmails = providers
      .flatMap((provider) => provider.emails || [])
      .filter((email) => Boolean(email));
    console.log('Provider emails: ', providerEmails);

    const email = event.request.userAttributes.email; // email to check
    const providerExists = providerEmails.find((e) => e === email);
    console.log('Provider exists: ', providerExists);

    if (providerExists)
      throw new Error('El correo ya está asociado a un proveedor');
    else {
      console.log('Provider does not exist, returning event');
      return event;
    }
  } else throw new Error('Email is required');
};
