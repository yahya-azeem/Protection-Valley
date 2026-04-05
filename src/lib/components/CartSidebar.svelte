<script lang="ts">
  import { ShoppingBag, X, Trash2 } from 'lucide-svelte';
  import { cart, cartOpen, cartTotal, showToast, isWholesale } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';
  import { goto } from '$app/navigation';
  import OptimizedImage from '$lib/components/OptimizedImage.svelte';

  function close() {
    cartOpen.set(false);
  }

  const wholesaleSuggestion = $derived.by(() => {
    if ($isWholesale) return null;
    const item = $cart.find((line) => line.quantity > 10);
    return item ?? null;
  });

  async function handleCheckout() {
    if ($cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    try {
      showToast('Preparing checkout...');
      const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.create_checkout_session, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: $cart.map((item) => ({
            product_id: item.id.toString(),
            variant_id: item.variant_id?.toString(),
            quantity: item.quantity
          })),
          success_url: `${window.location.origin}/?checkout=success`,
          cancel_url: `${window.location.origin}/?checkout=cancel`
        })
      });

      if (response.ok) {
        const payload = await response.json();
        if (payload?.url) {
          window.location.href = payload.url;
          return;
        }
        showToast('Checkout started but no redirect URL was returned.');
        return;
      }

      const err = await response.json().catch(() => ({ error: 'Unknown error' }));
      if (response.status === 503) {
        showToast('Checkout is currently unavailable.');
      } else {
        showToast(err.error || 'Failed to start checkout session.');
      }
    } catch {
      showToast('Unable to reach checkout service. Please try again later.');
    }
  }
</script>

{#if $cartOpen}
  <div class="fixed inset-0 z-[100]">
    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onclick={close}
      onkeydown={(e) => e.key === 'Escape' && close()}
      role="button"
      tabindex="0"
    ></div>

    <div class="absolute right-0 top-0 h-full w-full max-w-md bg-[#0A0A0A] shadow-2xl flex flex-col border-l border-white/10 animate-slide-in-right">
      <div class="flex items-center justify-between p-6 bg-black border-b border-white/10">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary/10 flex items-center justify-center rounded">
            <ShoppingBag class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 class="text-xl font-serif text-white">Cart</h2>
            <p class="text-xs text-zinc-500">{$cart.length} item{$cart.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onclick={close} class="p-1 text-zinc-500 hover:text-white transition-lux">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {#if $cart.length === 0}
          <div class="h-full flex flex-col items-center justify-center text-center">
            <div class="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-6 border border-white/5">
              <ShoppingBag class="w-7 h-7 text-zinc-700" />
            </div>
            <p class="text-sm text-zinc-500 mb-4">Your cart is empty</p>
            <button onclick={close} class="text-sm font-semibold text-primary hover:text-white transition-lux">
              Continue Shopping
            </button>
          </div>
        {:else}
          {#if wholesaleSuggestion}
            <div class="rounded border border-primary/40 bg-primary/10 p-4">
              <p class="text-xs text-zinc-200 leading-relaxed">
                You have more than 10 units of
                <span class="font-semibold text-primary"> {wholesaleSuggestion.name}</span>.
                Sign in for wholesale bulk pricing.
              </p>
              <button
                onclick={() => {
                  close();
                  goto('/login');
                }}
                class="mt-3 text-xs font-semibold tracking-[0.08em] text-primary hover:text-white transition-lux"
              >
                GO TO WHOLESALE LOGIN
              </button>
            </div>
          {/if}

          {#each $cart as item, i}
            <div class="group flex gap-4 bg-black border border-white/10 p-4 hover:border-primary/20 transition-lux rounded">
              <div class="w-20 h-20 bg-[#0A0A0A] p-1 border border-white/5 flex-shrink-0 rounded overflow-hidden">
                <OptimizedImage 
                  src={item.image || '/images/logo.png'} 
                  alt={item.name} 
                  class="w-full h-full object-contain"
                  width={100}
                  height={100}
                />
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div class="flex justify-between items-start">
                  <h3 class="text-sm font-medium text-white leading-tight pr-2">{item.name}</h3>
                  <button onclick={() => cart.remove(i)} class="text-zinc-600 hover:text-primary transition-lux flex-shrink-0">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <div class="space-y-2">
                  {#if item.size || item.color || item.texture}
                    <p class="text-xs text-zinc-500">{[item.size, item.color, item.texture].filter(Boolean).join(' / ')}</p>
                  {/if}
                  <div class="flex items-center justify-between">
                    <div class="flex items-center bg-[#111] border border-white/5 rounded overflow-hidden">
                      <button onclick={() => cart.updateQuantity(i, -1)} class="px-3 py-1 text-xs text-zinc-400 hover:text-primary transition-lux">-</button>
                      <span class="px-2 text-xs font-semibold text-white w-6 text-center">{item.quantity}</span>
                      <button onclick={() => cart.updateQuantity(i, 1)} class="px-3 py-1 text-xs text-zinc-400 hover:text-primary transition-lux">+</button>
                    </div>
                    <span class="text-base font-serif text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      {#if $cart.length > 0}
        <div class="bg-black p-6 border-t border-white/10 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-zinc-500">Total</span>
            <span class="text-2xl font-serif text-primary">${$cartTotal.toFixed(2)}</span>
          </div>
          <button
            onclick={handleCheckout}
            class="btn-primary w-full py-4 text-sm tracking-[0.15em]"
            disabled={$cart.length === 0}
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
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
