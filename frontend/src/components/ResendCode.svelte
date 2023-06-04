<script lang="ts">
    import { z } from "zod";
    import { navigate } from "svelte-routing";
    import { routes } from "@/common/routes";
    import auth from "@/common/auth";
    import toast from "@/common/toast";
    import { getErrorMessage } from "@/common/getErrorMessage";

    const credentials = {
        email: "",
    };

    const validator = z.object({
        email: z.string().min(1),
    });

    let error: Zod.ZodError<{ email: string }> | null = null;

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        error = null;
        const result = validator.safeParse(credentials);

        if (result.success === true) {
            try {
                const data = result.data;
                await auth.resendCode(data.email);

                toast.success({
                    message: "Confirmation code was sent",
                });

                navigate(`${routes.confirmEmail}?email=${data.email}`);
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
    <h4 class="text-center w-full text-2xl text-violet-500 mb-3">Confirm</h4>

    <div class="flex flex-col">
        <label class="text-violet-700" for="email">Email</label>
        <input
            id="email"
            name="code"
            type="email"
            class="form-input rounded"
            placeholder="Email"
            bind:value={credentials.email}
        />
        {#if error && error.formErrors.fieldErrors?.email?.[0]}
            <small class="text-xs text-red-500 italic"
                >{error.formErrors.fieldErrors.email[0]}</small
            >
        {/if}
    </div>

    <div class="mt-4">
        <button
            class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
        >
            Resend
        </button>
    </div>
</form>
