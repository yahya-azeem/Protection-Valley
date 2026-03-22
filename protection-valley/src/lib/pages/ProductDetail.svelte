<script lang="ts">
  import { ArrowLeft, Truck, ShieldCheck, RotateCcw, Package, ShoppingCart, ChevronRight, Boxes } from 'lucide-svelte';
  import { selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture, cart, showToast, goBack, isWholesale, currentCategory } from '$lib/stores';
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

  function addToCart(qty = 1) {
    if (!currentVariant || !sp) return;
    const item: CartItem = {
      id: currentVariant.id || currentVariant.ebay_id,
      ebay_id: currentVariant.ebay_id,
      name: `${sp.name} - ${currentVariant.color || ''} ${currentVariant.size || ''}`.trim(),
      price: $isWholesale ? currentVariant.price * 0.7 : currentVariant.price,
      image: currentVariant.image_url || '/images/placeholder.png',
      color: currentVariant.color,
      size: currentVariant.size,
      texture: currentVariant.texture,
      quantity: qty,
    };
    cart.add(item);
    showToast(`${qty > 1 ? 'Bulk quantity' : 'Item'} added to cart`);
  }
</script>

{#if sp}
  <div class="bg-black min-h-screen">
    <!-- Breadcrumb (Clean & Professional) -->
    <div class="bg-dark-surface border-b border-white/5 py-6">
      <div class="max-w-7xl mx-auto px-4 flex items-center space-x-6 text-[0.65rem] font-bold uppercase tracking-[0.5em] text-zinc-600">
        <button onclick={() => goBack()} class="hover:text-primary transition-lux">Collection</button>
        <ChevronRight class="w-3 h-3 opacity-20" />
        <span class="text-zinc-500">{$currentCategory}</span>
        <ChevronRight class="w-3 h-3 opacity-20" />
        <span class="text-white">{sp.name}</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 section-padding">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
        <!-- Imagery -->
        <div class="space-y-12 sticky top-40">
          <div class="aspect-square bg-dark-surface border border-white/5 rounded-sm overflow-hidden group">
            <img 
              src={currentVariant?.image_url || '/images/placeholder.png'} 
              alt={sp.name} 
              class="w-full h-full object-cover transition-lux duration-1000 group-hover:scale-105" 
            />
          </div>
          <div class="grid grid-cols-4 gap-6">
            {#each sp.variants.slice(0, 4) as variant}
              <button 
                onclick={() => {
                  selectedColor.set(variant.color || '');
                  selectedSize.set(variant.size || '');
                }}
                class="aspect-square bg-dark-surface border transition-lux {currentVariant?.id === variant.id ? 'border-primary' : 'border-white/5 opacity-40 hover:opacity-100'}"
              >
                <img src={variant.image_url} alt="Variant" class="w-full h-full object-cover" />
              </button>
            {/each}
          </div>
        </div>

        <!-- Specifications -->
        <div class="flex flex-col">
          <div class="mb-20">
            <div class="flex items-center space-x-8 mb-12">
              <span class="text-primary text-[0.65rem] font-bold uppercase tracking-[0.6em]">
                {$isWholesale ? 'WHOLESALE' : 'COLLECTION'}
              </span>
              <div class="h-[1px] w-24 bg-primary/20"></div>
            </div>
            
            <h1 class="text-7xl font-serif text-white mb-12 leading-tight tracking-tight">
              {sp.name}
            </h1>
            
            <p class="text-zinc-500 text-2xl font-serif italic leading-relaxed border-l-2 border-primary/20 pl-10 py-2">
              "{sp.description || 'Superior quality handcrafted gear for the modern professional.'}"
            </p>
          </div>

          <div class="flex flex-col space-y-4 mb-24">
            <div class="flex items-baseline space-x-6">
              <span class="text-7xl font-serif text-primary">
                ${($isWholesale ? (currentVariant?.price || 0) * 0.7 : (currentVariant?.price || 0)).toFixed(2)}
              </span>
              {#if $isWholesale}
                <span class="text-2xl font-serif text-zinc-700 line-through">${(currentVariant?.price || 0).toFixed(2)}</span>
              {/if}
            </div>
            <div class="text-[0.65rem] font-bold uppercase tracking-[0.5em] text-zinc-600">
              {$isWholesale ? 'Wholesale bulk rate authorized' : 'Retail price'}
            </div>
          </div>
          
          <!-- Selections -->
          <div class="space-y-16 mb-24">
            {#if colors.length > 0}
              <div class="space-y-8">
                <label class="block text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Select Finish</label>
                <div class="flex flex-wrap gap-6">
                  {#each colors as color}
                    <button 
                      onclick={() => selectedColor.set(color)} 
                      class="px-12 py-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] border rounded-sm transition-lux
                        {$selectedColor === color 
                          ? 'bg-primary text-black border-primary shadow-gold' 
                          : 'bg-dark-surface border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'}"
                    >{color}</button>
                  {/each}
                </div>
              </div>
            {/if}

            {#if sizes.length > 0}
              <div class="space-y-8">
                <label class="block text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Select Size</label>
                <div class="flex flex-wrap gap-6">
                  {#each sizes as size}
                    <button 
                      onclick={() => selectedSize.set(size)} 
                      class="px-12 py-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] border rounded-sm transition-lux
                        {$selectedSize === size 
                          ? 'bg-primary text-black border-primary shadow-gold' 
                          : 'bg-dark-surface border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'}"
                    >{size}</button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Checkout Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            <button 
              onclick={() => addToCart(1)} 
              disabled={!currentVariant}
              class="btn-primary py-8 flex items-center justify-center tracking-[0.6em] text-[0.75rem] group"
            >
              <ShoppingCart class="w-5 h-5 mr-6 transition-lux group-hover:scale-110" />
              ADD TO CART
            </button>
            
            {#if $isWholesale}
              <button 
                onclick={() => addToCart(10)} 
                class="bg-white text-black py-8 flex items-center justify-center tracking-[0.6em] text-[0.75rem] font-bold hover:bg-zinc-200 transition-lux rounded-sm shadow-xl"
              >
                <Boxes class="w-5 h-5 mr-6" /> BUY IN BULK (10X)
              </button>
            {/if}
          </div>

          <!-- Technical Details (Elevated Surface) -->
          <div class="grid grid-cols-2 gap-y-16 gap-x-20 border-t border-white/5 pt-24">
            <div class="flex items-start space-x-8 group">
              <div class="bg-dark-surface p-4 border border-white/5 rounded-sm">
                <Truck class="w-6 h-6 text-primary opacity-60 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white mb-2">Shipping</h4>
                <p class="text-[0.6rem] font-medium text-zinc-600 uppercase tracking-[0.3em]">Complimentary UPS Ground</p>
              </div>
            </div>
            <div class="flex items-start space-x-8 group">
              <div class="bg-dark-surface p-4 border border-white/5 rounded-sm">
                <ShieldCheck class="w-6 h-6 text-primary opacity-60 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white mb-2">Warranty</h4>
                <p class="text-[0.6rem] font-medium text-zinc-600 uppercase tracking-[0.3em]">Lifetime Craftsmanship Guarantee</p>
              </div>
            </div>
            <div class="flex items-start space-x-8 group">
              <div class="bg-dark-surface p-4 border border-white/5 rounded-sm">
                <RotateCcw class="w-6 h-6 text-primary opacity-60 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white mb-2">Returns</h4>
                <p class="text-[0.6rem] font-medium text-zinc-600 uppercase tracking-[0.3em]">30-Day Evaluation Period</p>
              </div>
            </div>
            <div class="flex items-start space-x-8 group">
              <div class="bg-dark-surface p-4 border border-white/5 rounded-sm">
                <Package class="w-6 h-6 text-primary opacity-60 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white mb-2">Stock</h4>
                <p class="text-[0.6rem] font-medium text-zinc-600 uppercase tracking-[0.3em]">{currentVariant?.quantity || 12} Units Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
