<script lang="ts">
  import Catalog from '$lib/pages/Catalog.svelte';
  import { products } from '$lib/stores';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  let { data } = $props();

  // Sync server-side products to the client-side store for components that rely on it
  onMount(() => {
    if (data.products) {
      products.set(data.products);
    }
  });
</script>

<svelte:head>
  <title>Workwear Catalog - Protection Valley</title>
  <meta name="description" content="Browse our premium selection of protection workwear, from hi-vis vests to rugged safety boots." />
</svelte:head>

<Catalog />
