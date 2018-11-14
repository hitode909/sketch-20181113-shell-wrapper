import * as AWS from 'aws-sdk';

import { Executor } from './Executor';

const parameters = process.argv.slice(2);

(async () => {
  const executor = new Executor();
  let result;
  try {
    result = await executor.execute(parameters);
  } catch (error) {
    console.warn(error);
    process.exit(1);
  }

  const documentClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true,
  });

  const putDocument = {
    TableName: 'shell-history',
    Item: result as Object,
  };
  await documentClient.put(putDocument).promise();
})();
