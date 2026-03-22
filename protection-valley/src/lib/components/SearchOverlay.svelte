<script lang="ts">
  import { Search, X, SearchX } from 'lucide-svelte';
  import { searchOpen, isWholesale, products, selectedProduct, selectedSize, selectedColor, selectedImageIndex } from '$lib/stores';
  import { showPage } from '$lib/stores';
  import type { Product } from '$lib/types';

  let query = $state('');
  let results = $derived.by(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return $products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.type.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  function close() { searchOpen.set(false); query = ''; }

  function selectResult(product: Product) {
    selectedProduct.set(product);
    selectedSize.set(product.sizes[0]);
    selectedColor.set(product.colors[0]);
    selectedImageIndex.set(0);
    close();
    showPage('product-detail');
  }

  function highlight(text: string): string {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<span class="text-primary">$1</span>');
  }
</script>

{#if $searchOpen}
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/80" onclick={close}></div>
    <div class="absolute top-0 left-0 right-0 bg-dark-card border-b border-dark-border p-6">
      <div class="max-w-3xl mx-auto">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
          <input type="text" bind:value={query} placeholder="Search products..." class="w-full pl-12 pr-4 py-4 bg-dark-card border border-dark-border rounded-lg text-lg text-dark-text focus:border-primary focus:outline-none" />
          <button onclick={close} class="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text">
            <X class="w-5 h-5" />
          </button>
        </div>
        {#if query.trim()}
          <div class="mt-4 max-h-96 overflow-y-auto scrollbar-hide">
            {#if results.length === 0}
              <div class="text-center py-8 text-dark-muted">
                <SearchX class="w-12 h-12 mx-auto mb-2" />
                <p>No products found</p>
              </div>
            {:else}
              {#each results as product}
                <button onclick={() => selectResult(product)} class="flex items-center gap-4 p-3 hover:bg-dark-bg rounded-lg cursor-pointer transition-colors w-full text-left">
                  <img src={product.image} alt={product.name} class="w-16 h-16 object-cover rounded-lg" />
                  <div class="flex-1">
                    <h4 class="font-medium">{@html highlight(product.name)}</h4>
                    <p class="text-sm text-dark-muted">{product.category} • {product.type}</p>
                  </div>
                  <span class="text-primary font-medium">${($isWholesale ? product.wholesalePrice : product.price).toFixed(2)}</span>
                </button>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
