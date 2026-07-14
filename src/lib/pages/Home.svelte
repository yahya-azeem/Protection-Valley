<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { products, brandFilter } from '$lib/stores';
  import { goto } from '$app/navigation';

  function selectBrand(brand: string) {
    brandFilter.set(brand);
    goto('/catalog');
  }

  let featured = $derived($products.slice(0, 8));
  let scrollContainer = $state<HTMLDivElement | null>(null);

  function startShopping() {
    goto('/catalog');
  }

  function scroll(direction: 'left' | 'right') {
    if (!scrollContainer) return;
    const scrollAmount = scrollContainer.clientWidth * 0.8;
    scrollContainer.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
</script>

<div class="bg-black min-h-screen text-white antialiased overflow-x-hidden">
  <!-- Hero -->
  <section class="relative h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img 
        src="{base}/images/products/112195634614.jpg" 
        alt="Protection Valley" 
        class="w-full h-full object-cover opacity-60 grayscale-[10%] scale-110 animate-fade-in" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
    </div>
    
    <div class="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 md:pt-0">
      <h1 class="text-4xl md:text-8xl font-serif text-white mb-6 md:mb-10 animate-slide-up opacity-0 leading-[1.1] md:leading-[0.9] tracking-tighter" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
        Built for the<br/><span class="italic text-primary">Professionals.</span>
      </h1>

      <p class="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-8 md:mb-12 animate-slide-up opacity-0 font-sans leading-relaxed tracking-tight" style="animation-delay: 0.4s; animation-fill-mode: forwards;">
        Premium leather and canvas workgear engineered to outlast the most demanding environments.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0" style="animation-delay: 0.6s; animation-fill-mode: forwards;">
        <button 
          onclick={startShopping} 
          class="btn-primary text-sm tracking-[0.2em]"
        >
          VIEW CATALOG
        </button>
      </div>
    </div>
  </section>

  <!-- Signature Products Carousel -->
  <section class="py-24 bg-[#0A0A0A] border-y border-white/5 relative">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div class="space-y-2">
          <h2 class="text-5xl font-serif tracking-tight">Signature Products</h2>
          <p class="text-zinc-500 text-sm">Professional-grade workgear engineered for durability.</p>
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Carousel Navigation -->
          <div class="hidden md:flex items-center gap-3">
            <button 
              onclick={() => scroll('left')}
              class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-lux"
              aria-label="Previous"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>
            <button 
              onclick={() => scroll('right')}
              class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-lux"
              aria-label="Next"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>

          <a 
            href="/catalog"
            class="text-sm font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-2"
          >
            Explore All →
          </a>
        </div>
      </div>

      <!-- Carousel Container -->
      <div 
        bind:this={scrollContainer}
        role="region"
        aria-label="Signature Products Carousel"
        tabindex="0"
        class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50 focus-visible:outline-offset-4 rounded-sm"
      >
        {#each featured as product, i}
          <div class="flex-none w-[75vw] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start animate-fade-in opacity-0" style="animation-delay: {0.05 * i}s; animation-fill-mode: forwards;">
            <ProductCard {product} />
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Shop by Brand Section -->
  <section class="py-24 bg-black border-t border-white/5 relative">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16 space-y-2">
        <h2 class="text-5xl font-serif tracking-tight">Shop by Brand</h2>
        <p class="text-zinc-500 max-w-md mx-auto text-sm">Explore our curated collections from trusted industry names.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Leather Gold -->
        <button 
          onclick={() => selectBrand('Leather Gold')}
          class="relative h-[350px] w-full group overflow-hidden rounded border border-white/10 text-left cursor-pointer transition-all duration-500 hover:border-primary/50"
        >
          <div class="absolute inset-0 z-0">
            <img 
              src="{base}/images/products/PV_1000.webp" 
              alt="Leather Gold Collection" 
              class="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-lux" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          
          <div class="absolute inset-0 z-10 p-8 flex flex-col justify-end">
            <h3 class="text-3xl font-serif text-white mb-2 group-hover:text-primary transition-colors">Leather Gold</h3>
            <p class="text-zinc-400 text-sm max-w-sm mb-6">Heavy duty tools pouches, chaps, and rugged leather gear built to withstand the elements.</p>
            <span class="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-white">
              EXPLORE COLLECTION <ArrowRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
        </button>

        <!-- Western Heritage -->
        <button 
          onclick={() => selectBrand('Western Heritage')}
          class="relative h-[350px] w-full group overflow-hidden rounded border border-white/10 text-left cursor-pointer transition-all duration-500 hover:border-primary/50"
        >
          <div class="absolute inset-0 z-0">
            <img 
              src="{base}/images/products/s-l1600-582.jpg" 
              alt="Western Heritage Collection" 
              class="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-lux" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          
          <div class="absolute inset-0 z-10 p-8 flex flex-col justify-end">
            <h3 class="text-3xl font-serif text-white mb-2 group-hover:text-primary transition-colors">Western Heritage</h3>
            <p class="text-zinc-400 text-sm max-w-sm mb-6">Handcrafted, classic style carpenter bags, belts, and accessories built for trade professionals.</p>
            <span class="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-white">
              EXPLORE COLLECTION <ArrowRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
        </button>
      </div>
    </div>
  </section>
</div>

<style>
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
