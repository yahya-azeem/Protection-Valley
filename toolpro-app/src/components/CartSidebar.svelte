<script lang="ts">
  import { X, Plus, Minus, ShoppingBag } from 'lucide-svelte'
  import { cart, cartTotal, cartWholesaleTotal, cartCount, type CartItem } from '../stores/cart'
  import { cartOpen } from '../stores/ui'
  import { isWholesale } from '../stores/auth'
  import { navigate } from '../lib/router'

  function updateQuantity(item: CartItem, delta: number) {
    cart.updateQuantity(item.id, item.quantity + delta)
  }

  function handleCheckout() {
    cartOpen.set(false)
    navigate('/checkout')
  }

  function handleContinueShopping() {
    cartOpen.set(false)
    navigate('/products')
  }

  $: total = $isWholesale ? $cartWholesaleTotal : $cartTotal
</script>

{#if $cartOpen}
  <!-- Overlay -->
  <div 
    class="fixed inset-0 bg-black/50 z-50"
    on:click={() => cartOpen.set(false)}
  />
  
  <!-- Sidebar -->
  <div class="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <ShoppingBag class="w-6 h-6 text-primary" />
        <h2 class="text-xl font-serif">Your Cart</h2>
        <span class="text-sm text-gray-500">({$cartCount} items)</span>
      </div>
      <button 
        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        on:click={() => cartOpen.set(false)}
      >
        <X class="w-6 h-6" />
      </button>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto p-6">
      {#if $cart.length === 0}
        <div class="flex flex-col items-center justify-center h-full text-center">
          <ShoppingBag class="w-16 h-16 text-gray-300 mb-4" />
          <p class="text-gray-500 mb-4">Your cart is empty</p>
          <button 
            class="btn-primary"
            on:click={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      {:else}
        <div class="space-y-6">
          {#each $cart as item (item.id)}
            <div class="flex gap-4">
              <!-- Image -->
              <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name}
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Details -->
              <div class="flex-1">
                <h3 class="font-medium text-sm">{item.name}</h3>
                <p class="text-xs text-gray-500">{item.category}</p>
                <div class="flex items-center justify-between mt-2">
                  <!-- Quantity Controls -->
                  <div class="flex items-center border border-gray-200 rounded">
                    <button 
                      class="p-1 hover:bg-gray-100 transition-colors"
                      on:click={() => updateQuantity(item, -1)}
                    >
                      <Minus class="w-4 h-4" />
                    </button>
                    <span class="px-3 text-sm">{item.quantity}</span>
                    <button 
                      class="p-1 hover:bg-gray-100 transition-colors"
                      on:click={() => updateQuantity(item, 1)}
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <!-- Price -->
                  <div class="text-right">
                    {#if $isWholesale}
                      <p class="font-medium text-primary">${(item.wholesalePrice * item.quantity).toFixed(2)}</p>
                      <p class="text-xs text-gray-400 line-through">${(item.price * item.quantity).toFixed(2)}</p>
                    {:else}
                      <p class="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Footer -->
    {#if $cart.length > 0}
      <div class="border-t border-gray-100 p-6 space-y-4">
        {#if $isWholesale}
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Retail Total</span>
            <span class="text-gray-500 line-through">${$cartTotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium">Wholesale Total</span>
            <span class="text-2xl font-serif text-primary">${total.toFixed(2)}</span>
          </div>
          <p class="text-xs text-green-600">You save ${($cartTotal - $cartWholesaleTotal).toFixed(2)} with wholesale pricing!</p>
        {:else}
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium">Subtotal</span>
            <span class="text-2xl font-serif">${total.toFixed(2)}</span>
          </div>
          <p class="text-xs text-gray-500">Shipping and taxes calculated at checkout</p>
        {/if}
        
        <button 
          class="w-full btn-primary py-4"
          on:click={handleCheckout}
        >
          Proceed to Checkout
        </button>
        
        <button 
          class="w-full btn-secondary py-3"
          on:click={handleContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    {/if}
  </div>
{/if}
