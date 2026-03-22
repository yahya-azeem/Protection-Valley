<script lang="ts">
  import { ArrowLeft, Truck, ShieldCheck, RotateCcw, Package } from 'lucide-svelte';
  import { selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture, cart, showToast, goBack } from '$lib/stores';
  import type { CartItem, Product } from '$lib/types';

  let sp = $derived($selectedProduct);
  
  // Extract unique options from variants
  let colors = $derived(Array.from(new Set(sp?.variants.map(v => v.color).filter(Boolean) as string[])));
  let sizes = $derived(Array.from(new Set(sp?.variants.map(v => v.size).filter(Boolean) as string[])));
  let textures = $derived(Array.from(new Set(sp?.variants.map(v => v.texture).filter(Boolean) as string[])));

  // Derive matching variant based on selections
  let currentVariant = $derived.by(() => {
    if (!sp) return null;
    return sp.variants.find(v => 
      (!$selectedColor || v.color === $selectedColor) &&
      (!$selectedSize || v.size === $selectedSize) &&
      (!$selectedTexture || v.texture === $selectedTexture)
    ) || sp.variants[0];
  });

  // Keep store in sync with derived variant for cart/images
  $effect(() => { if (currentVariant) selectedVariant.set(currentVariant); });

  function addToCart() {
    if (!currentVariant) return;
    const item: CartItem = {
      id: currentVariant.id,
      ebay_id: currentVariant.ebay_id,
      name: `${sp?.name} - ${currentVariant.color} / ${currentVariant.size}`,
      price: currentVariant.price,
      image: currentVariant.image_url || '/images/placeholder.jpg',
      color: currentVariant.color,
      size: currentVariant.size,
      texture: currentVariant.texture,
      quantity: 1,
    };
    cart.add(item);
    showToast('Added to cart!');
  }
</script>

{#if sp}
  <div class="bg-[#0a0a0a] min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onclick={() => goBack()} class="flex items-center text-dark-muted hover:text-primary mb-6">
        <ArrowLeft class="w-4 h-4 mr-2" /> Back
      </button>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Preview -->
        <div>
          <div class="aspect-square bg-dark-card rounded-lg overflow-hidden mb-4 border border-dark-border">
            <img src={currentVariant?.image_url || '/images/placeholder.jpg'} alt={sp.name} class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Info -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm text-primary">{sp.model_number}</span>
            <span class="text-sm text-dark-muted">•</span>
            <span class="text-sm text-dark-muted">{sp.category}</span>
          </div>
          <h1 class="text-3xl font-serif mb-4">{sp.name}</h1>
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl font-serif text-primary">${(currentVariant?.price || 0).toFixed(2)}</span>
          </div>
          
          <!-- Variant Selectors -->
          {#if colors.length > 0}
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3">Color: <span class="text-dark-muted">{$selectedColor}</span></label>
              <div class="flex flex-wrap gap-2">
                {#each colors as color}
                  <button 
                    onclick={() => selectedColor.set(color)} 
                    class="px-4 py-2 rounded border {$selectedColor === color ? 'bg-primary text-black border-primary' : 'bg-[#0a0a0a] border-dark-border text-dark-text hover:border-primary'}"
                  >{color}</button>
                {/each}
              </div>
            </div>
          {/if}

          {#if sizes.length > 0}
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3">Size: <span class="text-dark-muted">{$selectedSize}</span></label>
              <div class="flex flex-wrap gap-2">
                {#each sizes as size}
                  <button 
                    onclick={() => selectedSize.set(size)} 
                    class="px-3 py-1 rounded border {$selectedSize === size ? 'bg-primary text-black border-primary' : 'bg-[#0a0a0a] border-dark-border text-dark-text hover:border-primary'}"
                  >{size}</button>
                {/each}
              </div>
            </div>
          {/if}

          {#if textures.length > 0}
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3">Texture: <span class="text-dark-muted">{$selectedTexture}</span></label>
              <div class="flex flex-wrap gap-2">
                {#each textures as texture}
                  <button 
                    onclick={() => selectedTexture.set(texture)} 
                    class="px-4 py-2 rounded border {$selectedTexture === texture ? 'bg-primary text-black border-primary' : 'bg-[#0a0a0a] border-dark-border text-dark-text hover:border-primary'}"
                  >{texture}</button>
                {/each}
              </div>
            </div>
          {/if}

          <div class="flex gap-4">
            <button 
              onclick={addToCart} 
              disabled={!currentVariant}
              class="flex-1 btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if currentVariant} Add to Cart {:else} Select Options {/if}
            </button>
          </div>

          <div class="mt-8 pt-8 border-t border-dark-border">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-2 text-dark-muted"><Truck class="w-5 h-5 text-primary" /><span class="text-sm">Expedited Shipping</span></div>
              <div class="flex items-center gap-2 text-dark-muted"><ShieldCheck class="w-5 h-5 text-primary" /><span class="text-sm">Official Warranty</span></div>
              <div class="flex items-center gap-2 text-dark-muted"><RotateCcw class="w-5 h-5 text-primary" /><span class="text-sm">Hassle-free Returns</span></div>
              <div class="flex items-center gap-2 text-dark-muted"><Package class="w-5 h-5 text-primary" /><span class="text-sm">{currentVariant?.quantity || 0} left in stock</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
