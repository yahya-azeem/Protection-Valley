<script lang="ts">
  import ProductDetail from '$lib/pages/ProductDetail.svelte';
  import { selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture, products } from '$lib/stores';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  let { data } = $props();

  // Sync server-side product to the client-side store
  onMount(() => {
    if (data.product) {
      selectedProduct.set(data.product);
      
      // Initialize variant selection
      const variant = data.product.variants?.[0];
      if (variant) {
        selectedVariant.set(variant);
        selectedSize.set(variant.size || '');
        selectedColor.set(variant.color || '');
        selectedTexture.set(variant.texture || '');
      }
    }
  });

  const title = data.product ? `${data.product.name} - Protection Valley` : 'Product Details';
</script>

<svelte:head>
  <title>{title}</title>
  {#if data.product}
    <meta name="description" content={data.product.description.slice(0, 160)} />
  {/if}
</svelte:head>

<div class="pt-20">
  {#if data.product}
    <ProductDetail />
  {:else}
    <div class="h-screen flex items-center justify-center text-zinc-500">
      Product not found
    </div>
  {/if}
</div>
