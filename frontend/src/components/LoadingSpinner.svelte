<script>
    import FaSpinner from "svelte-icons/fa/FaSpinner.svelte";

    export let size = 20;
</script>

<div
    class={`flex flex-row justify-between items-center mx-auto`}
    style={`width: ${size}px; height: ${size}px`}
>
    <div class="animate-spin origin-center">
        <FaSpinner />
    </div>
</div>
