<script lang="ts">
  import { z } from "zod";
  import auth from "@/utils/auth";

  const signInValidator = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1),
  });

  const signIn = {
    username: "",
    password: "",
  };

  let error: Zod.ZodError<{ username: string; password: string }> | null = null;

  const onSubmit = async (event: Event) => {
    event.preventDefault();

    error = null;
    const result = signInValidator.safeParse(signIn);

    if (result.success === true) {
      const data = result.data;
      const obj = await auth.signIn(data.username, data.password);
      console.log(obj);
    } else {
      error = result.error;
    }
  };
</script>

<form
  on:submit={onSubmit}
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
      bind:value={signIn.username}
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
      bind:value={signIn.password}
    />

    {#if error && error.formErrors.fieldErrors?.password?.[0]}
      <small class="text-xs text-red-500 italic"
        >{error.formErrors.fieldErrors.password[0]}</small
      >
    {/if}
  </div>

  <div class="mt-4">
    <button
      class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
      >Login</button
    >
  </div>
</form>
