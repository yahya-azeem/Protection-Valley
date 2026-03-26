<script lang="ts">
  import type { Product } from '$lib/types';
  import { selectedProduct, showPage, isWholesale } from '$lib/stores';
  import { base } from '$app/paths';
  import { WHOLESALE_DISCOUNT } from '$lib/constants';

  let { product } = $props<{ product: Product }>();
  
  let displayVariant = $derived(product.variants?.[0]);
  let price = $derived(displayVariant?.price || 0);
  let image = $derived(product.image_url || displayVariant?.image_url || `${base}/images/placeholder.png`);

  function handleSelect() {
    selectedProduct.set(product);
    showPage('product-detail');
  }
</script>

<button 
  onclick={handleSelect}
  class="group flex flex-col w-full text-left transition-lux rounded overflow-hidden border-2 border-white/20 bg-[#0A0A0A] hover:border-primary/60 hover:shadow-gold"
>
  <!-- Image -->
  <div class="relative aspect-square overflow-hidden bg-black flex items-center justify-center">
    <img 
      src={image} 
      alt={product.name}
      class="w-full h-full object-cover transition-lux duration-700 group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
  </div>
  
  <!-- Content -->
  <div class="p-5 flex flex-col gap-2 border-t-2 border-white/10">
    <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
      {product.category}
    </span>
    
    <h3 class="text-base font-serif text-white group-hover:text-primary transition-lux leading-snug">
      {product.name}
    </h3>

    {#if displayVariant?.texture}
      <span class="text-[11px] text-zinc-500">{displayVariant.texture}</span>
    {/if}
    
    <div class="pt-1 flex items-center justify-between">
      <div class="flex items-baseline gap-2">
        <span class="text-lg font-serif text-white">
          ${$isWholesale ? (price * (1 - WHOLESALE_DISCOUNT)).toFixed(2) : price.toFixed(2)}
        </span>
        {#if $isWholesale}
          <span class="text-xs text-zinc-600 line-through">${price.toFixed(2)}</span>
        {/if}
      </div>
      <div class="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary transition-lux group-hover:border-primary">
        <span class="text-primary group-hover:text-black text-sm">→</span>
      </div>
    </div>
  </div>
</button>
