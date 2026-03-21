<script lang="ts">
  import { cart, cartTotal, cartWholesaleTotal, cartCount } from '../stores/cart'
  import { isWholesale } from '../stores/auth'
  import { navigate } from '../lib/router'
  import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-svelte'

  function updateQuantity(id: number, delta: number) {
    const item = $cart.find(i => i.id === id)
    if (item) {
      cart.updateQuantity(id, item.quantity + delta)
    }
  }

  $: total = $isWholesale ? $cartWholesaleTotal : $cartTotal
  $: savings = $cartTotal - $cartWholesaleTotal
</script>

<svelte:head>
  <title>Shopping Cart - ToolPro Supply</title>
  <meta name="description" content="Review your cart and proceed to checkout." />
</svelte:head>

<div class="min-h-screen bg-background">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-4xl font-serif mb-8">Shopping Cart</h1>

    {#if $cart.length === 0}
      <div class="text-center py-16 bg-white rounded-lg">
        <ShoppingBag class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <button 
          class="btn-primary"
          on:click={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          {#each $cart as item (item.id)}
            <div class="bg-white rounded-lg p-6 flex gap-6">
              <!-- Image -->
              <button 
                class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                on:click={() => navigate(`/product/${item.id}`)}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  class="w-full h-full object-cover"
                />
              </button>

              <!-- Details -->
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <button 
                      class="font-medium text-lg hover:text-primary transition-colors"
                      on:click={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </button>
                    <p class="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button 
                    class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    on:click={() => cart.removeItem(item.id)}
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

                <div class="flex items-center justify-between mt-4">
                  <!-- Quantity -->
                  <div class="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      class="p-2 hover:bg-gray-100 transition-colors"
                      on:click={() => updateQuantity(item.id, -1)}
                    >
                      <Minus class="w-4 h-4" />
                    </button>
                    <span class="px-4 font-medium">{item.quantity}</span>
                    <button 
                      class="p-2 hover:bg-gray-100 transition-colors"
                      on:click={() => updateQuantity(item.id, 1)}
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Price -->
                  <div class="text-right">
                    {#if $isWholesale}
                      <p class="text-lg font-serif text-primary">${(item.wholesalePrice * item.quantity).toFixed(2)}</p>
                      <p class="text-sm text-gray-400 line-through">${(item.price * item.quantity).toFixed(2)}</p>
                    {:else}
                      <p class="text-lg font-serif">${(item.price * item.quantity).toFixed(2)}</p>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}

          <button 
            class="flex items-center text-primary hover:underline"
            on:click={() => navigate('/products')}
          >
            <ArrowRight class="w-4 h-4 mr-1 rotate-180" />
            Continue Shopping
          </button>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg p-6 sticky top-24">
            <h2 class="text-xl font-serif mb-6">Order Summary</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Items ({$cartCount})</span>
                <span>${$cartTotal.toFixed(2)}</span>
              </div>
              
              {#if $isWholesale}
                <div class="flex justify-between text-green-600">
                  <span>Wholesale Discount</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              {/if}
              
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{total >= 100 ? 'Free' : 'Calculated at checkout'}</span>
              </div>
              
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-lg">Total</span>
                  <span class="text-2xl font-serif text-primary">${total.toFixed(2)}</span>
                </div>
                {#if $isWholesale}
                  <p class="text-sm text-green-600 mt-1">You save ${savings.toFixed(2)}!</p>
                {/if}
              </div>
            </div>

            <button 
              class="w-full btn-primary py-4 mb-4"
              on:click={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <p class="text-xs text-gray-500 text-center">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
