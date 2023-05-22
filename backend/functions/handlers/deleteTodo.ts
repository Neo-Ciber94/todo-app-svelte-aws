import { jsonResponse } from '@/utils/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dynamoDbClient } from '@/aws/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));
    const id = event.pathParameters?.id;

    if (id == null) {
        return {
            statusCode: 429,
            body: JSON.stringify({
                message: 'Path parameter not specified',
            }),
        };
    }

    try {
        const getParams: DynamoDB.DocumentClient.GetItemInput = {
            Key: { id },
            TableName: process.env.TABLE_NAME,
        };

        const toDelete = await dynamoDbClient.get(getParams).promise();

        if (toDelete.Item == null) {
            return jsonResponse(404, { message: 'Not found' });
        }

        const deleteParams: DynamoDB.DocumentClient.DeleteItemInput = {
            Key: { id },
            TableName: process.env.TABLE_NAME,
        };

        const result = await dynamoDbClient.delete(deleteParams).promise();

        if (result.$response.error) {
            return jsonResponse(500, result.$response.error);
        }

        return jsonResponse(200, toDelete.Item);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return jsonResponse(500, { message: 'Failed to read todos' });
    }
};
