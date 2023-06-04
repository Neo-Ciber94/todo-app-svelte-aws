import { DynamoDB } from 'aws-sdk';

const endpoint = process.env.AWS_SAM_LOCAL == 'local' ? 'http://host.docker.internal:18000' : undefined;
export const dynamoDbClient = new DynamoDB.DocumentClient({
    endpoint,
});
