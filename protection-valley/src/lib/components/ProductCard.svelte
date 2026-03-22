<script lang="ts">
  import type { GroupedProduct } from '$lib/types';
  import { showPage, selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture } from '$lib/stores';

  let { product }: { product: GroupedProduct } = $props();
  
  // Use first variant as display variant
  let displayVariant = $derived(product.variants[0]);
  let price = $derived(displayVariant?.price || 0);

  function showDetail() {
    selectedProduct.set(product);
    if (displayVariant) {
      selectedVariant.set(displayVariant);
      selectedSize.set(displayVariant.size || '');
      selectedColor.set(displayVariant.color || '');
      selectedTexture.set(displayVariant.texture || '');
    }
    showPage('product-detail');
  }
</script>

<button onclick={showDetail} class="bg-dark-card rounded-lg overflow-hidden border border-dark-border hover:border-primary transition-colors group cursor-pointer text-left w-full">
  <div class="aspect-square overflow-hidden bg-dark-bg">
    <img src={displayVariant?.image_url || '/images/placeholder.jpg'} alt={product.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>
  <div class="p-4">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs text-primary">{product.model_number}</span>
      <span class="text-xs text-dark-muted">•</span>
      <span class="text-xs text-dark-muted">{product.category}</span>
    </div>
    <h3 class="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
    <div class="flex items-center gap-2">
      <span class="text-xl font-serif text-primary">${price.toFixed(2)}</span>
      <span class="text-xs text-dark-muted">{product.variants.length} variations</span>
    </div>
  </div>
</button>
