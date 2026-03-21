<script lang="ts">
  import { onMount } from 'svelte'
  import { products, type Product } from '../stores/products'
  import { cart } from '../stores/cart'
  import { isWholesale } from '../stores/auth'
  import { cartOpen } from '../stores/ui'
  import { navigate, getParams, currentPath } from '../lib/router'
  import { ChevronLeft, Plus, Minus, ShoppingCart, Check, Truck, Shield, RotateCcw } from 'lucide-svelte'

  let product: Product | null = null
  let quantity = 1
  let added = false
  let relatedProducts: Product[] = []

  onMount(() => {
    const params = getParams($currentPath, '/product/:id')
    if (params?.id) {
      const id = parseInt(params.id)
      products.subscribe(p => {
        product = p.find(prod => prod.id === id) || null
        if (product) {
          relatedProducts = p
            .filter(prod => prod.category === product?.category && prod.id !== product?.id)
            .slice(0, 4)
        }
      })()
    }
  })

  function addToCart() {
    if (!product) return
    
    for (let i = 0; i < quantity; i++) {
      cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        wholesalePrice: product.wholesalePrice,
        image: product.image,
        category: product.category
      })
    }
    
    added = true
    setTimeout(() => added = false, 2000)
  }

  function incrementQuantity() {
    if (product && quantity < product.stock) {
      quantity++
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      quantity--
    }
  }
</script>

<svelte:head>
  {#if product}
    <title>{product.name} - ToolPro Supply</title>
    <meta name="description" content={product.description} />
  {:else}
    <title>Product - ToolPro Supply</title>
  {/if}
</svelte:head>

{#if product}
  <div class="min-h-screen bg-background">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          class="flex items-center text-gray-500 hover:text-primary transition-colors"
          on:click={() => navigate('/products')}
        >
          <ChevronLeft class="w-4 h-4 mr-1" />
          Back to Products
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image -->
        <div class="bg-white rounded-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            class="w-full aspect-square object-cover"
          />
        </div>

        <!-- Details -->
        <div>
          <p class="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
          <h1 class="text-4xl font-serif mb-4">{product.name}</h1>
          
          <!-- Price -->
          <div class="mb-6">
            {#if $isWholesale}
              <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl font-serif text-primary">${product.wholesalePrice.toFixed(2)}</span>
                <span class="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
              </div>
              <p class="text-green-600">You're saving ${(product.price - product.wholesalePrice).toFixed(2)} with wholesale pricing!</p>
            {:else}
              <span class="text-3xl font-serif">${product.price.toFixed(2)}</span>
              <p class="text-gray-500 mt-1">
                <button 
                  class="text-primary hover:underline"
                  on:click={() => navigate('/login')}
                >
                  Sign in for wholesale pricing
                </button>
              </p>
            {/if}
          </div>

          <!-- Description -->
          <p class="text-gray-600 mb-6">{product.description}</p>

          <!-- SKU and Stock -->
          <div class="flex items-center gap-6 mb-6 text-sm">
            <span class="text-gray-500">SKU: <span class="text-gray-800">{product.sku}</span></span>
            <span class="text-gray-500">
              Availability: 
              <span class={product.stock > 10 ? 'text-green-600' : 'text-orange-500'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </span>
          </div>

          <!-- Quantity and Add to Cart -->
          {#if product.stock > 0}
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
              <!-- Quantity Selector -->
              <div class="flex items-center border border-gray-200 rounded-lg">
                <button 
                  class="p-3 hover:bg-gray-100 transition-colors"
                  on:click={decrementQuantity}
                >
                  <Minus class="w-5 h-5" />
                </button>
                <span class="px-6 text-lg font-medium">{quantity}</span>
                <button 
                  class="p-3 hover:bg-gray-100 transition-colors"
                  on:click={incrementQuantity}
                >
                  <Plus class="w-5 h-5" />
                </button>
              </div>

              <!-- Add to Cart -->
              <button
                class="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
                on:click={addToCart}
              >
                {#if added}
                  <Check class="w-5 h-5" />
                  <span>Added to Cart!</span>
                {:else}
                  <ShoppingCart class="w-5 h-5" />
                  <span>Add to Cart</span>
                {/if}
              </button>
            </div>
          {/if}

          <!-- Features -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Truck class="w-6 h-6 text-primary" />
              <div>
                <p class="font-medium text-sm">Free Shipping</p>
                <p class="text-xs text-gray-500">On orders over $100</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield class="w-6 h-6 text-primary" />
              <div>
                <p class="font-medium text-sm">Warranty</p>
                <p class="text-xs text-gray-500">Manufacturer backed</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <RotateCcw class="w-6 h-6 text-primary" />
              <div>
                <p class="font-medium text-sm">Easy Returns</p>
                <p class="text-xs text-gray-500">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      {#if relatedProducts.length > 0}
        <div class="mt-16">
          <h2 class="text-2xl font-serif mb-8">Related Products</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each relatedProducts as related}
              <button 
                class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow text-left"
                on:click={() => navigate(`/product/${related.id}`)}
              >
                <div class="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={related.image} 
                    alt={related.name}
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div class="p-4">
                  <p class="text-xs text-gray-500 uppercase">{related.category}</p>
                  <h3 class="font-medium mt-1 group-hover:text-primary transition-colors">{related.name}</h3>
                  <p class="text-primary font-serif mt-2">
                    ${$isWholesale ? related.wholesalePrice.toFixed(2) : related.price.toFixed(2)}
                  </p>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-500 text-lg mb-4">Product not found</p>
      <button 
        class="btn-primary"
        on:click={() => navigate('/products')}
      >
        Browse Products
      </button>
    </div>
  </div>
{/if}
