<script lang="ts">
  import TodoEditor from "@/lib/TodoEditor.svelte";
  import { createTodoModel, type TodoModel } from "shared/lib/todos";

  const handleSubmit = (todo: Partial<TodoModel>) => {
    console.log("Create", todo);
  };
</script>

<TodoEditor
  onSubmit={handleSubmit}
  submitLabel="Create"
  validator={createTodoModel}
/>
