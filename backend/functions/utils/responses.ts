import { APIGatewayProxyResult } from 'aws-lambda';

export function jsonResponse(statusCode: number, obj: unknown): APIGatewayProxyResult {
    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode,
        body: JSON.stringify(obj),
    };
}
