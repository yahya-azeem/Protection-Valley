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

  // Duplicate for seamless looping: [Original, Original, Original]
  // We use 3x to ensure there's always content to the left/right during jumps
  let featured = $derived([...$products.slice(0, 8), ...$products.slice(0, 8), ...$products.slice(0, 8)]);
  let scrollContainer = $state<HTMLDivElement | null>(null);
  let isPaused = $state(false);

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

  // Handle seamless teleportation
  function handleScroll() {
    if (!scrollContainer) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const singleSetWidth = (scrollWidth / 3);

    // If we've scrolled past the first two sets, jump back to the middle set
    if (scrollLeft >= singleSetWidth * 2) {
      scrollContainer.scrollLeft = scrollLeft - singleSetWidth;
    } 
    // If we've scrolled before the second set, jump forward to the middle set
    else if (scrollLeft <= singleSetWidth - clientWidth) {
      scrollContainer.scrollLeft = scrollLeft + singleSetWidth;
    }
  }

  // Auto-slide logic
  $effect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollContainer) {
        scroll('right');
      }
    }, 5000);

    // Initial positioning to the middle set
    if (scrollContainer && scrollContainer.scrollLeft === 0) {
      const singleSetWidth = scrollContainer.scrollWidth / 3;
      scrollContainer.scrollLeft = singleSetWidth;
    }

    return () => clearInterval(interval);
  });
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
        <a href="/about" class="btn-secondary text-sm tracking-[0.2em]">
          OUR HERITAGE
        </a>
      </div>
    </div>

  </section>

  <!-- Signature Products Carousel -->
  <section class="py-24 bg-[#0A0A0A] border-y border-white/5 relative">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div class="space-y-3">
          <span class="text-primary text-xs font-semibold uppercase tracking-[0.2em]">ESTABLISHED QUALITY</span>
          <h2 class="text-5xl font-serif tracking-tight">Signature Products</h2>
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
        onmouseenter={() => isPaused = true}
        onmouseleave={() => isPaused = false}
        onscroll={handleScroll}
        role="region"
        aria-label="Signature Products Carousel"
        class="flex gap-4 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
      >
        {#each featured as product, i}
          <div class="flex-none w-[70vw] md:w-[calc(33.333%-12px)] lg:w-[calc(16.666%-14px)] snap-start animate-fade-in opacity-0" style="animation-delay: {0.05 * (i % 8)}s; animation-fill-mode: forwards;">
            <ProductCard {product} />
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Shop by Brand Section -->
  <section class="py-24 bg-black border-t border-white/5 relative">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16 space-y-3">
        <span class="text-primary text-xs font-semibold uppercase tracking-[0.2em]">CRAFTED LEGACY</span>
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
              class="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-70 transition-all duration-700" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          
          <div class="absolute inset-0 z-10 p-8 flex flex-col justify-end">
            <span class="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">PREMIUM QUALITY</span>
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
              class="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-70 transition-all duration-700" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          
          <div class="absolute inset-0 z-10 p-8 flex flex-col justify-end">
            <span class="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">TRADITIONAL CRAFT</span>
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
