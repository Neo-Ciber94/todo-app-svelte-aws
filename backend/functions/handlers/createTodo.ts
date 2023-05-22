import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { createTodoModel, TodoModel } from '@/models/todos';
import { parseEventBody } from '@/utils/parseEventBody';
import { jsonResponse } from '@/utils/responses';
import crypto from 'crypto';
import { dynamoDbClient } from '@/aws/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));

    const json = parseEventBody(event);

    if (json == null) {
        return jsonResponse(400, {
            message: 'Invalid body',
        });
    }

    const input = createTodoModel.safeParse(json);

    if (input.success === false) {
        return jsonResponse(400, input.error);
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const newTodo: TodoModel = {
        id,
        title: input.data.title,
        content: input.data.content ?? null,
        done: false,
        creationDate: now,
        lastModifiedDate: now,
    };

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.TABLE_NAME,
        Item: newTodo,
    };

    try {
        const result = await dynamoDbClient.put(params).promise();

        if (result.$response.error) {
            return jsonResponse(500, result.$response.error);
        }

        console.log('Record inserted successfully.');

        const apiUrl = getApiUrl(event);

        return {
            statusCode: 201,
            body: JSON.stringify(newTodo),
            headers: apiUrl == null ? undefined : { Location: `${apiUrl}/${id}` },
        };
    } catch (error) {
        console.error('Error inserting record:', error);
        return jsonResponse(500, {
            message: 'Failed to insert record',
        });
    }
};

function getApiUrl(event: APIGatewayProxyEvent): string | undefined {
    const host = event['headers']['Host'];
    const stage = event['requestContext']['stage'];

    if (host == null || stage == null) {
        console.warn('Failed to get location url from event', event);
        return undefined;
    }

    return `https://${host}/${stage}`;
}
