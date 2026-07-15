<script lang="ts">
  import { X, CreditCard, Send, CheckCircle2, ArrowLeft } from 'lucide-svelte';
  import { cart, cartTotal, checkoutOpen, showToast, currentUser } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';
  import { env } from '$env/dynamic/public';

  let step = $state<'address' | 'review' | 'success'>('address');

  // Shipping Address Form State
  let firstName = $state('');
  let lastName = $state('');
  let email = $state($currentUser?.email || '');
  let phone = $state('');
  let addressLine1 = $state('');
  let addressLine2 = $state('');
  let city = $state('');
  let shippingState = $state('');
  let zip = $state('');
  let country = $state('US');

  // Calculated Totals State
  let subtotal = $state(0);
  let shippingCost = $state(0);
  let salesTax = $state(0);
  let total = $state(0);

  let loading = $state(false);
  let createdOrder = $state(null) as any;

  // Stripe Payment Element State
  let stripe = $state<any>(null);
  let elements = $state<any>(null);
  let paymentElement = $state<any>(null);
  let stripeError = $state<string | null>(null);
  let mountContainer = $state<HTMLDivElement | null>(null);
  let clientSecret = $state('');
  let paymentIntentId = $state('');

  function close() {
    checkoutOpen.set(false);
    step = 'address';
    createdOrder = null;
    if (paymentElement) {
      paymentElement.unmount();
      paymentElement = null;
    }
    stripe = null;
    elements = null;
  }

  function handleBack() {
    if (step === 'review') {
      step = 'address';
      if (paymentElement) {
        paymentElement.unmount();
        paymentElement = null;
      }
      stripe = null;
      elements = null;
    }
  }

  async function initStripe(secret: string) {
    if (typeof window === 'undefined' || !(window as any).Stripe) {
      showToast('Stripe payment system failed to load.');
      return;
    }

    const key = env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PVA3L2Kwtw5Hn3K2b86fa6';
    stripe = (window as any).Stripe(key);

    const appearance = {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#FF8800',
        colorBackground: '#050505',
        colorText: '#ffffff',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '2px',
      },
    };

    elements = stripe.elements({ clientSecret: secret, appearance });
    paymentElement = elements.create('payment');
    
    setTimeout(() => {
      if (mountContainer) {
        paymentElement.mount(mountContainer);
      }
    }, 50);
  }

  async function startStripeCheckout() {
    loading = true;
    stripeError = null;
    try {
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
          success_url: '', // kept for compatibility
          cancel_url: '',
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            address_line1: addressLine1,
            address_line2: addressLine2 || null,
            city,
            state: shippingState,
            zip,
            country,
            phone: phone || null
          },
          shipping_cost: shippingCost,
          sales_tax: salesTax
        })
      });

      if (res.ok) {
        const payload = await res.json();
        clientSecret = payload.clientSecret;
        paymentIntentId = payload.paymentIntentId;
        await initStripe(clientSecret);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to initialize payment.');
      }
    } catch (e) {
      console.error(e);
      showToast('Error connecting to Stripe service.');
    } finally {
      loading = false;
    }
  }

  async function calculateShippingAndTax() {
    loading = true;
    try {
      showToast('Calculating live shipping rates and tax...');
      const res = await fetch(API_CONFIG.baseUrl + '/checkout/calculate', {
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
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            address_line1: addressLine1,
            address_line2: addressLine2 || null,
            city,
            state: shippingState,
            zip,
            country,
            phone: phone || null
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        subtotal = data.subtotal;
        shippingCost = data.shipping_cost;
        salesTax = data.sales_tax;
        total = data.total;
        step = 'review';
        await startStripeCheckout();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to calculate shipping and tax.');
      }
    } catch {
      showToast('Network error while calculating shipping.');
    } finally {
      loading = false;
    }
  }

  async function handleAddressSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !addressLine1 || !city || !shippingState || !zip) {
      showToast('Please fill in all required fields.');
      return;
    }

    await calculateShippingAndTax();
  }

  async function handlePaymentSubmit() {
    if (!stripe || !elements) {
      showToast('Stripe is not initialized yet.');
      return;
    }

    loading = true;
    stripeError = null;

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/?checkout=success&session_id=${paymentIntentId}`
        }
      });

      if (error) {
        const errMsg = error.message || 'Payment confirmation failed.';
        stripeError = errMsg;
        showToast(errMsg);
      }
    } catch (e) {
      console.error(e);
      showToast('Connection error during payment confirmation');
    } finally {
      loading = false;
    }
  }
</script>

{#if $checkoutOpen}
  <div class="fixed inset-0 z-[150] flex items-center justify-center md:p-4 animate-fade-in">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/90 backdrop-blur-md"
      onclick={close}
      onkeydown={(e) => e.key === 'Escape' && close()}
      role="button"
      tabindex="0"
    ></div>

    <!-- Modal Box -->
    <div class="relative bg-[#0A0A0A] border-0 md:border border-white/10 rounded-none md:rounded-sm w-full h-full md:h-auto md:max-w-xl md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col transition-lux text-white">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/5 bg-black">
        <div class="flex items-center gap-3">
          {#if step === 'review'}
            <button onclick={handleBack} class="p-1 text-zinc-500 hover:text-white transition-lux" aria-label="Back">
              <ArrowLeft class="w-5 h-5" />
            </button>
          {/if}
          <h2 class="text-sm font-serif tracking-widest uppercase text-white font-bold">
            {#if step === 'address'}Shipping Details{/if}
            {#if step === 'review'}Payment Details{/if}
            {#if step === 'success'}Order Confirmed{/if}
          </h2>
        </div>
        <button onclick={close} class="p-1 text-zinc-500 hover:text-white transition-lux" aria-label="Close">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 flex-1 space-y-6">
        {#if step === 'address'}
          <!-- Step 1: Shipping Form -->
          <form onsubmit={handleAddressSubmit} class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1 text-left">
                <label for="first-name" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">First Name *</label>
                <input id="first-name" type="text" required bind:value={firstName} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
              <div class="space-y-1 text-left">
                <label for="last-name" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Last Name *</label>
                <input id="last-name" type="text" required bind:value={lastName} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1 text-left">
                <label for="email" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Email Address *</label>
                <input id="email" type="email" required bind:value={email} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
              <div class="space-y-1 text-left">
                <label for="phone" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Phone Number</label>
                <input id="phone" type="tel" bind:value={phone} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
            </div>

            <div class="space-y-1 text-left">
              <label for="address-line1" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Address Line 1 *</label>
              <input id="address-line1" type="text" required bind:value={addressLine1} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
            </div>

            <div class="space-y-1 text-left">
              <label for="address-line2" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Address Line 2 (Optional)</label>
              <input id="address-line2" type="text" bind:value={addressLine2} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="col-span-2 space-y-1 text-left">
                <label for="city" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">City *</label>
                <input id="city" type="text" required bind:value={city} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
              <div class="space-y-1 text-left">
                <label for="state" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">State *</label>
                <input id="state" type="text" required bind:value={shippingState} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
              <div class="space-y-1 text-left">
                <label for="zip" class="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Zip Code *</label>
                <input id="zip" type="text" required bind:value={zip} class="w-full bg-black border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none transition-lux" />
              </div>
            </div>

            <div class="border-t border-white/5 pt-6 flex justify-between items-center bg-black/20 p-4 rounded-sm">
              <div class="text-left">
                <span class="text-[10px] text-zinc-500 uppercase tracking-widest block">Total due</span>
                <span class="text-xl font-serif text-primary font-bold">${$cartTotal.toFixed(2)}</span>
              </div>
              <button type="submit" disabled={loading} class="btn-primary py-3 px-8 text-xs tracking-wider flex items-center gap-2">
                {#if loading}
                  <span class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  CALCULATING...
                {:else}
                  CONTINUE TO REVIEW
                {/if}
              </button>
            </div>
          </form>

        {:else if step === 'review'}
          <!-- Step 2: Review Order & Pay -->
          <div class="space-y-6 text-left animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-white/10 bg-black/40 rounded-sm p-4 space-y-2">
                <h4 class="text-[10px] font-bold uppercase tracking-wider text-primary">Shipping Address</h4>
                <p class="text-xs text-zinc-300 font-sans leading-relaxed">
                  {firstName} {lastName}<br />
                  {addressLine1}{addressLine2 ? ', ' + addressLine2 : ''}<br />
                  {city}, {shippingState} {zip}<br />
                  {country}
                  {#if phone}<br />Phone: {phone}{/if}
                </p>
              </div>

              <div class="border border-white/10 bg-black/40 rounded-sm p-4 space-y-2 text-xs font-mono">
                <h4 class="font-sans text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Order Summary</h4>
                <div class="flex justify-between border-b border-white/5 pb-2">
                  <span class="text-zinc-500">Subtotal:</span>
                  <span class="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between border-b border-white/5 pb-2">
                  <span class="text-zinc-500">Shipping (EasyPost):</span>
                  <span class="text-white">{shippingCost === 0 ? 'FREE' : '$' + shippingCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between border-b border-white/5 pb-2">
                  <span class="text-zinc-500">Sales Tax:</span>
                  <span class="text-white">${salesTax.toFixed(2)}</span>
                </div>
                <div class="flex justify-between pt-1 text-sm font-bold">
                  <span class="text-zinc-400">Total:</span>
                  <span class="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Embedded Stripe Payment Element -->
            <div class="space-y-3 pt-2">
              <h4 class="text-[10px] font-bold uppercase tracking-wider text-primary">Payment Details</h4>
              {#if loading && !clientSecret}
                <div class="flex flex-col items-center justify-center py-12 space-y-3 bg-black/40 border border-white/5 rounded-sm">
                  <span class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  <span class="text-[10px] text-zinc-500 uppercase tracking-widest">Initializing secure checkout...</span>
                </div>
              {/if}
              
              <!-- Container for Stripe element -->
              <div bind:this={mountContainer} class="bg-black/80 p-4 border border-white/10 rounded-sm {clientSecret ? 'block' : 'hidden'}"></div>
              
              {#if stripeError}
                <p class="text-xs text-red-500 font-sans font-medium">{stripeError}</p>
              {/if}
            </div>

            <div class="border-t border-white/5 pt-6 flex justify-between items-center bg-black/20 p-4 rounded-sm">
              <div class="text-left">
                <span class="text-[10px] text-zinc-500 uppercase tracking-widest block">Total due</span>
                <span class="text-xl font-serif text-primary font-bold">${total.toFixed(2)}</span>
              </div>
              <button onclick={handlePaymentSubmit} disabled={loading || !stripe} class="btn-primary py-3.5 px-8 text-xs tracking-wider flex items-center gap-2">
                {#if loading}
                  <span class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  PROCESSING...
                {:else}
                  PAY & PLACE ORDER
                {/if}
              </button>
            </div>
          </div>

        {:else if step === 'success'}
          <!-- Step 3: Success confirmation screen (fallback if redirect fails) -->
          <div class="text-center py-8 space-y-6">
            <div class="inline-flex p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 class="w-12 h-12" />
            </div>

            <div class="space-y-2">
              <h3 class="text-2xl font-serif text-white">Order Submitted!</h3>
              <p class="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Your payment was processed successfully and your order is complete.
              </p>
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
