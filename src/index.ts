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
  console.log(result);

  const dynamodb = new AWS.DynamoDB();

  console.log(1);
  const list = await dynamodb.listTables().promise();
  console.log(list);
  console.log(2);
})();
