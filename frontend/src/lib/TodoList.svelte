<script lang="ts">
  import TodoItem from "./TodoItem.svelte";
  import type { TodoModel } from "shared/lib/todos";

  export let todos: TodoModel[] = [
    {
      id: "1",
      title: "Complete task 1",
      content: "Finish the first task on the list.",
      done: false,
      creationDate: new Date(2023, 4, 22).toISOString(),
      lastModifiedDate: new Date(2023, 4, 22).toISOString(),
    },
    {
      id: "2",
      title: "Review project proposal",
      content: "Read and provide feedback on the project proposal document.",
      done: false,
      creationDate: new Date(2023, 4, 23).toISOString(),
      lastModifiedDate: new Date(2023, 4, 23).toISOString(),
    },
    {
      id: "3",
      title: "Buy groceries",
      content: "Purchase items from the grocery store.",
      done: false,
      creationDate: new Date(2023, 4, 24).toISOString(),
      lastModifiedDate: new Date(2023, 4, 24).toISOString(),
    },
  ];
</script>

<div class="w-full">
  <button>Create Todo</button>

  <div class="w-11/12 md:w-[700px] m-4 flex flex-col gap-3 mx-auto">
    {#each todos as todo}
      <TodoItem {todo} />
    {/each}
  </div>
</div>
