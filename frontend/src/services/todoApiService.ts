import auth from "@/utils/auth";
import type { TodoService } from ".";
import type { TodoModel } from "shared/lib/todos";

const fetchUrl = (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  const token = auth.getToken();
  const authHeaders = token == null ? undefined : {
    "Authorization": `Bearer ${token}`,
  };

  return fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      ...authHeaders,
    }
  })
}

export class TodoApiService implements TodoService {
  constructor(private readonly endpoint: string) { }

  async getTodos(): Promise<TodoModel[]> {
    const result = await fetchUrl(this.endpoint);
    return result.json();
  }

  async getTodoById(id: string): Promise<TodoModel | null> {
    const result = await fetchUrl(`${this.endpoint}/${id}`);
    return result.json();
  }

  async createTodo(data: { title: string; content?: string }): Promise<TodoModel> {
    const result = await fetchUrl(this.endpoint, {
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
    const result = await fetchUrl(this.endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return result.json();
  }

  async deleteTodo(id: string): Promise<void> {
    const result = await fetchUrl(`${this.endpoint}/${id}`, { method: "DELETE" });
    return result.json();
  }

  async toggleTodo(id: string): Promise<void> {
    const result = await fetchUrl(`${this.endpoint}/toggle/${id}`, {
      method: "PUT",
    });
    return result.json();
  }
}
