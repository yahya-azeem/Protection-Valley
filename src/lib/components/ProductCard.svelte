<script lang="ts">
  import type { Product } from '$lib/types';
  import { isWholesale } from '$lib/stores';
  import { base } from '$app/paths';
  import { WHOLESALE_DISCOUNT } from '$lib/constants';
  import OptimizedImage from './OptimizedImage.svelte';

  let { product } = $props<{ product: Product }>();
  
  let displayVariant = $derived(product.variants?.[0]);
  let price = $derived(displayVariant?.price || 0);
  let image = $derived(product.image_url || displayVariant?.image_url || `${base}/images/logo.png`);
</script>

<a 
  href="/product/{product.id}"
  class="group flex flex-col w-full text-left transition-lux rounded overflow-hidden border border-white/10 bg-[#0A0A0A] hover:border-primary/60 hover:shadow-gold"
>
  <!-- Image -->
  <div class="relative aspect-square overflow-hidden bg-black flex items-center justify-center">
    <OptimizedImage 
      src={image} 
      alt={product.name}
      class="w-full h-full object-cover transition-lux duration-700 group-hover:scale-105"
      width={300}
      height={300}
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>
  </div>
  
  <!-- Content -->
  <div class="p-3 md:p-4 flex flex-col gap-1.5 border-t border-white/10">
    <span class="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/80">
      {product.category}
    </span>
    
    <h3 class="text-xs md:text-sm font-serif text-white group-hover:text-primary transition-lux leading-snug truncate">
      {product.name}
    </h3>

    {#if displayVariant?.texture}
      <span class="text-[9px] md:text-[10px] text-zinc-500 truncate">{displayVariant.texture}</span>
    {/if}
    
    <div class="pt-1 flex items-center justify-between">
      <div class="flex items-baseline gap-1.5">
        <span class="text-sm md:text-base font-serif text-white">
          ${$isWholesale ? (price * (1 - WHOLESALE_DISCOUNT)).toFixed(2) : price.toFixed(2)}
        </span>
        {#if $isWholesale}
          <span class="text-[9px] text-zinc-600 line-through">${price.toFixed(2)}</span>
        {/if}
      </div>
      <div class="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary transition-lux group-hover:border-primary">
        <span class="text-primary group-hover:text-black text-[10px] md:text-xs">→</span>
      </div>
    </div>
  </div>
</a>
