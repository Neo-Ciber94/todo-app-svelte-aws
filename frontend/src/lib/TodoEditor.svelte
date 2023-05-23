<script lang="ts">
  import type { TodoModel } from "shared/lib/todos";

  const todo: Partial<TodoModel> = {};
  export let onSubmit: (todo: Partial<TodoModel>) => void;
  export let submitLabel = "Submit";
</script>

<div class="w-11/12 md:w-[700px] m-4 flex flex-col mx-auto">
  <form
    on:submit|preventDefault={() => onSubmit(todo)}
    class="flex flex-col gap-4"
  >
    {#if todo.id}
      <input value={todo.id} class="text-gray-500/50" readonly />
    {/if}

    <input
      name="title"
      bind:value={todo.title}
      class="form-input shadow-md rounded-md placeholder:italic"
      placeholder="Todo title..."
    />
    <textarea
      name="content"
      bind:value={todo.content}
      class="form-textarea shadow-md rounded-md placeholder:italic"
      rows="4"
      placeholder="What do you want to do?"
    />
    <div class="flex flex-row justify-end">
      <button
        class="px-8 py-2 rounded-md shadow text-white bg-pink-500 hover:bg-pink-600"
        >{submitLabel}</button
      >
    </div>
  </form>
</div>
