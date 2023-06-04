import auth from "@/common/auth";
import { getErrorMessage } from "./getErrorMessage";
import { navigate } from "svelte-routing";
import { routes } from "./routes";

const makeRequest = async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
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
        if (response.status === 401) {
            navigate(routes.login);
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