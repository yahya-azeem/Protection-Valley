<script lang="ts">
  import { onMount } from 'svelte'
  import { 
    searchedProducts, 
    categories, 
    selectedCategory, 
    searchQuery,
    type Product 
  } from '../stores/products'
  import { cart } from '../stores/cart'
  import { isWholesale } from '../stores/auth'
  import { cartOpen } from '../stores/ui'
  import { navigate } from '../lib/router'
  import { Search, ShoppingCart, Filter, ChevronDown } from 'lucide-svelte'

  let addedProducts = new Set<number>()
  let showFilters = false

  onMount(() => {
    // Parse URL params for category
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get('category')
    if (categoryParam) {
      selectedCategory.set(categoryParam)
    }
  })

  function addToCart(product: Product) {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      wholesalePrice: product.wholesalePrice,
      image: product.image,
      category: product.category
    })
    
    addedProducts.add(product.id)
    setTimeout(() => {
      addedProducts.delete(product.id)
      addedProducts = addedProducts
    }, 2000)
  }

  function handleProductClick(id: number) {
    navigate(`/product/${id}`)
  }

  function clearSearch() {
    searchQuery.set('')
  }
</script>

<svelte:head>
  <title>Products - ToolPro Supply</title>
  <meta name="description" content="Browse our extensive collection of professional tools. Power tools, hand tools, electrical equipment, and more." />
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Header -->
  <div class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-4xl font-serif mb-4">Our Products</h1>
      <p class="text-gray-600 max-w-2xl">
        Discover our comprehensive range of professional-grade tools. 
        From power tools to hand tools, we have everything you need for your projects.
      </p>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Search and Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <!-- Search -->
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={$searchQuery}
          placeholder="Search products..."
          class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        />
        {#if $searchQuery}
          <button 
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            on:click={clearSearch}
          >
            ×
          </button>
        {/if}
      </div>

      <!-- Category Filter -->
      <div class="relative">
        <button 
          class="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:border-primary transition-colors"
          on:click={() => showFilters = !showFilters}
        >
          <Filter class="w-5 h-5" />
          <span>{$selectedCategory}</span>
          <ChevronDown class="w-4 h-4" />
        </button>
        
        {#if showFilters}
          <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
            {#each $categories as category}
              <button
                class="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg {$selectedCategory === category ? 'text-primary font-medium' : 'text-gray-700'}"
                on:click={() => {
                  selectedCategory.set(category)
                  showFilters = false
                }}
              >
                {category}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Cart Quick Access -->
      <button 
        class="flex items-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        on:click={() => cartOpen.set(true)}
      >
        <ShoppingCart class="w-5 h-5" />
        <span>View Cart</span>
      </button>
    </div>

    <!-- Results Count -->
    <p class="text-gray-500 mb-6">
      Showing {$searchedProducts.length} products
      {#if $searchQuery}
        for "{$searchQuery}"
      {/if}
      {#if $selectedCategory !== 'All'}
        in {$selectedCategory}
      {/if}
    </p>

    <!-- Products Grid -->
    {#if $searchedProducts.length === 0}
      <div class="text-center py-16">
        <p class="text-gray-500 text-lg mb-4">No products found</p>
        <button 
          class="btn-primary"
          on:click={() => {
            searchQuery.set('')
            selectedCategory.set('All')
          }}
        >
          Clear Filters
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each $searchedProducts as product (product.id)}
          <div class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <!-- Image -->
            <button 
              class="relative aspect-square overflow-hidden bg-gray-100 w-full"
              on:click={() => handleProductClick(product.id)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {#if product.stock < 10}
                <span class="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded">
                  Low Stock
                </span>
              {/if}
            </button>
            
            <!-- Content -->
            <div class="p-4">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
              <button 
                class="text-left"
                on:click={() => handleProductClick(product.id)}
              >
                <h3 class="font-medium text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </button>
              
              <!-- Price -->
              <div class="mb-3">
                {#if $isWholesale}
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-serif text-primary">${product.wholesalePrice.toFixed(2)}</span>
                    <span class="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  </div>
                  <p class="text-xs text-green-600">Wholesale price</p>
                {:else}
                  <span class="text-xl font-serif">${product.price.toFixed(2)}</span>
                {/if}
              </div>
              
              <!-- Add to Cart -->
              <button
                class="w-full py-2 rounded-lg font-medium transition-all {addedProducts.has(product.id) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-primary hover:text-white'}"
                on:click={() => addToCart(product)}
                disabled={addedProducts.has(product.id)}
              >
                {addedProducts.has(product.id) ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
