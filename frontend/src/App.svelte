<script lang="ts">
  import CreatePage from "./pages/CreatePage.svelte";
  import EditPage from "./pages/EditPage.svelte";
  import ListPage from "./pages/ListPage.svelte";
  import { Router, Route } from "svelte-routing";
  import NavBar from "./lib/NavBar.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import NotFound from "./pages/NotFound.svelte";
  import Authorized from "./lib/Authorized.svelte";
  import SignIn from "./lib/SignIn.svelte";
</script>

<Router>
  <NavBar />

  <div class="mt-[50px]">
    <Authorized>
      <!-- List todos -->
      <Route path="/" component={ListPage} />

      <!-- Create todo -->
      <Route path="/new" component={CreatePage} />

      <!-- Edit todo -->
      <Route path="/edit/:id" let:params>
        <EditPage todoId={params.id} />
      </Route>

      <Route path="*" component={NotFound} />
    </Authorized>

    <!-- Login -->
    <Route path="/login">
      <SignIn />
    </Route>
  </div>
</Router>
<SvelteToast />
