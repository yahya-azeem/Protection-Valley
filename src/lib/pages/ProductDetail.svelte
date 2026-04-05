<script lang="ts">
  import { Truck, ShieldCheck, RotateCcw, Package, ShoppingCart, ChevronRight, Boxes } from 'lucide-svelte';
  import { selectedProduct, selectedVariant, selectedSize, selectedColor, selectedTexture, cart, showToast, goBack, isWholesale, currentCategory } from '$lib/stores';
  import { WHOLESALE_DISCOUNT } from '$lib/constants';
  import type { CartItem, Product } from '$lib/types';
  import OptimizedImage from '$lib/components/OptimizedImage.svelte';

  let sp = $derived($selectedProduct);
  
  let colors = $derived(Array.from(new Set(sp?.variants?.map(v => v.color).filter(Boolean) as string[])));
  let sizes = $derived(Array.from(new Set(sp?.variants?.map(v => v.size).filter(Boolean) as string[])));
  let textures = $derived(Array.from(new Set(sp?.variants?.map(v => v.texture).filter(Boolean) as string[])));

  let currentVariant = $derived.by(() => {
    if (!sp || !sp.variants) return null;
    return sp.variants.find(v => 
      (!$selectedColor || v.color === $selectedColor) &&
      (!$selectedSize || v.size === $selectedSize) &&
      (!$selectedTexture || v.texture === $selectedTexture)
    ) || sp.variants[0];
  });

  $effect(() => { if (currentVariant) selectedVariant.set(currentVariant); });

  function addToCart(qty = 1) {
    if (!currentVariant || !sp) return;
    const item: CartItem = {
      id: sp.id,
      variant_id: currentVariant.id,
      ebay_id: currentVariant.ebay_item_id || '',
      name: `${sp.name} - ${currentVariant.color || ''} ${currentVariant.size || ''}`.trim(),
      price: $isWholesale ? currentVariant.price * (1 - WHOLESALE_DISCOUNT) : currentVariant.price,
      image: currentVariant.image_url || sp.image_url || '/images/placeholder.png',
      color: currentVariant.color,
      size: currentVariant.size,
      texture: currentVariant.texture,
      quantity: qty,
    };
    cart.add(item);
    showToast(`${qty > 1 ? `${qty} units` : 'Item'} added to cart`);
  }
</script>

