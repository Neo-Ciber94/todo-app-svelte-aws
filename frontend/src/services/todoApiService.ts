import auth from "@/common/auth";
import type { TodoService } from ".";
import type { TodoModel } from "shared/lib/todos";
import { getErrorMessage } from "@/common/getErrorMessage";

const fetchAPI = async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  const token = auth.getToken();
  const authHeaders = token == null ? undefined : {
    "Authorization": `Bearer ${token}`,
    "Content-type": "application/json"
  };

  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      ...authHeaders,
    }
  });

  if (!response.ok) {
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

export class TodoApiService implements TodoService {
  constructor(private readonly endpoint: string) { }

  async getTodos(): Promise<TodoModel[]> {
    const result = await fetchAPI(this.endpoint);
    return result.json();
  }

  async getTodoById(id: string): Promise<TodoModel | null> {
    const result = await fetchAPI(`${this.endpoint}/${id}`);
    return result.json();
  }

  async createTodo(data: { title: string; content?: string }): Promise<TodoModel> {
    const result = await fetchAPI(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.json();
  }

  async updateTodo(data: {
    id: string;
    title: string;
    content?: string;
  }): Promise<void> {
    const result = await fetchAPI(this.endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return result.json();
  }

  async deleteTodo(id: string): Promise<void> {
    const result = await fetchAPI(`${this.endpoint}/${id}`, { method: "DELETE" });
    return result.json();
  }

  async toggleTodo(id: string): Promise<void> {
    const result = await fetchAPI(`${this.endpoint}/toggle/${id}`, {
      method: "PUT",
    });
    return result.json();
  }
}
