import respondWith from '@/utils/respondWith';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { dynamoDbClient } from '@/aws/dynamodb';
import { TodoModel } from 'shared/lib/todos';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(JSON.stringify(event, null, 2));

    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

    if (userId == null || typeof userId !== 'string') {
        return respondWith.json(403, {
            message: 'User not found',
        });
    }

    try {
        const params: DynamoDB.DocumentClient.ScanInput = {
            TableName: process.env.TABLE_NAME,
            FilterExpression: `:createdBy = #userId`,
            ExpressionAttributeValues: {
                '#userId': userId,
            },
        };

        const result = await dynamoDbClient.scan(params).promise();
        const items = result.Items as TodoModel[];
        // const items = (result.Items as TodoModel[]).sort(
        //     (a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime(),
        // );

        return respondWith.json(200, items);
    } catch (error) {
        console.log('An error occurred while reading the todos', error);
        return respondWith.json(500, { message: 'Failed to read todos' });
    }
};
