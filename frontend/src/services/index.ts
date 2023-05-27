import type {
  CreateTodoModel,
  TodoModel,
  UpdateTodoModel,
} from "shared/lib/todos";
import { TodoStoreService } from "./todoStoreService";
import { TodoApiService } from "./todoApiService";

export interface TodoService {
  getTodos(): Promise<TodoModel[]>;
  getTodoById(id: string): Promise<TodoModel | null>;
  createTodo(data: CreateTodoModel): Promise<TodoModel>;
  updateTodo(data: UpdateTodoModel): Promise<void>;
  deleteTodo(id: string): Promise<void>;
  toggleTodo(id: string): Promise<void>;
}

// export const todoService: TodoService = new TodoStoreService();
//export const todoService: TodoService = new TodoApiService("http://localhost:3000")
export const todoService: TodoService = new TodoApiService("https://sh6mo3fcza.execute-api.us-east-1.amazonaws.com/prod")
