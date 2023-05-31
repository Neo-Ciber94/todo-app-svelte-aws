import auth from "@/utils/auth";
import type { TodoService } from ".";
import type { TodoModel } from "shared/lib/todos";


export class TodoApiService implements TodoService {
  constructor(private readonly endpoint: string) { }

  async getTodos(): Promise<TodoModel[]> {
    const token = auth.getToken();
    const result = await fetch(this.endpoint, {
      headers: {
        "Authorization": token == null ? "" : "Bearer " + token
      }
    });
    return result.json();
  }

  async getTodoById(id: string): Promise<TodoModel | null> {
    const token = auth.getToken();
    const result = await fetch(`${this.endpoint}/${id}`, {
      headers: {
        "Authorization": token == null ? "" : "Bearer " + token
      }
    });
    return result.json();
  }

  async createTodo(data: { title: string; content?: string }): Promise<TodoModel> {
    const token = auth.getToken();
    const headers = {
      "Authorization": token == null ? undefined : "Bearer " + token
    };
    const result = await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...headers
    });
    return result.json();
  }

  async updateTodo(data: {
    id: string;
    title: string;
    content?: string;
  }): Promise<void> {
    const token = auth.getToken();
    const headers = {
      "Authorization": token == null ? undefined : "Bearer " + token
    };
    const result = await fetch(this.endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...headers
    });

    return result.json();
  }

  async deleteTodo(id: string): Promise<void> {
    const token = auth.getToken();
    const headers = {
      "Authorization": token == null ? undefined : "Bearer " + token
    };
    const result = await fetch(`${this.endpoint}/${id}`, { method: "DELETE", ...headers });
    return result.json();
  }

  async toggleTodo(id: string): Promise<void> {
    const token = auth.getToken();
    const headers = {
      "Authorization": token == null ? undefined : "Bearer " + token
    };

    const result = await fetch(`${this.endpoint}/toggle/${id}`, {
      method: "PUT",
      ...headers
    });
    return result.json();
  }
}
