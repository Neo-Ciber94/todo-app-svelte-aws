<script>
  import { routes } from "@/common/routes";
  import { navigate } from "svelte-routing";

  const handleClick = () => {
    navigate(routes.newTodo);
  };
</script>

<button
  on:click={handleClick}
  class="text-white bg-pink-500 hover:bg-pink-600 transition-colors duration-300 mb-4 p-2 rounded-md shadow"
>
  Create Todo
</button>
