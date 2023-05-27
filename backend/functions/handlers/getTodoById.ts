import respondWith from '@/utils/respondWith';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dynamoDbClient } from '@/aws/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));
    const id = event.pathParameters?.id;

    if (id == null) {
        return respondWith({
            statusCode: 429,
            body: JSON.stringify({
                message: 'Path parameter not specified',
            }),
        });
    }

    try {
        const params: DynamoDB.DocumentClient.GetItemInput = {
            Key: { id },
            TableName: process.env.TABLE_NAME,
        };

        const result = await dynamoDbClient.get(params).promise();

        if (result.Item == null) {
            return respondWith.json(404, { message: 'Not found' });
        }

        return respondWith.json(200, result.Item);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return respondWith.json(500, { message: 'Failed to read todos' });
    }
};
