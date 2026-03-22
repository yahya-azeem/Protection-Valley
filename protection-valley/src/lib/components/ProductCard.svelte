<script lang="ts">
  import type { Product } from '$lib/types';
  import { isWholesale, showPage, selectedProduct, selectedSize, selectedColor, selectedImageIndex } from '$lib/stores';

  let { product }: { product: Product } = $props();

  let price = $derived($isWholesale ? product.wholesalePrice : product.price);
  let originalPrice = $derived($isWholesale ? product.price : null);

  function showDetail() {
    selectedProduct.set(product);
    selectedSize.set(product.sizes[0]);
    selectedColor.set(product.colors[0]);
    selectedImageIndex.set(0);
    showPage('product-detail');
  }
</script>

<button onclick={showDetail} class="bg-dark-card rounded-lg overflow-hidden border border-dark-border hover:border-primary transition-colors group cursor-pointer text-left w-full">
  <div class="aspect-square overflow-hidden bg-dark-bg">
    <img src={product.image} alt={product.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>
  <div class="p-4">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs text-primary">{product.type}</span>
      <span class="text-xs text-dark-muted">•</span>
      <span class="text-xs text-dark-muted">{product.category}</span>
    </div>
    <h3 class="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
    <div class="flex items-center gap-2">
      <span class="text-xl font-serif text-primary">${price.toFixed(2)}</span>
      {#if originalPrice}
        <span class="text-sm text-dark-muted line-through">${originalPrice.toFixed(2)}</span>
      {/if}
    </div>
  </div>
</button>
