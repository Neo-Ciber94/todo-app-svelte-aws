<script lang="ts">
  import TodoList from "@/components/TodoList.svelte";
  import { todoService } from "@/services";
  import { getErrorMessage } from "@/common/getErrorMessage";
  import events from "@/common/events";
  import type { TodoModel } from "shared/lib/todos";
  import Loading from "@/components/Loading.svelte";
  import toast from "@/common/toast";

  let todos: TodoModel[] = [];

  async function fetchTodos(): Promise<TodoModel[]> {
    try {
      const result = await todoService.getTodos();
      todos = result;
      return result;
    } catch (err) {
      console.error(err);
      toast.error({
        message: getErrorMessage(err) || "Something went wrong",
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
  <Loading />
{:then}
  <TodoList {todos} />
{/await}
