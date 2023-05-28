import respondWith from '@/utils/respondWith';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dynamoDbClient } from '@/aws/dynamodb';
import { TodoModel } from 'shared/lib/todos';

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

    const userId = event.requestContext.authorizer?.claims?.sub;

    if (userId == null || typeof userId !== 'string') {
        return respondWith.json(403, {
            message: 'User not found',
        });
    }

    try {
        const params: DynamoDB.DocumentClient.GetItemInput = {
            Key: { id },
            TableName: process.env.TABLE_NAME,
        };

        const result = await dynamoDbClient.get(params).promise();
        const item = result.Item as TodoModel | null;

        if (item == null || item.createdBy != userId) {
            return respondWith.json(404, { message: 'Not found' });
        }

        return respondWith.json(200, item);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return respondWith.json(500, { message: 'Failed to read todos' });
    }
};
