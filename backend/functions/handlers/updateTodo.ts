import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { updateTodoModel, TodoModel } from 'shared/lib/todos';
import { parseEventBody } from '@/utils/parseEventBody';
import respondWith from '@/utils/respondWith';
import { dynamoDbClient } from '@/aws/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));

    const json = parseEventBody(event);

    if (json == null) {
        return respondWith.json(400, {
            message: 'Invalid body',
        });
    }

    const input = updateTodoModel.safeParse(json);

    if (input.success === false) {
        return respondWith.json(400, input.error);
    }

    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (userId == null || typeof userId !== 'string') {
        return respondWith.json(403, {
            message: 'User not found',
        });
    }

    const record = await dynamoDbClient
        .get({
            Key: { id: input.data.id },
            TableName: process.env.TABLE_NAME,
        })
        .promise();

    const item = record.Item as TodoModel | null;

    if (item == null || item.createdBy != userId) {
        return respondWith.json(404, { message: 'Not found' });
    }

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
        console.log('Record updated successfully.', JSON.stringify(result, null, 2));

        return respondWith.json(200, updated);
    } catch (error) {
        console.error('Error updating record:', error);
        return respondWith.json(500, {
            message: 'Failed to insert record',
        });
    }
};
