import respondWith from '@/utils/respondWith';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dynamoDbClient } from '@/aws/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));
    const id = event.pathParameters?.id;

    if (id == null) {
        return respondWith.json(429, {
            message: 'Path parameter not specified',
        });
    }

    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (userId == null || typeof userId !== 'string') {
        return respondWith.json(403, {
            message: 'User not found',
        });
    }

    try {
        const getParams: DynamoDB.DocumentClient.GetItemInput = {
            Key: { id },
            TableName: process.env.TABLE_NAME,
        };

        const toDelete = await dynamoDbClient.get(getParams).promise();

        if (toDelete.Item == null) {
            return respondWith.json(404, { message: 'Not found' });
        }

        const deleteParams: DynamoDB.DocumentClient.DeleteItemInput = {
            Key: { id },
            ConditionExpression: `:createdBy = ${userId}`,
            TableName: process.env.TABLE_NAME,
        };

        const result = await dynamoDbClient.delete(deleteParams).promise();

        if (result.$response.error) {
            return respondWith.json(500, result.$response.error);
        }

        return respondWith.json(200, toDelete.Item);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return respondWith.json(500, { message: 'Failed to read todos' });
    }
};
