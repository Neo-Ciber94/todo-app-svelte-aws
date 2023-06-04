<script lang="ts">
  import FormErrors from "@/components/FormErrors.svelte";
  import { todoService } from "@/services";
  import { createTodoModel, type CreateTodoModel } from "shared/lib/todos";
  import { navigate } from "svelte-routing";
  import { getErrorMessage } from "@/common/getErrorMessage";
  import { faker } from "@faker-js/faker";
  import toast from "@/common/toast";
  import LoadingSpinner from "@/components/LoadingSpinner.svelte";

  const todo: Partial<CreateTodoModel> = {};
  let issues: Zod.ZodIssue[] = [];
  let loading = false;

  const handleCancel = () => {
    if (loading) {
      return;
    }

    navigate("/");
  };

  const handleSubmit = async () => {
    const result = createTodoModel.safeParse(todo);

    try {
      loading = true;
      if (result.success === true) {
        await todoService.createTodo(result.data);
        navigate("/");
      } else {
        issues = result.error.issues;
      }
    } catch (err) {
      console.error(err);
      toast.error({
        message: getErrorMessage(err) || "Something went wrong",
      });
    } finally {
      loading = false;
    }
  };

  const generateTodo = () => {
    if (loading) {
      return;
    }

    todo.title = faker.word.words({
      count: {
        min: 3,
        max: 10,
      },
    });
    todo.content = faker.lorem.paragraph({ min: 3, max: 8 });
  };
</script>

<div class="w-11/12 md:w-[700px] m-4 flex flex-col mx-auto">
  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
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
        on:click={generateTodo}
        class="px-8 py-2 rounded-md shadow text-white bg-indigo-500 hover:bg-indigo-600 min-w-[120px]"
      >
        Generate
      </button>

      <button
        type="button"
        on:click={handleCancel}
        class="px-8 py-2 rounded-md shadow text-white bg-neutral-900 hover:bg-black min-w-[120px]"
      >
        Back
      </button>

      <button
        disabled={loading}
        class={`disabled:opacity-70 px-8 py-2 rounded-md shadow text-white bg-pink-500 min-w-[120px] ${
          loading ? "" : "hover:bg-pink-600"
        } `}
      >
        {#if loading}
          <LoadingSpinner />
        {:else}
          {`Create`}
        {/if}
      </button>
    </div>
  </form>
</div>
