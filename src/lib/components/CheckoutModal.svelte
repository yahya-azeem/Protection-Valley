<script lang="ts">
  import { X, CreditCard, Send, CheckCircle2, ArrowLeft } from 'lucide-svelte';
  import { cart, cartTotal, checkoutOpen, showToast, currentUser } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';

  let step = $state<'method' | 'address' | 'zelle' | 'success'>('method');
  let paymentMethod = $state<'stripe' | 'zelle'>('stripe');

  // Shipping Address Form State
  let firstName = $state('');
  let lastName = $state('');
  let email = $state($currentUser?.email || '');
  let phone = $state('');
  let addressLine1 = $state('');
  let addressLine2 = $state('');
  let city = $state('');
  let state = $state('');
  let zip = $state('');
  let country = $state('US');

  let loading = $state(false);
  let createdOrder = $state<any>(null);

  function close() {
    checkoutOpen.set(false);
    // Reset state
    step = 'method';
    createdOrder = null;
  }

  function handleBack() {
    if (step === 'address') {
      step = 'method';
    } else if (step === 'zelle') {
      step = 'address';
    }
  }

  function handleMethodNext() {
    step = 'address';
  }

  async function handleAddressSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !addressLine1 || !city || !state || !zip) {
      showToast('Please fill in all required fields.');
      return;
    }

    if (paymentMethod === 'stripe') {
      await proceedToStripe();
    } else {
      step = 'zelle';
    }
  }

  async function proceedToStripe() {
    loading = true;
    try {
      showToast('Redirecting to secure card payment...');
      const res = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoints.create_checkout_session, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$currentUser?.token || ''}`
        },
        body: JSON.stringify({
          items: $cart.map(item => ({
            product_id: item.id.toString(),
            variant_id: item.variant_id?.toString(),
            quantity: item.quantity
          })),
          success_url: `${window.location.origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/?checkout=cancel`
        })
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload?.url) {
          window.location.href = payload.url;
          return;
        }
      }
      const err = await res.json().catch(() => ({ error: 'Checkout failed' }));
      showToast(err.error || 'Failed to start card checkout.');
    } catch {
      showToast('Error connecting to Stripe service.');
    } finally {
      loading = false;
    }
  }

  async function placeZelleOrder() {
    loading = true;
    try {
      showToast('Submitting your order...');
      const orderData = {
        customer_id: 0,
        customer_email: email,
        items: $cart.map(item => ({
          product_id: item.id.toString(),
          variant_id: item.variant_id?.toString(),
          quantity: item.quantity
        })),
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address_line1: addressLine1,
          address_line2: addressLine2 || null,
          city,
          state,
          zip,
          country,
          phone: phone || null
        },
        payment_method: 'Zelle'
      };

      const res = await fetch(`${API_CONFIG.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$currentUser?.token || ''}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        createdOrder = await res.json();
        cart.clear();
        step = 'success';
        showToast('Order placed successfully!');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to submit order.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error while placing order.');
    } finally {
      loading = false;
    }
  }
</script>

