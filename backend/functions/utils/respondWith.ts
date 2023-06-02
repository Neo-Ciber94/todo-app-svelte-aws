import { APIGatewayProxyResult } from 'aws-lambda';

export interface ResponseWithInit {
    statusCode: number;
    body: string;
    headers?: {
        [key: string]: string | number | boolean;
    };
}

interface RespondWithInterface {
    (init: ResponseWithInit): APIGatewayProxyResult;

    json<T>(statusCode: number, obj: T): APIGatewayProxyResult;
}

const respondWith: RespondWithInterface = (init: ResponseWithInit) => {
    const originsUrl = process.env.ORIGINS || '';

    return {
        ...init,
        headers: {
            ...init.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
};

respondWith.json = (statusCode, obj) => {
    return respondWith({
        statusCode,
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export default respondWith;
