<script lang="ts">
  import CreatePage from "./pages/CreatePage.svelte";
  import EditPage from "./pages/EditPage.svelte";
  import ListPage from "./pages/ListPage.svelte";
  import { Router, Route } from "svelte-routing";
  import ViewPage from "./pages/ViewPage.svelte";
  import NavBar from "./lib/NavBar.svelte";
  import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<Router url="/">
  <NavBar />

  <div class="mt-[50px]">
    <!-- List todos -->
    <Route path="/" component={ListPage} />

    <!-- Create todo -->
    <Route path="/new" component={CreatePage} />

    <!-- Edit todo -->
    <Route path="/edit/:id" let:params>
      <EditPage todoId={params.id} />
    </Route>

    <!-- View todo -->
    <Route path="/view/:id" let:params>
      <ViewPage todoId={params.id} />
    </Route>
  </div>
</Router>
<SvelteToast />