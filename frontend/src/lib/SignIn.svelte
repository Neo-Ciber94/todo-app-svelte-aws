<script lang="ts">
  import auth from "@/utils/auth";
  import AuthForm, { AuthMode, type Credentials } from "./AuthForm.svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { getErrorMessage } from "@/utils/getErrorMessage";
  import themes from "@/utils/toastThemes";

  const onSubmit = async (credentials: Credentials) => {
    try {
      await auth.signIn(credentials.username, credentials.password);
    } catch (err) {
      console.error(err);
      toast.push({
        theme: themes.error,
        msg: getErrorMessage(err) ?? "Something went wrong",
      });
    }
  };
</script>

<AuthForm {onSubmit} mode={AuthMode.Login} />
