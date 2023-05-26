<script lang="ts">
  import TodoList from "@/lib/TodoList.svelte";
  import { todoService } from "@/services";
  import { getErrorMessage } from "@/utils/getErrorMessage";
  import { errorTheme } from "@/utils/toastThemes";
  import { toast } from "@zerodevx/svelte-toast";

  const todoPromise = todoService.getTodos().catch((err) => {
    console.error(err);
    toast.push({
      msg: getErrorMessage(err) || "Something went wrong",
      theme: errorTheme,
    });
    return [];
  });
</script>

{#await todoPromise then todos}
  <TodoList {todos} />
{/await}
