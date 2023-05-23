import type {
  TodoModel,
  CreateTodoModel,
  UpdateTodoModel,
} from "shared/lib/todos";
import { writable, get } from "svelte/store";

const initialTodos: TodoModel[] = [
  {
    id: "1",
    title: "Complete task 1",
    content: "Finish the first task on the list.",
    done: false,
    creationDate: new Date(2023, 4, 22).toISOString(),
    lastModifiedDate: new Date(2023, 4, 22).toISOString(),
  },
  {
    id: "2",
    title: "Review project proposal",
    content: "Read and provide feedback on the project proposal document.",
    done: false,
    creationDate: new Date(2023, 4, 23).toISOString(),
    lastModifiedDate: new Date(2023, 4, 23).toISOString(),
  },
  {
    id: "3",
    title: "Buy groceries",
    content: "Purchase items from the grocery store.",
    done: false,
    creationDate: new Date(2023, 4, 24).toISOString(),
    lastModifiedDate: new Date(2023, 4, 24).toISOString(),
  },
];

const writer = writable(initialTodos);
const { subscribe, update } = writer;

function addTodo(newTodo: CreateTodoModel) {
  update((todos) => [...todos, newTodo]);
}

function updateTodo(newTodo: UpdateTodoModel) {
  update((todos) => {
    return todos.map((todo) => {
      if (todo.id === newTodo.id) {
        return {
          ...todo,
          ...newTodo,
        };
      } else {
        return { ...todo };
      }
    });
  });
}

function deleteTodo(id: string) {
  return update((todos) => todos.filter((todo) => todo.id !== id));
}

function toggleTodo(id: string) {
  return update((todos) => {
    return todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : { ...todo }
    );
  });
}

function getTodos() {
  return get(writer);
}

export default {
  subscribe,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getTodos,
};
