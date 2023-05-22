import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { TodoModel } from '@/models/todos';
import { jsonResponse } from '@/utils/responses';
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

    const record = await dynamoDbClient
        .get({
            Key: { id },
            TableName: process.env.TABLE_NAME,
        })
        .promise();

    if (record.Item == null) {
        return jsonResponse(404, { message: 'Not found' });
    }

    const item = record.Item as unknown as TodoModel;
    const updated: TodoModel = {
        ...item,
        done: !Boolean(item.done),
        lastModifiedDate: new Date().toISOString(),
    };

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.TABLE_NAME,
        Item: updated,
    };

    try {
        const result = await dynamoDbClient.put(params).promise();
        console.log('Record updated successfully.');

        return {
            statusCode: 200,
            body: JSON.stringify(result.$response.data),
        };
    } catch (error) {
        console.error('Error updating record:', error);
        return jsonResponse(500, {
            message: 'Failed to insert record',
        });
    }
};
