import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { updateTodoModel, TodoModel } from '@/models/todos';
import { parseEventBody } from '@/utils/parseEventBody';
import { jsonResponse } from '@/utils/responses';
import { dynamoDbClient } from '@/aws/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));

    const json = parseEventBody(event);

    if (json == null) {
        return jsonResponse(400, {
            message: 'Invalid body',
        });
    }

    const input = updateTodoModel.safeParse(json);

    if (input.success === false) {
        return jsonResponse(400, input.error);
    }

    const record = await dynamoDbClient
        .get({
            Key: { id: input.data.id },
            TableName: process.env.TABLE_NAME,
        })
        .promise();

    if (record.Item == null) {
        return jsonResponse(404, { message: 'Not found' });
    }

    const item = record.Item as unknown as TodoModel;
    const updated: TodoModel = {
        ...item,
        title: input.data.title,
        content: input.data.content ?? null,
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
