<script lang="ts">
  import { PackageX, Filter, X } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import {
    filteredProducts,
    currentCategory,
    isWholesale,
    priceRange,
    sizeFilter,
    colorFilter,
    textureFilter,
    genericProductFilter,
    products
  } from '$lib/stores';
  import { CATEGORIES, PRICE_RANGES, SIZES } from '$lib/constants';
  import type { SortOption } from '$lib/types';

  let sortBy = $state<SortOption>('featured');
  let showMobileFilters = $state(false);

  const genericProducts = $derived(
    Array.from(new Set($products.map((p) => p.name))).sort((a, b) => a.localeCompare(b))
  );
  const colors = $derived(
    Array.from(new Set($products.flatMap((p) => p.variants?.map((v) => v.color).filter(Boolean) || []))) as string[]
  );
  const textures = $derived(
    Array.from(new Set($products.flatMap((p) => p.variants?.map((v) => v.texture).filter(Boolean) || []))) as string[]
  );

  function setCategory(cat: string) {
    currentCategory.set(cat);
  }

  function setPriceRange(min: number, max: number) {
    priceRange.update((current) => {
      if (current.min === min && current.max === max) return { min: 0, max: Infinity };
      return { min, max };
    });
  }

  function toggleSize(size: string) {
    sizeFilter.update((current) => (current === size ? '' : size));
  }

  function toggleColor(color: string) {
    colorFilter.update((current) => (current === color ? '' : color));
  }

  function toggleTexture(texture: string) {
    textureFilter.update((current) => (current === texture ? '' : texture));
  }

  function toggleGeneric(productName: string) {
    genericProductFilter.update((current) => (current === productName ? '' : productName));
  }

  function resetFilters() {
    setCategory('All');
    priceRange.set({ min: 0, max: Infinity });
    sizeFilter.set('');
    colorFilter.set('');
    textureFilter.set('');
    genericProductFilter.set('');
  }

  let sortedProducts = $derived.by(() => {
    const list = [...$filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => {
          const aPrice = Math.min(...(a.variants?.map((v) => v.price) || [0]));
          const bPrice = Math.min(...(b.variants?.map((v) => v.price) || [0]));
          return aPrice - bPrice;
        });
      case 'price-high':
        return list.sort((a, b) => {
          const aPrice = Math.min(...(a.variants?.map((v) => v.price) || [0]));
          const bPrice = Math.min(...(b.variants?.map((v) => v.price) || [0]));
          return bPrice - aPrice;
        });
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  });
</script>

