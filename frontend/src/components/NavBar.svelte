<script>
  import { onDestroy, onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { globalHistory } from "svelte-routing/src/history";
  import auth from "@/utils/auth";

  let pathname = window.location.pathname;
  let unsubscribe = () => {};

  function handleLogout() {
    auth.logOut();
  }

  onMount(() => {
    unsubscribe = globalHistory.listen(({ location }) => {
      pathname = location.pathname;
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<nav
  class="py-4 px-10 bg-black text-white flex flex-row items-center justify-between uppercase font-mono text-2xl font-bold shadow-md"
>
  {#if $auth}
    <div class="flex flex-row gap-4">
      <Link
        to="/"
        class="hover:text-violet-400 transition-colors duration-200 hover:underline underline-offset-8"
        >Home</Link
      >

      {#if pathname !== "/new"}
        <Link
          to="/new"
          class="hover:text-violet-400 transition-colors duration-200 hover:underline underline-offset-8"
          >New</Link
        >
      {/if}
    </div>
  {/if}

  {#if $auth}
    <button
      on:click={handleLogout}
      class="uppercase hover:text-violet-400 transition-colors duration-200 hover:underline underline-offset-8"
      >Logout</button
    >
  {:else}
    <a
      href="/login"
      class="uppercase hover:text-violet-400 transition-colors duration-200 hover:underline underline-offset-8"
      >Login</a
    >
  {/if}
</nav>
