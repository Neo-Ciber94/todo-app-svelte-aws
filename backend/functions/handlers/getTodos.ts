import { jsonResponse } from '@/utils/responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

    const dynamoDB = new DynamoDB.DocumentClient({
        endpoint: process.env.AWS_SAM_LOCAL == 'true' ? 'http://localhost:8000' : undefined,
    });
    const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: process.env.TABLE_NAME,
    };

    try {
        const result = await dynamoDB.scan(params).promise();
        return jsonResponse(200, result.Items);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return jsonResponse(500, { message: 'Failed to read todos' });
    }
};
