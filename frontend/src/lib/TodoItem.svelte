<script lang="ts">
  import { todoService } from "@/services";
  import type { TodoModel } from "shared/lib/todos";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import { Link } from "svelte-routing";
  import { toast } from "@zerodevx/svelte-toast";
  import { getErrorMessage } from "@/utils/getErrorMessage";
  import toastThemes from "@/utils/toastThemes";
  import events from "@/utils/events";
  import { fade, fly } from "svelte/transition";

  export let todo: TodoModel;

  const handleToggle = async () => {
    try {
      await todoService.toggleTodo(todo.id);
    } catch (err) {
      console.error(err);
      toast.push({
        msg: getErrorMessage(err) || "Something went wrong",
        theme: toastThemes.error,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await todoService.deleteTodo(todo.id);
      window.dispatchEvent(new CustomEvent(events.revalidate));
      toast.push({
        msg: "Todo was deleted",
        theme: toastThemes.success,
      });
    } catch (err) {
      console.error(err);
      toast.push({
        msg: getErrorMessage(err) || "Something went wrong",
        theme: toastThemes.error,
      });
    }
  };
</script>

{#key todo.id}
  <Link to={`/edit/${todo.id}`}
    ><div
      class="border border-gray-400/50 rounded-md shadow py-2 px-4 bg-white"
    >
      <div class="text-gray-800 flex flex-row justify-between items-center">
        <div class="flex flex-row items-center">
          <input
            type="checkbox"
            class="mr-3 text-indigo-600 focus:ring-indigo-700 h-5 w-5"
            bind:checked={todo.done}
            on:click|stopPropagation={handleToggle}
          />
          <div
            class={`font-bold ${todo.done ? "line-through opacity-50" : ""}`}
          >
            {todo.title}
          </div>
        </div>

        <button
          on:click|stopPropagation|preventDefault={handleDelete}
          class="text-red-500 hover:text-red-700 text-3xl flex flex-row items-center justify-center w-4 h-4"
        >
          <FaRegTrashAlt />
        </button>
      </div>

      <hr class="border border-gray-400/20 my-1" />
      <div class="flex flex-row justify-between">
        <p class={`py-2 ${todo.done ? "line-through opacity-30" : ""}`}>
          {todo.content}
        </p>
      </div>
    </div>
  </Link>
{/key}
