<script lang="ts">
  import MdError from "svelte-icons/md/MdError.svelte";

  export let issues: Zod.ZodIssue[];
</script>

<ul class="flex flex-col gap-3">
  {#each issues as issue}
    <li
      class="rounded-md p-2 font-mono shadow text-white bg-red-700 flex flex-row items-center gap-3"
    >
      <div class="h-6 w-6">
        <MdError />
      </div>
      {issue.path[0]} - {issue.message}
    </li>
  {/each}
</ul>
