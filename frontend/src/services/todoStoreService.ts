import type { TodoModel } from "shared/lib/todos";
import { writable, get } from "svelte/store";
import type { TodoService } from ".";
import { faker } from "@faker-js/faker";
import { wait } from "@/utils/wait";

const TODO_KEY = "todos";
const writer = writable<TodoModel[]>([]);
const { update, subscribe } = writer;

try {
  const json = localStorage.getItem(TODO_KEY);
  if (json) {
    const data = JSON.parse(json) as TodoModel[];
    writer.set(data || []);
  }
} catch (error: any) {
  console.error(error);
}

subscribe((todos) => {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
});

export class TodoStoreService implements TodoService {
  async getTodos(): Promise<TodoModel[]> {
    await wait(Math.random() * 300);
    return get(writer);
  }

  async getTodoById(id: string): Promise<TodoModel | null> {
    await wait(Math.random() * 300);
    return get(writer).find((x) => x.id === id) ?? null;
  }

  async createTodo(data: { title: string; content?: string }): Promise<TodoModel> {
    const now = new Date().toUTCString();
    const newTodo: TodoModel = {
      id: faker.string.uuid(),
      title: data.title,
      content: data.content ?? null,
      done: false,
      creationDate: now,
      createdBy: "fake-user-id",
      lastModifiedDate: now,
    };
    update((todos) => [...todos, newTodo]);
    return newTodo;
  }

  async updateTodo(newTodo: {
    id: string;
    title: string;
    content?: string;
  }): Promise<void> {
    const now = new Date().toUTCString();

    update((todos) => {
      return todos.map((todo) => {
        if (todo.id === newTodo.id) {
          return {
            ...todo,
            ...newTodo,
            lastModifiedDate: now,
          };
        } else {
          return { ...todo };
        }
      });
    });
  }

  async deleteTodo(id: string): Promise<void> {
    return update((todos) => todos.filter((todo) => todo.id !== id));
  }

  async toggleTodo(id: string): Promise<void> {
    const now = new Date().toUTCString();

    return update((todos) => {
      return todos.map((todo) =>
        todo.id === id
          ? { ...todo, done: !todo.done, lastModifiedDate: now }
          : { ...todo }
      );
    });
  }
}
