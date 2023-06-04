import type { TodoService } from ".";
import type { TodoModel } from "shared/lib/todos";
import httpClient from "@/common/httpClient";

export class TodoApiService implements TodoService {
  constructor(private readonly endpoint: string) { }

  async getTodos(): Promise<TodoModel[]> {
    const result = await httpClient.request(this.endpoint);
    return result.json();
  }

  async getTodoById(id: string): Promise<TodoModel | null> {
    const result = await httpClient.request(`${this.endpoint}/${id}`);
    return result.json();
  }

  async createTodo(data: { title: string; content?: string }): Promise<TodoModel> {
    const result = await httpClient.request(this.endpoint, {
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
    const result = await httpClient.request(this.endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return result.json();
  }

  async deleteTodo(id: string): Promise<void> {
    const result = await httpClient.request(`${this.endpoint}/${id}`, { method: "DELETE" });
    return result.json();
  }

  async toggleTodo(id: string): Promise<void> {
    const result = await httpClient.request(`${this.endpoint}/toggle/${id}`, {
      method: "PUT",
    });
    return result.json();
  }
}
