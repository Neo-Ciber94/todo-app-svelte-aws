import { APIGatewayProxyEvent } from 'aws-lambda';

export function parseEventBody(event: APIGatewayProxyEvent): unknown | null {
    if (event.body == null) {
        return null;
    }

    try {
        return JSON.parse(event.body);
    } catch {
        return null;
    }
}
