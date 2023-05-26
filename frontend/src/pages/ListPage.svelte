<script lang="ts">
  import TodoList from "@/lib/TodoList.svelte";
  import { todoService } from "@/services";
  import { getErrorMessage } from "@/utils/getErrorMessage";
  import toastThemes from "@/utils/toastThemes";
  import { toast } from "@zerodevx/svelte-toast";
  import events from "@/utils/events";
  import type { TodoModel } from "shared/lib/todos";

  let todos: TodoModel[] = [];

  async function fetchTodos(): Promise<TodoModel[]> {
    try {
      const result = await todoService.getTodos();
      todos = result;
      return result;
    } catch (err) {
      console.error(err);
      toast.push({
        msg: getErrorMessage(err) || "Something went wrong",
        theme: toastThemes.error,
      });
      return [];
    }
  }

  const todoPromise = fetchTodos();

  window.addEventListener(events.revalidate, async () => {
    todos = await fetchTodos();
  });
</script>

{#await todoPromise}
  <p>Loading...</p>
{:then}
  <TodoList {todos} />
{/await}
