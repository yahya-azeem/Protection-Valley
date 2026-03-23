<script lang="ts">
  import { ShoppingBag, X, Trash2, Shield, ArrowRight } from 'lucide-svelte';
  import { cart, cartOpen, cartTotal, showPage, showToast } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';

  function close() { cartOpen.set(false); }

  async function handleCheckout() {
    try {
      showToast('Preparing Secure Checkout...');
      const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.create_checkout_session, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: $cart.map(item => ({
            product_id: parseInt(item.ebay_id), // Assuming ebay_id maps to product_id for this demo
            quantity: item.quantity
          })),
          success_url: window.location.origin + '/?checkout=success',
          cancel_url: window.location.origin + '/?checkout=cancel'
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const err = await response.json();
        showToast('Checkout Error: ' + (err.error || 'Failed to start session'));
      }
    } catch (e) {
      showToast('Checkout unavailable. Check connection.');
    }
  }
</script>

{#if $cartOpen}
  <div class="fixed inset-0 z-[100]">
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-md" 
      onclick={close}
      onkeydown={(e) => e.key === 'Escape' && close()}
      role="button"
      tabindex="0"
    ></div>
    
    <div class="absolute right-0 top-0 h-full w-full max-w-md bg-dark-surface shadow-2xl flex flex-col border-l border-white/5 animate-slide-in-right">
      <!-- Header -->
      <div class="flex items-center justify-between p-10 bg-black border-b border-white/5">
        <div class="flex items-center space-x-6">
          <div class="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm">
            <ShoppingBag class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 class="text-3xl font-serif text-white tracking-tight">Cart</h2>
            <p class="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-zinc-500">{$cart.length} Items</p>
          </div>
        </div>
        <button onclick={close} class="p-2 text-zinc-600 hover:text-white transition-lux">
          <X class="w-8 h-8" />
        </button>
      </div>

      <!-- Items List -->
      <div class="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
        {#if $cart.length === 0}
          <div class="h-full flex flex-col items-center justify-center text-center">
            <div class="w-24 h-24 bg-dark-elevated rounded-full flex items-center justify-center mb-10 border border-white/5">
              <ShoppingBag class="w-10 h-10 text-zinc-800" />
            </div>
            <p class="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-zinc-600">Your cart is empty</p>
            <button 
              onclick={close}
              class="mt-12 text-[0.7rem] font-bold uppercase tracking-[0.6em] text-primary hover:text-white transition-lux"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        {:else}
          {#each $cart as item, i}
            <div class="group flex gap-8 bg-black border border-white/5 p-6 hover:border-primary/20 transition-lux rounded-sm">
              <div class="w-28 h-28 bg-dark-surface p-2 border border-white/5 flex-shrink-0">
                <img src={item.image} alt={item.name} class="w-full h-full object-contain" />
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div class="flex justify-between items-start">
                  <h3 class="text-sm font-serif text-white leading-tight group-hover:text-primary transition-lux pr-4">{item.name}</h3>
                  <button onclick={() => cart.remove(i)} class="text-zinc-600 hover:text-primary transition-lux">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <div class="space-y-4">
                  <p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    {item.size} / {item.color}
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center bg-dark-elevated border border-white/5 rounded-sm overflow-hidden">
                      <button onclick={() => cart.updateQuantity(i, -1)} class="px-4 py-1 text-xs font-bold text-zinc-400 hover:text-primary transition-lux">-</button>
                      <span class="px-3 text-[0.65rem] font-bold text-white w-8 text-center">{item.quantity}</span>
                      <button onclick={() => cart.updateQuantity(i, 1)} class="px-4 py-1 text-xs font-bold text-zinc-400 hover:text-primary transition-lux">+</button>
                    </div>
                    <span class="text-lg font-serif text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Checkout Footer -->
      {#if $cart.length > 0}
        <div class="bg-black p-10 border-t border-white/5 space-y-8">
          <div class="flex justify-between items-center">
            <span class="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-zinc-600">Total</span>
            <span class="text-4xl font-serif text-primary">${$cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onclick={handleCheckout} 
            class="btn-primary w-full py-6 flex items-center justify-center tracking-[0.6em] text-[0.7rem]"
          >
            CHECKOUT
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .animate-slide-in-right {
    animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
