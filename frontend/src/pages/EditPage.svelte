<script lang="ts">
  import { navigate } from "svelte-routing";
  import { updateTodoModel, type TodoModel } from "shared/lib/todos";
  import { todoService } from "@/services";
  import FormErrors from "@/lib/FormErrors.svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { errorTheme } from "@/utils/toastThemes";
  import { getErrorMessage } from "@/utils/getErrorMessage";

  export let todoId: string;
  const todoPromise = todoService.getTodoById(todoId);
  let todo: TodoModel | null = null;
  let issues: Zod.ZodIssue[] = [];

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    console.log("Update", todo);
    const result = updateTodoModel.safeParse(todo);

    try {
      if (result.success === true) {
        await todoService.updateTodo(result.data);
      } else {
        issues = result.error.issues;
      }
    } catch (err) {
      toast.push({
        msg: getErrorMessage(err) || "Something went wrong",
        theme: errorTheme,
      });
    }
  };
</script>

{#await todoPromise}
  <p>Loading...</p>
{:then todoResult}
  {(todo = todoResult)}

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

      <FormErrors {issues} />

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
          Update
        </button>
      </div>
    </form>
  </div>
{:catch error}
  <p class="text-red-500">Error loading the todo {JSON.stringify(error)}</p>
{/await}
