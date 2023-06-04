import type {
  CreateTodoModel,
  TodoModel,
  UpdateTodoModel,
} from "shared/lib/todos";
import { TodoApiService } from "./todoApiService";

export interface TodoService {
  getTodos(): Promise<TodoModel[]>;
  getTodoById(id: string): Promise<TodoModel | null>;
  createTodo(data: CreateTodoModel): Promise<TodoModel>;
  updateTodo(data: UpdateTodoModel): Promise<void>;
  deleteTodo(id: string): Promise<void>;
  toggleTodo(id: string): Promise<void>;
}

const apiUrl = import.meta.env.VITE_API_URL;
export const todoService: TodoService = new TodoApiService(apiUrl)
