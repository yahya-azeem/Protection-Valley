<script lang="ts">
  import ProductDetail from '$lib/pages/ProductDetail.svelte';
  import { selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture } from '$lib/stores';
  import type { Product } from '$lib/types';

  interface Props {
    data: {
      product: Product | null;
    };
  }

  let { data }: Props = $props();

  // Sync server-side product to the client-side store using effect
  $effect(() => {
    if (data.product) {
      selectedProduct.set(data.product);
      
      // Initialize variant selection if not already set
      const variant = data.product.variants?.[0];
      if (variant) {
        selectedVariant.set(variant);
        selectedSize.set(variant.size || '');
        selectedColor.set(variant.color || '');
        selectedTexture.set(variant.texture || '');
      }
    }
  });

  // Reactive page title
  let title = $derived(data.product ? `${data.product.name} - Protection Valley` : 'Product Details');
</script>

<svelte:head>
  <title>{title}</title>
  {#if data.product}
    <meta name="description" content={data.product.description?.slice(0, 160) || ''} />
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
