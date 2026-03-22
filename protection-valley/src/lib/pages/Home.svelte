<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowRight } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { products, showPage } from '$lib/stores';

  let featured = $derived($products.slice(0, 4));

  function goToCatalog() {
    showPage('catalog');
  }
</script>

<div class="bg-black min-h-screen text-white antialiased">
  <!-- Heritage Hero -->
  <section class="relative h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img src="{base}/images/hero-bg.jpg" alt="Protection Valley" class="w-full h-full object-cover opacity-60 grayscale-[10%]" />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60"></div>
    </div>
    
    <div class="relative z-10 max-w-6xl mx-auto px-4 text-center">
      <span class="text-primary text-[0.65rem] font-bold uppercase tracking-[1em] mb-12 block animate-fade-in">HANDCRAFTED IN USA</span>
      <h1 class="text-7xl md:text-9xl font-serif text-white mb-16 animate-fade-in leading-[0.9] tracking-tighter" style="animation-delay: 0.2s">
        Built for the<br/><span class="italic text-primary">Generation.</span>
      </h1>
      <p class="text-2xl md:text-3xl text-zinc-400 max-w-4xl mx-auto mb-20 animate-fade-in font-serif italic leading-relaxed" style="animation-delay: 0.4s">
        "Premium leather and canvas workgear engineered to outlast the most demanding environments."
      </p>
      
      <div class="flex flex-col sm:flex-row gap-8 justify-center animate-fade-in" style="animation-delay: 0.6s">
        <button 
          onclick={goToCatalog} 
          class="btn-primary text-[0.6rem] tracking-[0.8em]"
        >
          VIEW COLLECTION
        </button>
        <button 
          onclick={() => showPage('about')} 
          class="btn-secondary text-[0.6rem] tracking-[0.8em]"
        >
          HERITAGE
        </button>
      </div>
    </div>

    <!-- Heritage Detail -->
    <div class="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-20">
      <div class="w-[1px] h-32 bg-gradient-to-b from-primary to-transparent"></div>
    </div>
  </section>

  <!-- Best Sellers (Secondary Surface) -->
  <section class="py-48 bg-dark-surface border-y border-white/5">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
        <div class="space-y-6">
          <span class="text-primary text-[0.65rem] font-bold uppercase tracking-[0.6em]">ESTABLISHED QUALITY</span>
          <h2 class="text-7xl font-serif tracking-tight">Best Sellers</h2>
        </div>
        <button 
          onclick={goToCatalog}
          class="text-[0.6rem] font-bold uppercase tracking-[0.8em] text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-4"
        >
          EXPLORE ALL
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {#each featured as product (product.model_number || product.name)}
          <ProductCard {product} />
        {/each}
      </div>
    </div>
  </section>

  <!-- Section Removed as per User Request: Quality Assurance / Values -->
</div>
