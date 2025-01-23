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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  // Event is a cron event so it's ignored
  try {
    // Get current time-date
    const now = new Date();

    // Get time-date for 1 week from now (today is a sunday, so 1 week from now is a sunday)
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    // query table with type 'CURRENT' and set 'CURRENT' to 'HISTORY'
    const tablesByTypeOperation = {
      query: `query tablesByType($type: TableType!) {
        tablesByType(type: $type) {
          items {
            id
          }
        }
        }`,
      operationName: 'tablesByType',
      variables: {
        type: 'CURRENT',
      },
    };

    const tablesByTypeResponse = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      tablesByTypeOperation,
      GQLAPIKEY,
    );

    if (tablesByTypeResponse.errors) {
      console.log('tablesByTypeResponse.errors:', tablesByTypeResponse.errors);
      return {
        statusCode: 500,
        body: JSON.stringify(tablesByTypeResponse.errors),
      };
    } else if (tablesByTypeResponse.data.tablesByType.items.length === 0) {
      console.log('No current table found');
      return {
        statusCode: 404,
        body: JSON.stringify('No current table found'),
      };
    }

    const currentTable = tablesByTypeResponse.data.tablesByType.items[0];

    // Update current table to history
    const updateTableOperation = {
      query: `mutation updateTable($input: UpdateTableInput!) {
        updateTable(input: $input) {
          id
          type
        status
        }
      }`,
      operationName: 'updateTable',
      variables: {
        input: {
          id: currentTable.id,
          type: 'HISTORY',
          status: 1,
        },
      },
    };

    const updateTableResponse = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      updateTableOperation,
      GQLAPIKEY,
    );

    if (updateTableResponse.errors) {
      console.log('updateTableResponse.errors:', updateTableResponse.errors);
      return {
        statusCode: 500,
        body: JSON.stringify(updateTableResponse.errors),
      };
    }

    // Create new table
    const createTableOperation = {
      query: `mutation createTable($input: CreateTableInput!) {
            createTable(input: $input) {
                from
                to
                type
                status
            }
        }`,
      operationName: 'createTable',
      variables: {
        input: {
          from: now.toISOString(),
          to: oneWeekFromNow.toISOString(),
          type: 'CURRENT',
          status: 0,
        },
      },
    };

    const createTableResponse = await sendAppSyncRequest(
      APPSYNCURL,
      REGION,
      'POST',
      createTableOperation,
      GQLAPIKEY,
    );

    if (createTableResponse.errors) {
      console.log('createTableResponse.errors:', createTableResponse.errors);
      return {
        statusCode: 500,
        body: JSON.stringify(createTableResponse.errors),
      };
    }
  } catch (error) {
    console.log('error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  // DONE - new table created and old table updated to history return 200
  return {
    statusCode: 200,
    body: JSON.stringify('New table created and old table updated to history'),
  };
};
