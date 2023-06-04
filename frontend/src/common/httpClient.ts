import auth from "@/common/auth";
import { getErrorMessage } from "./getErrorMessage";

const MAX_RETRY = 1;

const makeRequest = async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
    const res = await makeRequestWithRetry(0, input, init);
    return res;
}

async function makeRequestWithRetry(retryCount: number, input: RequestInfo | URL, init?: RequestInit | undefined) {
    const token = auth.getToken();
    const headers = token == null ? undefined : {
        "Authorization": `Bearer ${token}`,
        "Content-type": "application/json"
    };

    const response = await fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
            ...init?.headers,
            ...headers,
        }
    });

    if (!response.ok) {
        // We only retry on 401 errors
        if (response.status === 401) {
            if (retryCount < MAX_RETRY) {
                await auth.refreshSession()
                return makeRequestWithRetry(retryCount + 1, input, response)
            }
        }

        let error: string | null;

        if (response.headers.get('content-type') === 'application/json') {
            error = getErrorMessage(await response.json());
        } else {
            error = await response.text();
        }

        throw new Error(error ?? "Something went wrong");
    }

    return response;
}

export default {
    request: makeRequest
}