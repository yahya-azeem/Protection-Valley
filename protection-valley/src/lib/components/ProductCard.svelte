<script lang="ts">
  import type { GroupedProduct } from '$lib/types';
  import { selectedProduct, showPage, isWholesale } from '$lib/stores';
  import { base } from '$app/paths';
  import { DESIGN_TOKENS } from '$lib/config';

  let { product } = $props<{ product: GroupedProduct }>();
  
  // Use the first variant for display
  const displayVariant = product.variants?.[0];
  const price = displayVariant?.price || 0;
  const image = displayVariant?.image_url || `${base}/images/placeholder.png`;

  function handleSelect() {
    selectedProduct.set(product);
    showPage('product-detail');
  }
</script>

<button 
  onclick={handleSelect}
  class="group flex flex-col w-full text-left transition-lux rounded-sm overflow-hidden border border-white/5 bg-dark-surface hover:ring-1 hover:ring-primary/20 hover:shadow-gold"
>
  <!-- Image Container (OLED Black matched) -->
  <div class="relative aspect-square overflow-hidden bg-black flex items-center justify-center border-b border-white/5">
    <img 
      src={image} 
      alt={product.name}
      class="w-full h-full object-cover transition- lux duration-1000 group-hover:scale-105"
    />
    <!-- Subtle Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-lux"></div>
  </div>
  
  <!-- Content Area (Clean & High-Contrast) -->
  <div class="p-8 flex flex-col space-y-4">
    <div class="flex items-center space-x-3">
      <span class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-primary">
        {product.category}
      </span>
      <span class="h-[1px] w-6 bg-primary/20"></span>
    </div>
    
    <h3 class="text-xl font-serif text-white group-hover:text-primary transition-lux leading-snug tracking-tight">
      {product.name}
    </h3>
    
    <div class="pt-2 flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-lg font-serif text-white/95">
          ${$isWholesale ? (price * 0.7).toFixed(2) : price.toFixed(2)}
        </span>
        {#if $isWholesale}
          <span class="text-[0.6rem] font-bold text-zinc-600 line-through tracking-widest leading-none">${price.toFixed(2)}</span>
        {/if}
      </div>
      <div class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary transition-lux group-hover:border-primary">
        <span class="text-primary group-hover:text-black text-sm">→</span>
      </div>
    </div>
  </div>
</button>
