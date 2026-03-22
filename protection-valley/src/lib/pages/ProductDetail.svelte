<script lang="ts">
  import { ArrowLeft, Truck, ShieldCheck, RotateCcw, Package } from 'lucide-svelte';
  import { selectedProduct, selectedSize, selectedColor, selectedImageIndex, isWholesale, cart, showToast, goBack } from '$lib/stores';
  import type { CartItem } from '$lib/types';

  let sp = $derived($selectedProduct);
  let price = $derived(sp ? ($isWholesale ? sp.wholesalePrice : sp.price) : 0);
  let originalPrice = $derived(sp && $isWholesale ? sp.price : null);

  function selectImage(i: number) { selectedImageIndex.set(i); }
  function selectColor(i: number) {
    if (!sp) return;
    selectedColor.set(sp.colors[i]);
    selectedImageIndex.set(0);
  }
  function selectSize(size: string) { selectedSize.set(size); }

  function addToCart() {
    if (!sp || !$selectedColor) return;
    const item: CartItem = {
      id: sp.id,
      name: sp.name,
      price: $isWholesale ? sp.wholesalePrice : sp.price,
      image: sp.images[$selectedImageIndex],
      color: $selectedColor.name,
      size: $selectedSize,
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
        <!-- Image Gallery -->
        <div>
          <div class="aspect-square bg-dark-card rounded-lg overflow-hidden mb-4 border border-dark-border">
            <img src={$selectedColor?.image || sp.images[$selectedImageIndex]} alt={sp.name} class="w-full h-full object-cover" />
          </div>
          {#if sp.images.length > 1}
            <div class="flex gap-2">
              {#each sp.images as img, i}
                <button onclick={() => selectImage(i)} class="w-20 h-20 rounded-lg overflow-hidden border-2 {i === $selectedImageIndex ? 'border-primary' : 'border-dark-border'} hover:border-primary transition-colors">
                  <img src={img} class="w-full h-full object-cover" alt="" />
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Info -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm text-primary">{sp.type}</span>
            <span class="text-sm text-dark-muted">•</span>
            <span class="text-sm text-dark-muted">{sp.category}</span>
          </div>
          <h1 class="text-3xl font-serif mb-4">{sp.name}</h1>
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl font-serif text-primary">${price.toFixed(2)}</span>
            {#if originalPrice}
              <span class="text-lg text-dark-muted line-through">${originalPrice.toFixed(2)}</span>
            {/if}
          </div>
          <p class="text-dark-muted mb-8">{sp.description}</p>

          <!-- Colors -->
          {#if sp.colors.length > 1}
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3">Color: <span class="text-dark-muted">{$selectedColor?.name}</span></label>
              <div class="flex gap-3">
                {#each sp.colors as color, i}
                  <button onclick={() => selectColor(i)} class="color-option {$selectedColor?.name === color.name ? 'active' : ''}" style="background-color: {color.hex};" title={color.name}></button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Sizes -->
          <div class="mb-6">
            <label class="block text-sm font-medium mb-3">Size: <span class="text-dark-muted">{$selectedSize}</span></label>
            <div class="flex flex-wrap gap-2">
              {#each sp.sizes as size}
                <button onclick={() => selectSize(size)} class="size-option {$selectedSize === size ? 'active' : ''}">{size}</button>
              {/each}
            </div>
          </div>

          <div class="flex gap-4">
            <button onclick={addToCart} class="flex-1 btn-primary py-4 text-lg">Add to Cart</button>
          </div>

          <div class="mt-8 pt-8 border-t border-dark-border">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-2 text-dark-muted"><Truck class="w-5 h-5 text-primary" /><span class="text-sm">Free shipping over $100</span></div>
              <div class="flex items-center gap-2 text-dark-muted"><ShieldCheck class="w-5 h-5 text-primary" /><span class="text-sm">Lifetime warranty</span></div>
              <div class="flex items-center gap-2 text-dark-muted"><RotateCcw class="w-5 h-5 text-primary" /><span class="text-sm">30-day returns</span></div>
              <div class="flex items-center gap-2 text-dark-muted"><Package class="w-5 h-5 text-primary" /><span class="text-sm">{sp.stock} in stock</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
