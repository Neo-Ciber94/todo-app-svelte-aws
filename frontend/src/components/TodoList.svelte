<script lang="ts">
  import type { TodoModel } from "shared/lib/todos";
  import TodoItem from "@/lib/TodoItem.svelte";
  import CreateTodoButton from "./CreateTodoButton.svelte";

  export let todos: TodoModel[] = [];
</script>

<div class="w-11/12 md:w-[700px] m-4 flex flex-col gap-3 mx-auto">
  <CreateTodoButton />

  {#if todos == null || todos.length === 0}
    <div class="text-white/20 text-4xl mx-auto my-10 font-mono">
      No todos found
    </div>
  {:else}
    {#each todos as todo}
      <TodoItem {todo} />
    {/each}
  {/if}
</div>
