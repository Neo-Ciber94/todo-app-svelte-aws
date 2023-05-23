<script lang="ts">
  import TodoEditor from "@/lib/TodoEditor.svelte";
  import type { TodoModel } from "shared/lib/todos";

  export let todoId: string;
  const handleSubmit = (todo: Partial<TodoModel>) => {
    console.log(todo);
  };
</script>

<TodoEditor onSubmit={handleSubmit} submitLabel="Update" />
