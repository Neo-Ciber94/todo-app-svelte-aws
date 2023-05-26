<script lang="ts">
  import { todoService } from "@/services";
  import type { TodoModel } from "shared/lib/todos";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import { Link } from "svelte-routing";
  import { toast } from '@zerodevx/svelte-toast'
  
  export let todo: TodoModel;

  const handleToggle = async () => {
    await todoService.toggleTodo(todo.id);
  };

  const handleDelete = async () => {
    await todoService.deleteTodo(todo.id);
  };
</script>

<Link to={`/edit/${todo.id}`}
  ><div class="border border-gray-400/50 rounded-md shadow py-2 px-4 bg-white">
    <div class="text-gray-800 flex flex-row justify-between items-center">
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          class="mr-3 text-indigo-600 focus:ring-indigo-700 h-5 w-5"
          bind:checked={todo.done}
          on:click|stopPropagation={handleToggle}
        />
        <div class={`font-bold ${todo.done ? "line-through opacity-50" : ""}`}>
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
