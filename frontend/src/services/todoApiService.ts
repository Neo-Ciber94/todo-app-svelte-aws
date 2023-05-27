import type { TodoService } from ".";

export class TodoApiService implements TodoService {
  constructor(private readonly endpoint: string) {}

  async getTodos(): Promise<
    {
      id?: string;
      title?: string;
      content?: string;
      done?: boolean;
      creationDate?: string;
      lastModifiedDate?: string;
    }[]
  > {
    const result = await fetch(this.endpoint);
    return result.json();
  }

  async getTodoById(id: string): Promise<{
    id?: string;
    title?: string;
    content?: string;
    done?: boolean;
    creationDate?: string;
    lastModifiedDate?: string;
  }> {
    const result = await fetch(`${this.endpoint}/${id}`);
    return result.json();
  }

  async createTodo(data: { title?: string; content?: string }): Promise<{
    id?: string;
    title?: string;
    content?: string;
    done?: boolean;
    creationDate?: string;
    lastModifiedDate?: string;
  }> {
    const result = await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.json();
  }

  async updateTodo(data: {
    id?: string;
    title?: string;
    content?: string;
  }): Promise<void> {
    const result = await fetch(this.endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result.json();
  }

  async deleteTodo(id: string): Promise<void> {
    const result = await fetch(`${this.endpoint}/${id}`, { method: "DELETE" });
    return result.json();
  }

  async toggleTodo(id: string): Promise<void> {
    const result = await fetch(`${this.endpoint}/toggle/${id}`, {
      method: "PUT",
    });
    return result.json();
  }
}
