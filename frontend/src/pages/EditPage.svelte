<script lang="ts">
  import TodoEditor from "@/lib/TodoEditor.svelte";
  import todoStore from "@/stores/todoStore";
  import { updateTodoModel, type TodoModel } from "shared/lib/todos";

  export let todoId: string;
  const todo = todoStore.getTodos().find((x) => x.id === todoId);

  const handleSubmit = (todo: Partial<TodoModel>) => {
    console.log("Update", todo);
  };
</script>

<TodoEditor
  {todo}
  onSubmit={handleSubmit}
  submitLabel="Update"
  validator={updateTodoModel}
/>
