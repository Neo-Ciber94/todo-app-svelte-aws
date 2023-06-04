<script lang="ts">
    import { z } from "zod";
    import { Link, navigate } from "svelte-routing";
    import auth from "@/common/auth";
    import { onMount } from "svelte";
    import toast from "@/common/toast";
    import { routes } from "@/common/routes";
    import Redirect from "./Redirect.svelte";

    const credentials = {
        code: "",
    };

    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const emailValidator = z.string().email();
    const isValidEmail = emailValidator.safeParse(email).success === true;

    onMount(() => {
        console.log({ email });
        if (!isValidEmail) {
            toast.error({ message: "Invalid email" });
        }
    });

    const validator = z.object({
        code: z.string().min(1),
    });

    let error: Zod.ZodError<{ code: string }> | null = null;

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        error = null;
        const result = validator.safeParse(credentials);

        if (result.success === true) {
            const data = result.data;
            await auth.confirmUser(email!, data.code);

            toast.success({
                message: "Email confirmed",
            });
            navigate(routes.login);
        } else {
            error = result.error;
        }
    };
</script>

{#if isValidEmail}
    <form
        on:submit={handleSubmit}
        class="flex flex-col gap-2 w-[400px] px-8 pt-5 pb-10 shadow-md bg-white rounded-md font-bold font-mono mx-auto mt-20"
    >
        <h4 class="text-center w-full text-2xl text-violet-500 mb-3">
            Confirm
        </h4>

        <div class="flex flex-col">
            <label class="text-violet-700" for="code">Confirmation Code</label>
            <input
                id="code"
                name="code"
                type="text"
                class="form-input rounded"
                placeholder="Confirmation Code"
                bind:value={credentials.code}
            />
            {#if error && error.formErrors.fieldErrors?.code?.[0]}
                <small class="text-xs text-red-500 italic"
                    >{error.formErrors.fieldErrors.code[0]}</small
                >
            {/if}
        </div>

        <div class="flex flex-row justify-between">
            <Link to="/login"
                ><div class="text-xs text-pink-500 hover:text-pink-700">
                    Login?
                </div>
            </Link>

            <Link to="/resend_code"
                ><div class="text-xs text-pink-500 hover:text-pink-700">
                    Resend code
                </div>
            </Link>
        </div>

        <div class="mt-4">
            <button
                class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
            >
                Confirm
            </button>
        </div>
    </form>
{:else}
    <Redirect to={routes.login} />
{/if}
