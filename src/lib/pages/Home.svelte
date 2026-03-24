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
  <!-- Hero -->
  <section class="relative h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img src="{base}/images/hero-bg.jpg" alt="Protection Valley" class="w-full h-full object-cover opacity-60 grayscale-[10%]" />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60"></div>
    </div>
    
    <div class="relative z-10 max-w-5xl mx-auto px-4 text-center">
      <span class="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-8 block animate-fade-in">HANDCRAFTED IN USA</span>
      <h1 class="text-6xl md:text-8xl font-serif text-white mb-10 animate-fade-in leading-[0.9] tracking-tighter" style="animation-delay: 0.2s">
        Built for the<br/><span class="italic text-primary">Generation.</span>
      </h1>
      <p class="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 animate-fade-in font-serif italic leading-relaxed" style="animation-delay: 0.4s">
        Premium leather and canvas workgear engineered to outlast the most demanding environments.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.6s">
        <button 
          onclick={goToCatalog} 
          class="btn-primary text-sm tracking-[0.2em]"
        >
          VIEW CATALOG
        </button>
        <button 
          onclick={() => showPage('about')} 
          class="btn-secondary text-sm tracking-[0.2em]"
        >
          OUR HERITAGE
        </button>
      </div>
    </div>

    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
      <div class="w-[1px] h-24 bg-gradient-to-b from-primary to-transparent"></div>
    </div>
  </section>

  <!-- Best Sellers -->
  <section class="py-24 bg-[#0A0A0A] border-y border-white/5">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div class="space-y-3">
          <span class="text-primary text-xs font-semibold uppercase tracking-[0.2em]">ESTABLISHED QUALITY</span>
          <h2 class="text-5xl font-serif tracking-tight">Best Sellers</h2>
        </div>
        <button 
          onclick={goToCatalog}
          class="text-sm font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-2"
        >
          Explore All →
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each featured as product (product.model_number || product.name)}
          <ProductCard {product} />
        {/each}
      </div>
    </div>
  </section>
</div>
