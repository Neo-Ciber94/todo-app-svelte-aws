<script lang="ts">
  import CreatePage from "./pages/CreatePage.svelte";
  import EditPage from "./pages/EditPage.svelte";
  import ListPage from "./pages/ListPage.svelte";
  import { Router, Route } from "svelte-routing";
  import NavBar from "./lib/NavBar.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import NotFound from "@/pages/NotFound.svelte";
  import Authorized from "@/components/Authorized.svelte";
  import auth from "@/common/auth";
  import SignUp from "@/components/SignUp.svelte";
  import Login from "@/components/Login.svelte";
  import ConfirmEmail from "@/components/ConfirmEmail.svelte";
</script>

<Router>
  <NavBar />

  <div class="mt-[50px]">
    <!-- Authorized routes -->
    <Authorized>
      <!-- List todos -->
      <Route path="/" component={ListPage} />

      <!-- Create todo -->
      <Route path="/new" component={CreatePage} />

      <!-- Edit todo -->
      <Route path="/edit/:id" let:params>
        <EditPage todoId={params.id} />
      </Route>
    </Authorized>

    <!-- Login -->
    <Route path="/login">
      {#if !auth.isAuthenticated()}
        <Login />
      {/if}
    </Route>

    <!-- Register -->
    <Route path="/signup">
      {#if !auth.isAuthenticated()}
        <SignUp />
      {/if}
    </Route>

    <!-- Confirm Code -->
    <Route path="/confirm_email">
      {#if !auth.isAuthenticated()}
        <ConfirmEmail />
      {/if}
    </Route>

    <!-- Not found -->
    <Route path="*" component={NotFound} />
  </div>
</Router>
<SvelteToast />
