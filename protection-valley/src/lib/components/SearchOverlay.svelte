<script lang="ts">
  import { Search, X, SearchX } from 'lucide-svelte';
  import { searchOpen, products, selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture } from '$lib/stores';
  import { showPage } from '$lib/stores';
  import type { GroupedProduct } from '$lib/types';

  let query = $state('');
  let results = $derived.by(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return $products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.model_number.toLowerCase().includes(term)
    );
  });

  function close() { searchOpen.set(false); query = ''; }

  function selectResult(product: GroupedProduct) {
    selectedProduct.set(product);
    const v = product.variants[0];
    if (v) {
      selectedVariant.set(v);
      selectedSize.set(v.size || '');
      selectedColor.set(v.color || '');
      selectedTexture.set(v.texture || '');
    }
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
    <div 
      class="absolute inset-0 bg-black/80" 
      onclick={close} 
      onkeydown={(e) => e.key === 'Escape' && close()} 
      role="button" 
      tabindex="0" 
      aria-label="Close search"
    ></div>
    <div class="absolute top-0 left-0 right-0 bg-dark-card border-b border-dark-border p-6 shadow-2xl">
      <div class="max-w-3xl mx-auto">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
          <input 
            type="text" 
            bind:value={query} 
            placeholder="Search by name or model..." 
            class="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-dark-border rounded-lg text-lg text-dark-text focus:border-primary focus:outline-none" 
            autofocus
          />
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
                <button onclick={() => selectResult(product)} class="flex items-center gap-4 p-3 hover:bg-dark-bg rounded-lg cursor-pointer transition-colors w-full text-left group">
                  <div class="w-16 h-16 bg-dark-card rounded-lg overflow-hidden border border-dark-border">
                    <img src={product.variants[0]?.image_url || '/images/placeholder.jpg'} alt={product.name} class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium group-hover:text-primary">{@html highlight(product.name)}</h4>
                    <p class="text-xs text-dark-muted">{product.model_number} • {product.category}</p>
                  </div>
                  <span class="text-primary font-medium">${(product.variants[0]?.price || 0).toFixed(2)}</span>
                </button>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
