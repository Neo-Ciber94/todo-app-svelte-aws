<script lang="ts">
  import CreatePage from "@/pages/CreatePage.svelte";
  import EditPage from "@/pages/EditPage.svelte";
  import ListPage from "@/pages/ListPage.svelte";
  import { Router, Route } from "svelte-routing";
  import NavBar from "@/components/NavBar.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import NotFound from "@/pages/NotFound.svelte";
  import Authorized from "@/components/Authorized.svelte";
  import auth from "@/common/auth";
  import SignUp from "@/components/SignUp.svelte";
  import Login from "@/components/Login.svelte";
  import ConfirmEmail from "@/components/ConfirmEmail.svelte";
  import { routes } from "./common/routes";
  import ResendCode from "./components/ResendCode.svelte";
</script>

<Router>
  <NavBar />

  <div class="mt-[50px]">
    <!-- Authorized routes -->
    <Authorized>
      <!-- List todos -->
      <Route path="/" component={ListPage} />

      <!-- Create todo -->
      <Route path={routes.newTodo} component={CreatePage} />

      <!-- Edit todo -->
      <Route path={routes.editTodo(":id")} let:params>
        <EditPage todoId={params.id} />
      </Route>
    </Authorized>

    <!-- Login -->
    <Route path={routes.login}>
      {#if !$auth}
        <Login />
      {/if}
    </Route>

    <!-- Register -->
    <Route path={routes.signup}>
      {#if !$auth}
        <SignUp />
      {/if}
    </Route>

    <!-- Confirm Email -->
    <Route path={routes.confirmEmail}>
      {#if !$auth}
        <ConfirmEmail />
      {/if}
    </Route>

    <!-- Resend code -->
    <Route path={routes.resendCode}>
      {#if !$auth}
        <ResendCode />
      {/if}
    </Route>

    <!-- Not found -->
    <Route path="*" component={NotFound} />
  </div>
</Router>
<SvelteToast />