{#if sp}
  <div class="bg-black min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-[#0A0A0A] border-b border-white/5 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-3 text-sm text-zinc-500">
        <a href="/catalog" class="hover:text-primary transition-lux">Catalog</a>
        <ChevronRight class="w-3 h-3 opacity-30" />
        <span>{$currentCategory}</span>
        <ChevronRight class="w-3 h-3 opacity-30" />
        <span class="text-white">{sp.name}</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <!-- Imagery -->
        <div class="space-y-4 lg:sticky lg:top-24">
          <div class="aspect-square bg-[#0A0A0A] border border-white/10 rounded overflow-hidden group">
            <OptimizedImage 
              src={currentVariant?.image_url || sp.image_url || '/images/placeholder.png'} 
              alt={sp.name}
              class="w-full h-full object-cover transition-lux duration-700 group-hover:scale-105"
              width={800}
              height={800}
              priority={true}
            />
          </div>
          <div class="grid grid-cols-4 gap-3">
            {#each (sp.variants?.slice(0, 4) || []) as variant}
              <button 
                onclick={() => {
                  if (variant.color) selectedColor.set(variant.color);
                  if (variant.size) selectedSize.set(variant.size);
                  if (variant.texture) selectedTexture.set(variant.texture);
                }}
                class="aspect-square bg-[#0A0A0A] border-2 transition-lux rounded {currentVariant?.id === variant.id ? 'border-primary' : 'border-white/10 opacity-50 hover:opacity-100'}"
              >
                <OptimizedImage 
                  src={variant.image_url || sp.image_url || ''} 
                  alt="Variant" 
                  class="w-full h-full object-cover rounded"
                  width={200}
                  height={200}
                />
              </button>
            {/each}
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <!-- Category label -->
          <span class="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
            {sp.category}
          </span>
          
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 leading-tight">
            {sp.name}
          </h1>
          
          <p class="text-base text-zinc-400 leading-relaxed mb-6 md:mb-8 border-l-2 border-primary/20 pl-4 md:pl-5">
            {sp.description || 'Premium handcrafted workgear built for the modern professional.'}
          </p>

          <!-- Price -->
          <div class="flex items-baseline gap-4 mb-2">
            <span class="text-3xl md:text-4xl font-serif text-primary">
              ${($isWholesale ? (currentVariant?.price || 0) * (1 - WHOLESALE_DISCOUNT) : (currentVariant?.price || 0)).toFixed(2)}
            </span>
            {#if $isWholesale}
              <span class="text-lg text-zinc-600 line-through">${(currentVariant?.price || 0).toFixed(2)}</span>
            {/if}
          </div>
          <p class="text-xs text-zinc-500 mb-8">
            {$isWholesale ? 'Wholesale rate' : 'Retail price'} · {currentVariant?.texture || ''}
          </p>
          
          <!-- Selections -->
          <div class="space-y-6 mb-8">
            {#if colors.length > 0}
              <div>
                <span class="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-3">Color</span>
                <div class="flex flex-wrap gap-2">
                  {#each colors as color}
                    <button 
                      onclick={() => selectedColor.set(color)} 
                      disabled={colors.length === 1}
                      class="px-5 py-2.5 text-sm font-medium border rounded transition-lux
                        {$selectedColor === color 
                          ? 'bg-primary text-black border-primary' 
                          : 'bg-[#0A0A0A] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}"
                    >{color}</button>
                  {/each}
                </div>
              </div>
            {/if}

            {#if sizes.length > 0}
              <div>
                <span class="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-3">Size</span>
                <div class="flex flex-wrap gap-2">
                  {#each sizes as size}
                    <button 
                      onclick={() => selectedSize.set(size)} 
                      disabled={sizes.length === 1}
                      class="px-5 py-2.5 text-sm font-medium border rounded transition-lux
                        {$selectedSize === size 
                          ? 'bg-primary text-black border-primary' 
                          : 'bg-[#0A0A0A] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}"
                    >{size}</button>
                  {/each}
                </div>
              </div>
            {/if}

            {#if textures.length > 0}
              <div>
                <span class="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-3">Texture</span>
                <div class="flex flex-wrap gap-2">
                  {#each textures as texture}
                    <button 
                      onclick={() => selectedTexture.set(texture)} 
                      disabled={textures.length === 1}
                      class="px-5 py-2.5 text-sm font-medium border rounded transition-lux
                        {$selectedTexture === texture
                          ? 'bg-primary text-black border-primary' 
                          : 'bg-[#0A0A0A] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}"
                    >{texture}</button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 mb-10">
            <button 
              onclick={() => addToCart(1)} 
              disabled={!currentVariant || !currentVariant.in_stock}
              class="btn-primary py-4 px-8 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.1em]"
            >
              <ShoppingCart class="w-4 h-4" />
              {currentVariant?.in_stock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            
            {#if $isWholesale && currentVariant?.in_stock}
              <button 
                onclick={() => addToCart(10)} 
                class="bg-white text-black py-4 px-8 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.1em] hover:bg-zinc-200 transition-lux rounded-sm"
              >
                <Boxes class="w-4 h-4" /> BULK ORDER (10)
              </button>
            {/if}
          </div>

          <!-- Technical Details -->
          <div class="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <div class="flex items-start gap-3 group">
              <div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">
                <Truck class="w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-xs font-semibold text-white mb-0.5">Free Shipping</h4>
                <p class="text-xs text-zinc-500">UPS Ground</p>
              </div>
            </div>
            <div class="flex items-start gap-3 group">
              <div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">
                <ShieldCheck class="w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-xs font-semibold text-white mb-0.5">Warranty</h4>
                <p class="text-xs text-zinc-500">Lifetime guarantee</p>
              </div>
            </div>
            <div class="flex items-start gap-3 group">
              <div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">
                <RotateCcw class="w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-xs font-semibold text-white mb-0.5">Returns</h4>
                <p class="text-xs text-zinc-500">30-day evaluation</p>
              </div>
            </div>
            <div class="flex items-start gap-3 group">
              <div class="bg-[#0A0A0A] p-2.5 border border-white/5 rounded">
                <Package class="w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-lux" />
              </div>
              <div>
                <h4 class="text-xs font-semibold text-white mb-0.5">Availability</h4>
                <p class="text-xs text-zinc-500">{currentVariant?.in_stock ? `${currentVariant.stock} units` : 'Out of Stock'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
