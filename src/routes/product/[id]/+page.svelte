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

  // Reactive page title and SEO values
  let title = $derived(data.product ? `${data.product.name} | Protection Valley` : 'Product Details | Protection Valley');
  let description = $derived(data.product?.description 
    ? (data.product.description.length > 155 ? `${data.product.description.slice(0, 155)}...` : data.product.description)
    : 'Premium protective workwear and industrial contractor gear from Protection Valley.');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="product" />
  {#if data.product?.image_url}
    <meta property="og:image" content={data.product.image_url.startsWith('http') ? data.product.image_url : `https://protectionvalley.com${data.product.image_url}`} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
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