{#if $checkoutOpen}
  <div class="fixed inset-0 z-[150] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/90 backdrop-blur-md"
      onclick={close}
      onkeydown={(e) => e.key === 'Escape' && close()}
      role="button"
      tabindex="0"
    ></div>

    <!-- Modal Box -->
    <div class="relative bg-[#0A0A0A] border border-white/10 rounded-sm w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col transition-lux text-white">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/5 bg-black">
        <div class="flex items-center gap-3">
          {#if step !== 'method' && step !== 'success'}
            <button onclick={handleBack} class="p-1 text-zinc-500 hover:text-white transition-lux" aria-label="Back">
              <ArrowLeft class="w-5 h-5" />
            </button>
          {/if}
          <h2 class="text-lg font-serif tracking-wide uppercase text-white">
            {#if step === 'method'}Select Payment Method{/if}
            {#if step === 'address'}Shipping Details{/if}
            {#if step === 'zelle'}Zelle Transfer Instructions{/if}
            {#if step === 'success'}Order Confirmed{/if}
          </h2>
        </div>
        <button onclick={close} class="p-1 text-zinc-500 hover:text-white transition-lux" aria-label="Close">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 flex-1 space-y-6">
        {#if step === 'method'}
          <!-- Step 1: Payment Method -->
          <p class="text-xs text-zinc-400">Choose how you would like to pay for your safety gear:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Stripe option -->
            <button
              onclick={() => paymentMethod = 'stripe'}
              class="flex flex-col items-center justify-center p-6 border rounded transition-lux text-center gap-3
                {paymentMethod === 'stripe' ? 'bg-primary/5 border-primary text-white' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'}"
            >
              <CreditCard class="w-8 h-8 {paymentMethod === 'stripe' ? 'text-primary' : 'text-zinc-500'}" />
              <div class="space-y-1">
                <span class="text-xs font-bold uppercase tracking-wider block">Credit & Debit Cards</span>
                <span class="text-[10px] text-zinc-500 block">Instant processing via Stripe</span>
              </div>
            </button>

            <!-- Zelle option -->
            <button
              onclick={() => paymentMethod = 'zelle'}
              class="flex flex-col items-center justify-center p-6 border rounded transition-lux text-center gap-3
                {paymentMethod === 'zelle' ? 'bg-primary/5 border-primary text-white' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'}"
            >
              <Send class="w-8 h-8 {paymentMethod === 'zelle' ? 'text-primary' : 'text-zinc-500'}" />
              <div class="space-y-1">
                <span class="text-xs font-bold uppercase tracking-wider block">Zelle Bank Transfer</span>
                <span class="text-[10px] text-zinc-500 block">Manual bank transfer (No Card Needed)</span>
              </div>
            </button>
          </div>

          <div class="border-t border-white/5 pt-6 flex justify-between items-center bg-black/20 p-4 rounded">
            <div class="text-left">
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest block">Total due</span>
              <span class="text-xl font-serif text-primary font-bold">${$cartTotal.toFixed(2)}</span>
            </div>
            <button onclick={handleMethodNext} class="btn-primary py-3 px-6 text-xs tracking-wider">
              CONTINUE TO SHIPPING
            </button>
          </div>

        {:else if step === 'address'}
          <!-- Step 2: Shipping Form -->
          <form onsubmit={handleAddressSubmit} class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1 text-left">
                <label for="first-name" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">First Name *</label>
                <input id="first-name" type="text" required bind:value={firstName} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
              <div class="space-y-1 text-left">
                <label for="last-name" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Last Name *</label>
                <input id="last-name" type="text" required bind:value={lastName} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1 text-left">
                <label for="email" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Email Address *</label>
                <input id="email" type="email" required bind:value={email} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
              <div class="space-y-1 text-left">
                <label for="phone" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Phone Number</label>
                <input id="phone" type="tel" bind:value={phone} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div class="space-y-1 text-left">
              <label for="address-line1" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Address Line 1 *</label>
              <input id="address-line1" type="text" required bind:value={addressLine1} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
            </div>

            <div class="space-y-1 text-left">
              <label for="address-line2" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Address Line 2 (Optional)</label>
              <input id="address-line2" type="text" bind:value={addressLine2} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="col-span-2 space-y-1 text-left">
                <label for="city" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">City *</label>
                <input id="city" type="text" required bind:value={city} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
              <div class="space-y-1 text-left">
                <label for="state" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">State *</label>
                <input id="state" type="text" required bind:value={state} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
              <div class="space-y-1 text-left">
                <label for="zip" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Zip Code *</label>
                <input id="zip" type="text" required bind:value={zip} class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div class="border-t border-white/5 pt-6 flex justify-between items-center bg-black/20 p-4 rounded">
              <div class="text-left">
                <span class="text-[10px] text-zinc-500 uppercase tracking-widest block">Total due</span>
                <span class="text-xl font-serif text-primary font-bold">${$cartTotal.toFixed(2)}</span>
              </div>
              <button type="submit" disabled={loading} class="btn-primary py-3 px-8 text-xs tracking-wider flex items-center gap-2">
                {#if loading}
                  <span class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  PROCESSING...
                {:else if paymentMethod === 'stripe'}
                  PROCEED TO CARD PAYMENT
                {:else}
                  PROCEED TO ZELLE DETAILS
                {/if}
              </button>
            </div>
          </form>

        {:else if step === 'zelle'}
          <!-- Step 3: Zelle Payment Details -->
          <div class="space-y-6 text-left">
            <p class="text-xs text-zinc-400 leading-relaxed">
              Please send your transfer using the details below. Once sent, click the place order button to complete checkout. We will process your order as soon as we verify the funds.
            </p>

            <div class="bg-black border border-white/5 rounded p-6 space-y-4 font-mono text-sm">
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-zinc-500">Zelle Account Name:</span>
                <span class="text-white font-bold">Protection Valley</span>
              </div>
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-zinc-500">Zelle Phone (Preferred):</span>
                <span class="text-primary font-bold">+1 469 955 3584</span>
              </div>
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-zinc-500">Zelle Email:</span>
                <span class="text-primary font-bold">azeem@protectionvalley.com</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-500">Exact Amount:</span>
                <span class="text-emerald-400 font-bold">${$cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div class="bg-primary/5 border border-primary/20 p-4 rounded text-xs text-zinc-300 space-y-1">
              <p class="font-bold text-primary uppercase tracking-wider mb-1">⚠️ Important Memo Note</p>
              <p>Please include your full name (<strong>{firstName} {lastName}</strong>) or email address in the Zelle transaction memo/notes so we can link your transfer to this order.</p>
            </div>

            <div class="border-t border-white/5 pt-6 flex justify-end">
              <button onclick={placeZelleOrder} disabled={loading} class="btn-primary py-3 px-8 text-xs tracking-wider flex items-center gap-2">
                {#if loading}
                  <span class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  SUBMITTING ORDER...
                {:else}
                  <CheckCircle2 class="w-4 h-4" />
                  I HAVE SENT PAYMENT — PLACE ORDER
                {/if}
              </button>
            </div>
          </div>

        {:else if step === 'success'}
          <!-- Step 4: Success confirmation screen -->
          <div class="text-center py-8 space-y-6">
            <div class="inline-flex p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 class="w-12 h-12" />
            </div>

            <div class="space-y-2">
              <h3 class="text-2xl font-serif text-white">Order Submitted!</h3>
              <p class="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Your order <span class="font-mono font-bold text-white uppercase tracking-wide">{createdOrder?.id}</span> has been received. 
                It is currently marked as <span class="font-bold text-primary uppercase tracking-wider">Pending Payment</span>.
              </p>
            </div>

            <div class="bg-black/60 border border-white/5 p-5 rounded max-w-md mx-auto text-left space-y-3 text-xs leading-relaxed text-zinc-400">
              <p><strong>Next Steps:</strong></p>
              <ul class="list-disc pl-4 space-y-1">
                <li>Make sure to send <strong>${createdOrder?.total.toFixed(2)}</strong> via Zelle to <strong>+1 469 955 3584</strong> (or <strong>azeem@protectionvalley.com</strong>) if you haven't already.</li>
                <li>An automated order invoice email has been sent to <strong>{createdOrder?.customer_email}</strong>.</li>
                <li>Your items will ship immediately once we confirm receipt of payment.</li>
              </ul>
            </div>

            <button onclick={close} class="w-full max-w-xs btn-primary py-3.5 text-xs tracking-wider font-semibold">
              CONTINUE SHOPPING
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
