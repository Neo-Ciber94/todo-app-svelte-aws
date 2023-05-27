import respondWith from '@/utils/respondWith';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dynamoDbClient } from '@/aws/dynamodb';
import { TodoModel } from '@/models/todos';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));

    try {
        const params: DynamoDB.DocumentClient.ScanInput = {
            TableName: process.env.TABLE_NAME,
        };

        const result = await dynamoDbClient.scan(params).promise();
        const items = (result.Items as TodoModel[]).sort(
            (a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime(),
        );

        return respondWith.json(200, items);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return respondWith.json(500, { message: 'Failed to read todos' });
    }
};
