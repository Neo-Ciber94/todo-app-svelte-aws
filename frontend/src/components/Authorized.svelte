<script lang="ts">
  import { navigate } from "svelte-routing";
  import auth from "@/common/auth";
  import { onDestroy, onMount } from "svelte";
  import { routes } from "@/common/routes";

  let unsubscribe: () => void = () => {};

  onMount(() => {
    unsubscribe = auth.subscribe((session) => {
      const isAuthenticated = session != null;
      const pathname = window.location.pathname;

      if (isAuthenticated) {
        return;
      }

      if (
        pathname == routes.login ||
        pathname == routes.signup ||
        pathname == routes.confirmEmail
      ) {
        return;
      }

      setTimeout(() => {
        if (pathname == "/") {
          navigate(routes.login);
        } else {
          const redirect = encodeURIComponent(window.location.href);
          navigate(`${routes.login}?redirect=${redirect}`);
        }
      });
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
