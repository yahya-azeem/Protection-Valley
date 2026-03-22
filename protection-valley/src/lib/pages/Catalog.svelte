<script lang="ts">
  import { PackageX } from 'lucide-svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { filteredProducts, currentType, currentCategory, isWholesale } from '$lib/stores';
  import type { SortOption } from '$lib/types';

  let sortBy = $state<SortOption>('featured');

  const types = ['All', 'Leather', 'Canvas', 'Nylon'];
  const categories = ['All', 'Tool Belts', 'Pouches', 'Aprons', 'Accessories'];

  let sorted = $derived.by(() => {
    let items = [...$filteredProducts];
    if (sortBy === 'price-low') items.sort((a, b) => ($isWholesale ? a.wholesalePrice : a.price) - ($isWholesale ? b.wholesalePrice : b.price));
    else if (sortBy === 'price-high') items.sort((a, b) => ($isWholesale ? b.wholesalePrice : b.price) - ($isWholesale ? a.wholesalePrice : a.price));
    else if (sortBy === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  });

  function clearFilters() { currentType.set('All'); currentCategory.set('All'); }
</script>

<div class="bg-[#0a0a0a] min-h-screen">
  <div class="bg-dark-card border-b border-dark-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-serif mb-2">Full Catalog</h1>
          <p class="text-dark-muted">Browse our complete collection of premium workgear</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-dark-muted">
          <span>{sorted.length}</span> products
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Filters -->
    <div class="bg-dark-card rounded-lg p-6 mb-8 border border-dark-border">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-3 text-dark-muted">Material Type</label>
          <div class="flex flex-wrap gap-2">
            {#each types as type}
              <button
                onclick={() => currentType.set(type)}
                class="px-4 py-2 rounded-full text-sm font-medium transition-colors {$currentType === type ? 'bg-primary text-[#0a0a0a]' : 'bg-[#0a0a0a] border border-dark-border text-dark-text hover:border-primary'}"
              >{type}</button>
            {/each}
          </div>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-3 text-dark-muted">Category</label>
          <div class="flex flex-wrap gap-2">
            {#each categories as cat}
              <button
                onclick={() => currentCategory.set(cat)}
                class="px-4 py-2 rounded-full text-sm font-medium transition-colors {$currentCategory === cat ? 'bg-primary text-[#0a0a0a]' : 'bg-[#0a0a0a] border border-dark-border text-dark-text hover:border-primary'}"
              >{cat}</button>
            {/each}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-3 text-dark-muted">Sort By</label>
          <select bind:value={sortBy} class="px-4 py-2 bg-[#0a0a0a] border border-dark-border rounded-lg text-dark-text focus:border-primary focus:outline-none">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>
    </div>

    {#if $currentType !== 'All' || $currentCategory !== 'All'}
      <div class="flex flex-wrap gap-2 mb-6">
        <span class="text-sm text-dark-muted">Active filters:</span>
        <button onclick={clearFilters} class="text-sm text-primary hover:underline">Clear all</button>
      </div>
    {/if}

    {#if sorted.length === 0}
      <div class="text-center py-16">
        <PackageX class="w-16 h-16 text-dark-border mx-auto mb-4" />
        <h3 class="text-xl font-medium mb-2">No products found</h3>
        <p class="text-dark-muted mb-4">Try adjusting your filters</p>
        <button onclick={clearFilters} class="btn-primary">Clear Filters</button>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each sorted as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>
    {/if}
  </div>
</div>
