<script lang="ts">
  import { navigate } from "svelte-routing";
  import auth from "@/utils/auth";
  import { onDestroy, onMount } from "svelte";

  const pathname = window.location.pathname;
  let unsubscribe: () => void | null = null;

  if (auth.isAuthenticated() && pathname === "/login") {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.length > 0) {
      const url = decodeURIComponent(redirect);
      window.location.assign(url);
    } else {
      navigate("/");
    }
  }

  if (!auth.isAuthenticated() && pathname !== "/login") {
    const url = window.location.href;
    navigate(`/login?redirect=${encodeURIComponent(url)}`);
  }

  onMount(() => {
    unsubscribe = auth.subscribe((session) => {
      if (!session) {
        navigate("/login");
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

{#if auth.isAuthenticated()}
  <slot />
{/if}
