<script lang="ts">
    import { z } from "zod";
    import { Link } from "svelte-routing";

    const credentials = {
        code: "",
    };

    export let validator = z.object({
        code: z.string().min(1),
    });

    let error: Zod.ZodError<{ code: string }> | null = null;

    const handleResendCode = () => {
        console.log("resend");
    };

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        error = null;
        const result = validator.safeParse(credentials);

        if (result.success === true) {
            const data = result.data;
            console.log(data);
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
        <label class="text-violet-700" for="email">Code</label>
        <input
            id="email"
            name="code"
            type="text"
            class="form-input rounded"
            bind:value={credentials.code}
        />
        {#if error && error.formErrors.fieldErrors?.code?.[0]}
            <small class="text-xs text-red-500 italic"
                >{error.formErrors.fieldErrors.code[0]}</small
            >
        {/if}
    </div>

    <Link to="/login"
        ><div class="text-xs text-pink-500 hover:text-pink-700">Login?</div>
    </Link>

    <div class="mt-4">
        <button
            type="button"
            on:click={handleResendCode}
            class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
        >
            Resend
        </button>

        <button
            class="p-2 w-full rounded-md text-white bg-violet-500 hover:bg-violet-600"
        >
            Confirm
        </button>
    </div>
</form>
