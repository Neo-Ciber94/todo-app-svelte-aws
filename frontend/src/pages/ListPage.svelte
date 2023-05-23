<script lang="ts">
  import TodoList from "@/lib/TodoList.svelte";
  import todoStore from "@/stores/todoStore";

  const todos = todoStore.getTodos();
</script>

<TodoList {todos} />
