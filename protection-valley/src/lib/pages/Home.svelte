<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowRight } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { products, showPage, currentCategory } from '$lib/stores';

  const categories = [
    { name: 'Tool Belts', image: '/images/toolbelt-1.jpg' },
    { name: 'Pouches', image: '/images/pouch-1.jpg' },
    { name: 'Aprons', image: '/images/apron-1.jpg' },
    { name: 'Accessories', image: '/images/wristband-1.jpg' },
  ];

  let featured = $derived($products.slice(0, 4));

  function goToCategory(cat: string) {
    currentCategory.set(cat);
    showPage('catalog');
  }
</script>

<!-- Hero -->
<section class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{base}/images/hero-bg.jpg');"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"></div>
  <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <p class="text-primary font-medium tracking-widest uppercase mb-4 animate-fade-in">Protection Valley</p>
    <h1 class="text-5xl md:text-7xl font-serif mb-6 animate-fade-in" style="animation-delay: 0.2s">Gear That Protects<br/>Your Craft</h1>
    <p class="text-xl text-dark-muted mb-8 max-w-2xl mx-auto animate-fade-in" style="animation-delay: 0.4s">
      Premium workgear crafted for professionals who demand durability and comfort.
      Tool belts, pouches, aprons, and protective equipment.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.6s">
      <button onclick={() => showPage('catalog')} class="btn-primary text-lg">Browse Catalog</button>
      <button onclick={() => showPage('about')} class="btn-secondary text-lg">Our Story</button>
    </div>
  </div>
</section>

<!-- Categories -->
<section class="py-20 bg-[#0a0a0a]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-primary font-medium tracking-widest uppercase mb-2">Browse by Category</p>
      <h2 class="text-4xl font-serif">Find Your Gear</h2>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each categories as cat}
        <button onclick={() => goToCategory(cat.name)} class="group relative aspect-square overflow-hidden rounded-lg bg-dark-card border border-dark-border hover:border-primary transition-colors">
          <img src="{base}{cat.image}" alt={cat.name} class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0a0a0a]/80 to-transparent">
            <span class="text-lg font-medium">{cat.name}</span>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<!-- Featured -->
<section class="py-20 bg-dark-card">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-12">
      <div>
        <p class="text-primary font-medium tracking-widest uppercase mb-2">Featured</p>
        <h2 class="text-4xl font-serif">Best Sellers</h2>
      </div>
      <button onclick={() => showPage('catalog')} class="text-primary hover:text-primary-light flex items-center gap-2">
        View All <ArrowRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each featured as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  </div>
</section>
