<script lang="ts">
  import { navigate } from "svelte-routing";
  import auth from "@/utils/auth";
  import { onDestroy, onMount } from "svelte";

  const pathname = window.location.pathname;
  let unsubscribe: (() => void) | null = null;

  setTimeout(() => {
    if (!auth.isAuthenticated() && pathname !== "/login" && pathname !== "/signup" ) {
      const url = window.location.href;
      navigate(`/login?redirect=${encodeURIComponent(url)}`);
    }
  });

  onMount(() => {
    unsubscribe = auth.subscribe((session) => {
      console.log(session);
      if (!session) {
        navigate("/login");
      } else if (pathname === "/login") {
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect");

        if (redirect && redirect.length > 0) {
          const url = decodeURIComponent(redirect);
          window.location.assign(url);
        } else {
          navigate("/");
        }
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

{#if $auth}
  <slot />
{/if}
