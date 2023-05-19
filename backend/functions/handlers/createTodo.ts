import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { createTodoModel } from '@/models/todos';
import { parseEventBody } from '@/utils/parseEventBody';
import { jsonResponse } from '@/utils/responses';
import crypto from 'crypto';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);

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

    const now = new Date().toUTCString();
    const id = crypto.randomUUID();
    const newTodo = {
        id,
        title: input.data.title,
        content: input.data.content,
        done: false,
        creationDate: now,
        lastModificationDate: now,
    };

    const dynamoDB = new DynamoDB.DocumentClient();
    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.TABLE_NAME,
        Item: newTodo,
    };

    try {
        const result = await dynamoDB.put(params).promise();
        const apiUrl = process.env.API_URL;
        console.log('Record inserted successfully.');
        return {
            statusCode: 201,
            body: JSON.stringify(result.$response.data),
            headers: {
                Location: `${apiUrl}/${id}`,
            },
        };
    } catch (error) {
        console.error('Error inserting record:', error);
        return jsonResponse(500, {
            message: 'Failed to insert record',
        });
    }
};
