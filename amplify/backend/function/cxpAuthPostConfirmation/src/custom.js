const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require('url').URL;
const region = process.env.REGION;
const appsyncUrl = process.env.API_CAMHERCXP_GRAPHQLAPIENDPOINTOUTPUT;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_CAMHERCXP_GRAPHQLAPIKEYOUTPUT;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  if (event.request.userAttributes.email && event.request.userAttributes.name) {
    console.log('trigger function invoked');
    const req = new AWS.HttpRequest(appsyncUrl, region);

    // Extract the handle from the email.
    const email = event.request.userAttributes.email;
    // extract the name
    const name = event.request.userAttributes.name;

    const item = {
      emails: [email],
      name: name,
    };

    req.method = 'POST';
    req.headers.host = endpoint;
    req.headers['Content-Type'] = 'application/json';
    req.headers['x-api-key'] = apiKey; // Include the API key in the headers
    req.body = JSON.stringify({
      query: `mutation CreateProvider($name: String!, $emails: [String!]!) {
        createProvider(input: {name: $name, emails: $emails}) {
          id
        }
      }`,
      operationName: 'CreateProvider',
      variables: item,
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
      console.error('Error in createProvider mutation:', error);
      return `Error in createProvider mutation: ${JSON.stringify(error)}`;
    }
  } else {
    // Error
    console.error('Error: No user was written to the database');
    return 'Error: No user was written to the database';
  }
};