<div class="bg-black min-h-screen">
  <div class="lg:hidden sticky top-16 z-30 bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between">
    <span class="text-sm font-semibold text-white">{sortedProducts.length} Products</span>
    <button onclick={() => (showMobileFilters = !showMobileFilters)} class="flex items-center gap-2 text-sm font-semibold text-primary">
      <Filter class="w-4 h-4" /> Filters
    </button>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-4 lg:py-12">
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <aside class="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-28 self-start">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Category</h3>
          <div class="space-y-1">
            {#each CATEGORIES as cat}
              <button
                onclick={() => setCategory(cat)}
                class="block w-full text-left px-3 py-2 rounded text-sm transition-lux
                  {$currentCategory === cat
                    ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'}"
              >
                {cat}
              </button>
            {/each}
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Generic Product</h3>
          <div class="space-y-1 max-h-48 overflow-y-auto pr-1">
            {#each genericProducts as productName}
              <button
                onclick={() => toggleGeneric(productName)}
                class="block w-full text-left px-3 py-2 rounded text-sm transition-lux
                  {$genericProductFilter === productName
                    ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'}"
              >
                {productName}
              </button>
            {/each}
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Price Range</h3>
          <div class="space-y-1">
            {#each PRICE_RANGES as range}
              <button
                onclick={() => setPriceRange(range.min, range.max)}
                class="block w-full text-left px-3 py-2 rounded text-sm transition-lux
                  {$priceRange.min === range.min && $priceRange.max === range.max
                    ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'}"
              >
                {range.label}
              </button>
            {/each}
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Size</h3>
          <div class="flex flex-wrap gap-2">
            {#each SIZES as size}
              <button
                onclick={() => toggleSize(size)}
                class="px-3 py-1.5 text-xs font-semibold rounded border transition-lux
                  {$sizeFilter === size
                    ? 'bg-primary text-black border-primary'
                    : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}"
              >
                {size}
              </button>
            {/each}
          </div>
        </div>

        {#if colors.length > 0}
          <div>
            <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Color</h3>
            <div class="flex flex-wrap gap-2">
              {#each colors as color}
                <button
                  onclick={() => toggleColor(color)}
                  class="px-3 py-1.5 text-xs font-semibold rounded border transition-lux
                    {$colorFilter === color
                      ? 'bg-primary text-black border-primary'
                      : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}"
                >
                  {color}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if textures.length > 0}
          <div>
            <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Texture</h3>
            <div class="flex flex-wrap gap-2">
              {#each textures as texture}
                <button
                  onclick={() => toggleTexture(texture)}
                  class="px-3 py-1.5 text-xs font-semibold rounded border transition-lux
                    {$textureFilter === texture
                      ? 'bg-primary text-black border-primary'
                      : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}"
                >
                  {texture}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </aside>

      {#if showMobileFilters}
        <div class="lg:hidden fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm" role="dialog">
          <div class="absolute right-0 top-0 h-full w-80 max-w-full bg-[#0A0A0A] border-l border-white/10 p-6 space-y-8 overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-white">Filters</h2>
              <button onclick={() => (showMobileFilters = false)} class="text-zinc-400 hover:text-white"><X class="w-6 h-6" /></button>
            </div>

            <div>
              <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">Category</h3>
              <div class="space-y-1">
                {#each CATEGORIES as cat}
                  <button
                    onclick={() => {
                      setCategory(cat);
                      showMobileFilters = false;
                    }}
                    class="block w-full text-left px-3 py-2 rounded text-sm transition-lux
                      {$currentCategory === cat ? 'bg-primary/10 text-primary font-semibold' : 'text-zinc-400'}"
                  >
                    {cat}
                  </button>
                {/each}
              </div>
            </div>

            <div>
              <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">Price</h3>
              <div class="space-y-1">
                {#each PRICE_RANGES as range}
                  <button
                    onclick={() => setPriceRange(range.min, range.max)}
                    class="block w-full text-left px-3 py-2 rounded text-sm transition-lux
                      {$priceRange.min === range.min && $priceRange.max === range.max ? 'bg-primary/10 text-primary font-semibold' : 'text-zinc-400'}"
                  >
                    {range.label}
                  </button>
                {/each}
              </div>
            </div>

            <div>
              <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">Size</h3>
              <div class="flex flex-wrap gap-2">
                {#each SIZES as size}
                  <button
                    onclick={() => toggleSize(size)}
                    class="px-3 py-1.5 text-xs font-semibold rounded border transition-lux
                      {$sizeFilter === size ? 'bg-primary text-black border-primary' : 'border-white/10 text-zinc-400'}"
                  >
                    {size}
                  </button>
                {/each}
              </div>
            </div>

            {#if colors.length > 0}
              <div>
                <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">Color</h3>
                <div class="flex flex-wrap gap-2">
                  {#each colors as color}
                    <button
                      onclick={() => toggleColor(color)}
                      class="px-3 py-1.5 text-xs font-semibold rounded border transition-lux
                        {$colorFilter === color ? 'bg-primary text-black border-primary' : 'border-white/10 text-zinc-400'}"
                    >
                      {color}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}

            {#if textures.length > 0}
              <div>
                <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-3">Texture</h3>
                <div class="flex flex-wrap gap-2">
                  {#each textures as texture}
                    <button
                      onclick={() => toggleTexture(texture)}
                      class="px-3 py-1.5 text-xs font-semibold rounded border transition-lux
                        {$textureFilter === texture ? 'bg-primary text-black border-primary' : 'border-white/10 text-zinc-400'}"
                    >
                      {texture}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <div class="flex-1 min-w-0">
        <div class="hidden lg:flex items-center justify-between mb-8">
          <p class="text-sm text-zinc-500">{sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}</p>
          <select
            bind:value={sortBy}
            class="bg-transparent border border-white/10 text-sm text-white py-2 px-4 rounded focus:border-primary outline-none cursor-pointer transition-lux"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {#if sortedProducts.length > 0}
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2">
            {#each sortedProducts as product (product.model_number || product.name)}
              <ProductCard {product} />
            {/each}
          </div>
        {:else}
          <div class="flex flex-col items-center justify-center py-32 bg-[#0A0A0A] border border-white/10 rounded">
            <PackageX class="w-12 h-12 text-zinc-700 mb-6" />
            <h3 class="text-lg font-serif text-zinc-500">No products match your filters</h3>
            <button
              onclick={resetFilters}
              class="mt-6 text-sm font-semibold text-primary hover:text-white transition-lux"
            >
              Reset All Filters
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
