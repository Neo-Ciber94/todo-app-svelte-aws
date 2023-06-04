<script lang="ts">
  import { todoService } from "@/services";
  import type { TodoModel } from "shared/lib/todos";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import { Link } from "svelte-routing";
  import { getErrorMessage } from "@/common/getErrorMessage";
  import events from "@/common/events";
  import { routes } from "@/common/routes";
  import toast from "@/common/toast";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  export let todo: TodoModel;
  let isDeleting = false;
  let isUpdating = false;

  const handleToggle = async () => {
    try {
      isUpdating = true;
      await todoService.toggleTodo(todo.id);
    } catch (err) {
      console.error(err);
      toast.error({
        message: getErrorMessage(err) || "Something went wrong",
      });
    } finally {
      isUpdating = false;
    }
  };

  const handleDelete = async () => {
    try {
      isDeleting = true;
      await todoService.deleteTodo(todo.id);
      window.dispatchEvent(new CustomEvent(events.revalidate));
      toast.error({
        message: "Todo was deleted",
      });
    } catch (err) {
      console.error(err);
      toast.error({
        message: getErrorMessage(err) || "Something went wrong",
      });
    } finally {
      isDeleting = false;
    }
  };
</script>

{#key todo.id}
  <Link to={routes.editTodo(todo.id)}
    ><div
      class="border border-gray-400/50 rounded-md shadow py-2 px-4 bg-white"
    >
      <div class="text-gray-800 flex flex-row justify-between items-center">
        <div class="flex flex-row items-center">
          <div class="mr-3">
            {#if isUpdating}
              <div class="text-indigo-600">
                <LoadingSpinner />
              </div>{:else}
              <input
                type="checkbox"
                disabled={isUpdating}
                class={`disabled:opacity-70 text-indigo-600 focus:ring-indigo-700 h-5 w-5`}
                bind:checked={todo.done}
                on:click|stopPropagation={handleToggle}
              />
            {/if}
          </div>

          <div
            class={`font-bold ${todo.done ? "line-through opacity-50" : ""}`}
          >
            {todo.title}
          </div>
        </div>

        <button
          disabled={isDeleting}
          on:click|stopPropagation|preventDefault={handleDelete}
          class={`disabled:opacity-70 text-red-500 
          }  text-3xl flex flex-row items-center justify-center w-4 h-4 ${
            isDeleting ? "" : "hover:text-red-700"
          }`}
        >
          {#if isDeleting}
            <LoadingSpinner />
          {:else}
            <FaRegTrashAlt />
          {/if}
        </button>
      </div>

      <div class="flex flex-row justify-between">
        {#if todo.content}
          <hr class="border border-gray-400/20 my-1" />
          <p
            class={`w-full py-2 ${todo.done ? "line-through opacity-30" : ""}`}
          >
            {todo.content}
          </p>
        {/if}
      </div>
    </div>
  </Link>
{/key}
