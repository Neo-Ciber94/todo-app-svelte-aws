<script lang="ts">
    import { z } from "zod";
    import { Link, navigate } from "svelte-routing";
    import type { Credentials } from "@/models/types";
    import auth from "@/common/auth";
    import { routes } from "@/common/routes";
    import toast from "@/common/toast";
    import { getErrorMessage } from "@/common/getErrorMessage";

    const credentials = {
        username: "",
        password: "",
    };

    const validator: Zod.Schema<Credentials> = z.object({
        username: z.string().trim().min(1),
        password: z.string().min(8),
    });

    let error: Zod.ZodError<Credentials> | null = null;

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        error = null;
        const result = validator.safeParse(credentials);

        if (result.success === true) {
            try {
                const data = result.data;
                await auth.register(data.username, data.password);
                navigate(`${routes.confirmEmail}?email=${data.username}`);
            } catch (err) {
                toast.error({
                    message: getErrorMessage(err) ?? "Something went wrong",
                });
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
    <h4 class="text-center w-full text-2xl text-violet-500 mb-3">Register</h4>

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
            autocomplete="new-password"
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

    <div class="flex flex-row justify-between">
        <Link to="/login">
            <div class="text-xs text-pink-500 hover:text-pink-700">Login?</div>
        </Link>

        <Link to={routes.resendCode}>
            <div class="text-xs text-pink-500 hover:text-pink-700">
                Confirm Email
            </div>
        </Link>
    </div>

    <div class="mt-4">
        <button
            class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
        >
            Register
        </button>
    </div>
</form>
