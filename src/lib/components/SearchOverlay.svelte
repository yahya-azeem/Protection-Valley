<script lang="ts">
  import { Search, X, SearchX, ArrowRight } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import {
    searchOpen,
    products,
    selectedProduct,
    selectedVariant,
    selectedSize,
    selectedColor,
    selectedTexture
  } from '$lib/stores';
  import type { Product } from '$lib/types';
  import OptimizedImage from '$lib/components/OptimizedImage.svelte';

  let query = $state('');
  let results = $derived.by(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return $products.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.model_number.toLowerCase().includes(term)
    );
  });

  function close() {
    searchOpen.set(false);
    query = '';
  }

  function selectResult(product: Product) {
    selectedProduct.set(product);
    const variant = product.variants?.[0];
    if (variant) {
      selectedVariant.set(variant);
      selectedSize.set(variant.size || '');
      selectedColor.set(variant.color || '');
      selectedTexture.set(variant.texture || '');
    }
    close();
    goto(`/product/${product.id}`);
  }

  function highlight(text: string): string {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<span class="text-primary">$1</span>');
  }
</script>

{#if $searchOpen}
  <div class="fixed inset-0 z-[110] flex flex-col items-center">
    <div
      class="absolute inset-0 bg-black/90 backdrop-blur-sm"
      onclick={close}
      onkeydown={(e) => e.key === 'Escape' && close()}
      role="button"
      tabindex="0"
      aria-label="Close search"
    ></div>

    <div class="relative w-full max-w-5xl px-4 pt-24 z-10">
      <div class="bg-[#0A0A0A] border border-white/10 rounded shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">Search Catalog</h2>
          <button onclick={close} class="text-zinc-400 hover:text-white transition-lux" aria-label="Close search">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 border-b border-white/10">
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              bind:value={query}
              placeholder="Search by model number, product name, or category"
              class="w-full pl-12 pr-4 py-3 bg-black border border-white/15 rounded text-base text-white outline-none focus:border-primary placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto p-6">
          {#if query.trim()}
            {#if results.length === 0}
              <div class="py-20 text-center flex flex-col items-center">
                <SearchX class="w-12 h-12 text-zinc-700 mb-4" />
                <p class="text-sm text-zinc-500">No products match your search.</p>
              </div>
            {:else}
              <div class="grid grid-cols-1 gap-3">
                {#each results as product}
                  <button
                    onclick={() => selectResult(product)}
                    class="flex items-center gap-4 p-4 bg-black border border-white/10 rounded hover:border-primary/50 transition-lux text-left group"
                  >
                    <div class="w-16 h-16 bg-[#111] border border-white/10 rounded overflow-hidden">
                      <OptimizedImage 
                        src={product.variants?.[0]?.image_url || product.image_url || ''} 
                        alt={product.name} 
                        class="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[11px] uppercase tracking-[0.12em] text-zinc-500">{product.model_number}</p>
                      <h3 class="text-sm text-white group-hover:text-primary transition-lux truncate">{@html highlight(product.name)}</h3>
                      <p class="text-xs text-zinc-500">{product.category}</p>
                    </div>
                    <div class="flex items-center gap-2 text-primary">
                      <span class="text-sm font-serif">${(product.variants?.[0]?.price || 0).toFixed(2)}</span>
                      <ArrowRight class="w-4 h-4" />
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
          {:else}
            <p class="text-sm text-zinc-500">Start typing to search products.</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
