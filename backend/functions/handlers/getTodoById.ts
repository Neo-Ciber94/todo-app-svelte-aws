import { jsonResponse } from '@/utils/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    const id = event.pathParameters?.id;

    if (id == null) {
        return jsonResponse(404, {
            message: 'Id was not specified',
        });
    }

    const dynamoDB = new DynamoDB.DocumentClient({
        endpoint: process.env.AWS_SAM_LOCAL == 'true' ? 'http://localhost:8000' : undefined,
    });
    const params: DynamoDB.DocumentClient.Get = {
        TableName: process.env.TABLE_NAME,
        Key: { id },
    };

    try {
        const result = await dynamoDB.get(params).promise();

        if (result.Item == null) {
            return jsonResponse(404, { message: `todo with id '${id}' was not found` });
        }

        return jsonResponse(200, result.Item);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return jsonResponse(500, { message: 'Failed to read todos' });
    }
};
