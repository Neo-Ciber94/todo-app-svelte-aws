<script lang="ts">
  import type { TodoModel } from "shared/lib/todos";
  import { navigate } from "svelte-routing";
  import FormErrors from "./FormErrors.svelte";

  export let validator: Zod.ZodObject<any>;
  export let todo: Partial<TodoModel> = {};
  export let onSubmit: (todo: Partial<TodoModel>) => void;
  export let submitLabel = "Submit";
  let issues: Zod.ZodIssue[] = [];

  const handleSubmit = () => {
    const result = validator.safeParse(todo);
    if (result.success === true) {
      onSubmit(result.data);
      issues = [];
    } else {
      issues = result.error.issues;
    }
  };

  const handleCancel = () => {
    navigate("/");
  };
</script>

<div class="w-11/12 md:w-[700px] m-4 flex flex-col mx-auto">
  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
    {#if todo.id}
      <input
        value={todo.id}
        class="text-gray-500 form-input shadow-md rounded-md bg-gray-300"
        readonly
      />
    {/if}

    <div class="flex flex-col">
      <input
        name="title"
        bind:value={todo.title}
        class="form-input shadow-md rounded-md placeholder:italic"
        placeholder="Todo title..."
      />
    </div>

    <textarea
      name="content"
      bind:value={todo.content}
      class="form-textarea shadow-md rounded-md placeholder:italic"
      rows="4"
      placeholder="What do you want to do?"
    />

    {#if issues.length > 0}
      <FormErrors {issues} />
    {/if}

    <div class="flex flex-row justify-end gap-2">
      <button
        type="button"
        on:click={handleCancel}
        class="px-8 py-2 rounded-md shadow text-white bg-neutral-900 hover:bg-black min-w-[120px]"
      >
        Back
      </button>

      <button
        class="px-8 py-2 rounded-md shadow text-white bg-pink-500 hover:bg-pink-600 min-w-[120px]"
      >
        {submitLabel}
      </button>
    </div>
  </form>
</div>
