<script lang="ts">
  import { ShoppingBag, X, Trash2 } from 'lucide-svelte';
  import { cart, cartOpen, cartTotal } from '$lib/stores';

  function close() { cartOpen.set(false); }
</script>

{#if $cartOpen}
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/70" onclick={close}></div>
    <div class="absolute right-0 top-0 h-full w-full max-w-md bg-dark-card shadow-2xl flex flex-col border-l border-dark-border">
      <div class="flex items-center justify-between p-6 border-b border-dark-border">
        <div class="flex items-center space-x-3">
          <ShoppingBag class="w-6 h-6 text-primary" />
          <h2 class="text-xl font-serif">Your Cart</h2>
        </div>
        <button onclick={close} class="p-2 text-dark-muted hover:text-dark-text">
          <X class="w-6 h-6" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6">
        {#if $cart.length === 0}
          <div class="text-center py-8">
            <ShoppingBag class="w-16 h-16 text-dark-border mx-auto mb-4" />
            <p class="text-dark-muted">Your cart is empty</p>
          </div>
        {:else}
          {#each $cart as item, i}
            <div class="flex gap-4 mb-4">
              <div class="w-20 h-20 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0 border border-dark-border">
                <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-sm">{item.name}</h3>
                <p class="text-xs text-dark-muted">{item.color}, {item.size}</p>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center border border-dark-border rounded">
                    <button onclick={() => cart.updateQuantity(i, -1)} class="px-2 py-1 hover:bg-dark-bg text-dark-muted">-</button>
                    <span class="px-3 text-sm">{item.quantity}</span>
                    <button onclick={() => cart.updateQuantity(i, 1)} class="px-2 py-1 hover:bg-dark-bg text-dark-muted">+</button>
                  </div>
                  <span class="font-medium text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              <button onclick={() => cart.remove(i)} class="text-dark-muted hover:text-red-500">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          {/each}
        {/if}
      </div>
      {#if $cart.length > 0}
        <div class="border-t border-dark-border p-6">
          <div class="flex justify-between items-center mb-4">
            <span class="font-medium">Total</span>
            <span class="text-2xl font-serif text-primary">${$cartTotal.toFixed(2)}</span>
          </div>
          <button onclick={() => alert('Checkout would integrate with Stripe here!')} class="w-full btn-primary py-4">Proceed to Checkout</button>
        </div>
      {/if}
    </div>
  </div>
{/if}
