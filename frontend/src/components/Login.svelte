<script lang="ts">
  import { z } from "zod";
  import { Link, navigate } from "svelte-routing";
  import type { Credentials } from "@/models/types";
  import auth from "@/common/auth";

  const credentials = {
    username: "",
    password: "",
  };

  const validator: Zod.Schema<Credentials> = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1),
  });

  let error: Zod.ZodError<Credentials> | null = null;

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    error = null;
    const result = validator.safeParse(credentials);

    if (result.success === true) {
      const data = result.data;
      await auth.signIn(data.username, data.password);

      // Redirect
      const search = window.location.search;
      if (search.length) {
        const searchParams = new URLSearchParams(search);
        const redirect = searchParams.get("redirect");

        if (redirect) {
          window.location.href = decodeURIComponent(redirect);
        } else {
          navigate("/");
        }
      }
    } else {
      error = result.error;
    }
  };
</script>

<form
  on:submit={handleSubmit}
  class="flex flex-col gap-2 w-[400px] px-8 pt-5 pb-10 shadow-md bg-white rounded-md font-bold font-mono mx-auto mt-20"
>
  <h4 class="text-center w-full text-2xl text-violet-500 mb-3">Login</h4>

  <div class="flex flex-col">
    <label class="text-violet-700" for="email">Email</label>
    <input
      id="email"
      name="email"
      type="email"
      class="form-input rounded"
      autocomplete="username"
      bind:value={credentials.username}
    />
    {#if error && error.formErrors.fieldErrors?.username?.[0]}
      <small class="text-xs text-red-500 italic"
        >{error.formErrors.fieldErrors.username[0]}</small
      >
    {/if}
  </div>

  <div class="flex flex-col">
    <label class="text-violet-700" for="password">Password</label>
    <input
      id="password"
      name="password"
      type="password"
      autocomplete="current-password"
      class="form-input rounded"
      minlength="8"
      bind:value={credentials.password}
    />

    {#if error && error.formErrors.fieldErrors?.password?.[0]}
      <small class="text-xs text-red-500 italic"
        >{error.formErrors.fieldErrors.password[0]}</small
      >
    {/if}
  </div>

  <Link to="/signup">
    <div class="text-xs text-pink-500 hover:text-pink-700">Register?</div>
  </Link>

  <div class="mt-4">
    <button
      class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
    >
      Login
    </button>
  </div>
</form>
