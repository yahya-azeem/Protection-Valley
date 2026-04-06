<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { products } from '$lib/stores';
  import { goto } from '$app/navigation';

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
        src="{base}/images/hero-bg.jpg" 
        alt="Protection Valley" 
        class="w-full h-full object-cover opacity-60 grayscale-[10%] scale-110 animate-fade-in" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      <div class="absolute inset-0 bg-radial-gradient from-transparent to-black/60"></div>
    </div>
    
    <div class="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 md:pt-0">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-slide-down opacity-0" style="animation-delay: 0.1s; animation-fill-mode: forwards;">
        <Sparkles class="w-3 h-3 text-primary" />
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Est. 2024 · Premium Gear</span>
      </div>

      <h1 class="text-5xl md:text-8xl font-serif text-white mb-6 md:mb-10 animate-slide-up opacity-0 leading-[1.1] md:leading-[0.95] tracking-tighter" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
        Built for the<br/><span class="italic text-primary">Professionals.</span>
      </h1>

      <p class="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 md:mb-14 animate-slide-up opacity-0 font-sans leading-relaxed tracking-tight" style="animation-delay: 0.5s; animation-fill-mode: forwards;">
        Premium leather and canvas workgear engineered to outlast the most demanding environments on Earth.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up opacity-0" style="animation-delay: 0.7s; animation-fill-mode: forwards;">
        <button 
          onclick={startShopping} 
          class="btn-primary text-xs tracking-[0.25em] min-w-[220px]"
        >
          VIEW CATALOG
        </button>
        <a href="/about" class="btn-secondary text-xs tracking-[0.25em] min-w-[220px]">
          OUR HERITAGE
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in opacity-0" style="animation-delay: 1.2s; animation-fill-mode: forwards;">
      <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 rotate-90 mb-8">Scroll</span>
      <div class="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent"></div>
    </div>
  </section>

  <!-- Signature Collection Carousel -->
  <section class="py-32 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full"></div>

    <div class="max-w-7xl mx-auto px-4 relative">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 animate-fade-in opacity-0" style="animation-fill-mode: forwards;">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-[1px] bg-primary"></div>
            <span class="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Signature Selection</span>
          </div>
          <h2 class="text-5xl md:text-6xl font-serif tracking-tighter">The Essentials</h2>
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Carousel Navigation -->
          <div class="hidden md:flex items-center gap-3 mr-4">
            <button 
              onclick={() => scroll('left')}
              class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-lux group"
              aria-label="Previous"
            >
              <ChevronLeft class="w-5 h-5 group-active:scale-90 transition-transform" />
            </button>
            <button 
              onclick={() => scroll('right')}
              class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-lux group"
              aria-label="Next"
            >
              <ChevronRight class="w-5 h-5 group-active:scale-90 transition-transform" />
            </button>
          </div>

          <a 
            href="/catalog"
            class="group flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-lux uppercase tracking-[0.2em]"
          >
            Full Catalog 
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <!-- Carousel Container -->
      <div 
        bind:this={scrollContainer}
        class="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 cursor-grab active:cursor-grabbing"
      >
        {#each featured as product, i}
          <div class="flex-none w-[85vw] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start animate-slide-up opacity-0" style="animation-delay: {0.1 * i}s; animation-fill-mode: forwards;">
            <ProductCard {product} />
          </div>
        {/each}
      </div>

      <!-- Mobile Scroll Progress (Visual only) -->
      <div class="md:hidden mt-8 w-full h-[1px] bg-white/5 relative">
        <div class="absolute top-0 left-0 h-full bg-primary w-1/3"></div>
      </div>
    </div>
  </section>

  <!-- Luxury Quote Section -->
  <section class="py-48 bg-black">
    <div class="max-w-4xl mx-auto px-4 text-center space-y-10 animate-fade-in opacity-0" style="animation-fill-mode: forwards;">
      <div class="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles class="w-5 h-5 text-primary" />
      </div>
      <h3 class="text-3xl md:text-5xl font-serif italic text-white leading-tight">
        "True protection is found in the intersection of traditional craftsmanship and modern engineering."
      </h3>
      <div class="flex flex-col items-center">
        <span class="w-12 h-[1px] bg-primary mb-4"></span>
        <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">The Protection Valley Ethos</span>
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

  .bg-radial-gradient {
    background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
  }
</style>
