<script lang="ts">
  import { Search, X, SearchX, Shield, ArrowRight } from 'lucide-svelte';
  import { searchOpen, products, selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture } from '$lib/stores';
  import { showPage } from '$lib/stores';
  import type { GroupedProduct } from '$lib/types';
  import { DESIGN_TOKENS } from '$lib/config';

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
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<span class="text-(--color-primary)">$1</span>');
  }
</script>

{#if $searchOpen}
  <div class="fixed inset-0 z-[110] flex flex-col items-center">
    <div 
      class="absolute inset-0 bg-black/95 backdrop-blur-md" 
      onclick={close} 
      onkeydown={(e) => e.key === 'Escape' && close()} 
      role="button" 
      tabindex="0" 
      aria-label="Close search"
    ></div>
    
    <div class="relative w-full max-w-4xl px-4 pt-24 z-10">
      <div class="bg-(--color-dark-bg) border-8 border-(--color-primary) p-8 shadow-[0_0_100px_rgba(255,102,0,0.2)]">
        <div class="flex flex-col space-y-8">
          <div class="flex items-center justify-between border-b-2 border-(--color-dark-border) pb-4">
            <div class="flex items-center space-x-3">
              <Shield class="w-6 h-6 text-(--color-primary)" />
              <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white">Inventory Intelligence</h2>
            </div>
            <button onclick={close} class="text-(--color-dark-muted) hover:text-white transition-colors">
              <X class="w-8 h-8" />
            </button>
          </div>

          <div class="relative">
            <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-(--color-primary)" />
            <input 
              type="text" 
              bind:value={query} 
              placeholder="SEARCH BY MODEL, SKU, OR NOMENCLATURE..." 
              class="w-full pl-20 pr-8 py-6 bg-black border border-(--color-dark-border) focus:border-(--color-primary) text-3xl font-black uppercase tracking-tighter text-white outline-none placeholder:text-(--color-dark-muted)" 
              autofocus
            />
          </div>

          {#if query.trim()}
            <div class="max-h-[60vh] overflow-y-auto scrollbar-hide space-y-4">
              {#if results.length === 0}
                <div class="py-20 text-center flex flex-col items-center">
                  <SearchX class="w-16 h-16 text-(--color-dark-border) mb-6" />
                  <p class="text-sm font-black uppercase tracking-widest text-(--color-dark-muted)">Negative Identification for Search Parameters</p>
                </div>
              {:else}
                <div class="grid grid-cols-1 gap-4">
                  {#each results as product}
                    <button 
                      onclick={() => selectResult(product)} 
                      class="flex items-center gap-6 p-6 bg-black border border-(--color-dark-border) hover:border-(--color-primary) transition-all text-left group"
                    >
                      <div class="w-24 h-24 bg-white p-2 flex-shrink-0">
                        <img src={product.variants[0]?.image_url || '/images/placeholder.png'} alt={product.name} class="w-full h-full object-contain" />
                      </div>
                      <div class="flex-1">
                        <span class="text-[0.65rem] font-black uppercase tracking-widest text-(--color-secondary)">Cat. No. {product.model_number}</span>
                        <h4 class="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-(--color-primary) transition-colors">
                          {@html highlight(product.name)}
                        </h4>
                        <p class="text-[0.6rem] font-bold uppercase tracking-widest text-(--color-dark-muted) mt-1">{product.category}</p>
                      </div>
                      <div class="text-right">
                        <div class="text-xl font-black text-(--color-primary)">${(product.variants[0]?.price || 0).toFixed(2)}</div>
                        <span class="text-[0.5rem] font-black uppercase tracking-widest text-(--color-dark-muted)">MSRP</span>
                      </div>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
