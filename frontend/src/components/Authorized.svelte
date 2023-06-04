<script lang="ts">
  import { navigate } from "svelte-routing";
  import auth from "@/common/auth";
  import { onMount } from "svelte";

  onMount(() => {
    const pathname = window.location.pathname;
    const isAuthenticated = auth.isAuthenticated();

    console.log({ isAuthenticated });

    if (!isAuthenticated) {
      if (
        pathname == "/login" ||
        pathname == "/signup" ||
        pathname == "/confirm_email"
      ) {
        return;
      }

      setTimeout(() => {
        if (pathname == "/") {
          navigate("/login");
        } else {
          const redirect = encodeURIComponent(window.location.href);
          navigate(`/login?redirect=${redirect}`);
        }
      });
    }
  });
</script>

{#if $auth}
  <slot />
{/if}
