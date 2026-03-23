<script lang="ts">
  import { PackageX, SlidersHorizontal, ChevronRight, User } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { filteredProducts, currentCategory, isWholesale, showPage } from '$lib/stores';
  import type { SortOption } from '$lib/types';

  let sortBy = $state<SortOption>('featured');
  const categories = ['All', 'Tool Belts', 'Pouches', 'Aprons', 'Rigs'];

  function setCategory(cat: string) {
    currentCategory.set(cat);
  }
</script>

<div class="bg-black min-h-screen">
  <!-- Secondary Black Category Bar -->
  <div class="bg-dark-surface border-b border-white/5 sticky top-20 z-40 overflow-x-auto scrollbar-hide py-6">
    <div class="max-w-7xl mx-auto px-4 flex items-center space-x-12">
      {#each categories as cat}
        <button 
          onclick={() => setCategory(cat)}
          class="text-[0.6rem] font-bold uppercase tracking-[0.5em] transition-lux whitespace-nowrap
            {$currentCategory === cat ? 'text-primary' : 'text-zinc-500 hover:text-white'}"
        >
          {cat}
        </button>
      {/each}
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 section-padding">
    <!-- Clean Header (No "Arsenal") -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
      <div class="max-w-xl">
        <h1 class="text-7xl font-serif text-white mb-8 tracking-tight">Collection</h1>
        <p class="text-zinc-500 text-lg font-light leading-relaxed font-serif italic pb-2 border-b border-white/5">
          { $isWholesale ? 'Wholesale Account Active // All unit rates adjusted for bulk procurement.' : 'Handcrafted workgear for the modern professional.' }
        </p>
      </div>

      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-4 text-[0.6rem] font-bold uppercase tracking-[0.4em] text-zinc-600">
          <SlidersHorizontal class="w-4 h-4" />
          <span>Sort By</span>
        </div>
        <select 
          bind:value={sortBy}
          class="bg-transparent border-b border-white/10 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white py-2 focus:border-primary outline-none cursor-pointer transition-lux"
        >
          <option value="featured">Featured First</option>
          <option value="price-low">Price Low</option>
          <option value="price-high">Price High</option>
        </select>
      </div>
    </div>

    <!-- Wholesale Identity Banner (Elevated Shade) -->
    {#if $isWholesale}
      <div class="mb-24 bg-dark-elevated border border-white/5 p-12 flex flex-col md:flex-row items-center justify-between gap-12 rounded-sm shadow-xl">
        <div class="flex items-center gap-10">
          <div class="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-sm">
            <User class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 class="text-3xl font-serif text-primary italic mb-2">Wholesale Enabled</h3>
            <p class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Tier-1 bulk discount applied across entire catalog</p>
          </div>
        </div>
        <button 
          onclick={() => showPage('contact')}
          class="text-[0.65rem] font-bold uppercase tracking-[0.6em] text-white border border-white/20 px-12 py-5 hover:bg-white hover:text-black transition-lux"
        >
          INQUIRY
        </button>
      </div>
    {/if}

    <!-- Product Grid -->
    {#if $filteredProducts.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
        {#each $filteredProducts as product (product.model_number || product.name)}
          <ProductCard {product} />
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-48 bg-dark-surface border border-white/5 rounded-sm">
        <PackageX class="w-16 h-16 text-zinc-800 mb-8" />
        <h3 class="text-2xl font-serif italic text-zinc-600">No matches found</h3>
        <button 
          onclick={() => setCategory('All')} 
          class="mt-10 text-[0.6rem] font-bold uppercase tracking-[0.5em] text-primary hover:text-white transition-lux"
        >
          RESET
        </button>
      </div>
    {/if}
  </div>
</div>
