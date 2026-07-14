<script lang="ts">
  import { ArrowLeft, ShieldCheck, Lock, CheckCircle2 } from 'lucide-svelte';
  import { cart, cartTotal, showToast, currentUser } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { onMount, tick } from 'svelte';
  import OptimizedImage from '$lib/components/OptimizedImage.svelte';

  let stripe = $state<any>(null);
  let elements = $state<any>(null);
  let addressElement = $state<any>(null);
  let paymentElements = $state<any>(null);
  let paymentElement = $state<any>(null);
  let paymentContainer = $state<HTMLDivElement | null>(null);
  let addressContainer = $state<HTMLDivElement | null>(null);
  let clientSecret = $state('');
  let paymentIntentId = $state('');
  let stripeError = $state<string | null>(null);

  let step = $state<'info' | 'confirm' | 'success'>('info');
  let loading = $state(false);
  let processingPayment = $state(false);

  let email = $state('');

  let savedAddress = $state<{
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string | null;
  } | null>(null);

  let subtotal = $state(0);
  let shippingCost = $state(0);
  let salesTax = $state(0);
  let total = $state(0);
  let cartSubtotal = $derived($cartTotal);

  function getAppearance() {
    return {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#0A0A0A',
        colorText: '#FFFFFF',
        colorTextSecondary: '#A1A1AA',
        colorDanger: '#EF4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSizeBase: '14px',
        spacingUnit: '4px',
        borderRadius: '2px',
        colorIcon: '#D4AF37',
        colorIconTabSelected: '#000000',
      },
      rules: {
        '.Tab': {
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: '#0A0A0A',
        },
        '.Tab--selected': {
          backgroundColor: '#D4AF37',
          color: '#000000',
          border: '1px solid #D4AF37',
        },
        '.Tab:hover': {
          border: '1px solid rgba(212,175,55,0.4)',
        },
        '.Input': {
          backgroundColor: '#000000',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 14px',
        },
        '.Input:focus': {
          border: '1px solid #D4AF37',
          boxShadow: '0 0 0 1px #D4AF37',
        },
        '.Label': {
          fontWeight: '600',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#A1A1AA',
        },
      },
    };
  }

  onMount(() => {
    if ($cart.length === 0) {
      goto('/catalog');
      return;
    }
    email = $currentUser?.email || '';
    initStripe();
  });

  async function initStripe() {
    try {
      if (typeof window === 'undefined' || !(window as any).Stripe) {
        stripeError = 'Stripe failed to load. Please refresh the page.';
        return;
      }

      const key = env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PVA3L2Kwtw5Hn3K2b86fa6';
      stripe = (window as any).Stripe(key);

      elements = stripe.elements({ mode: 'shipping', appearance: getAppearance() });

      addressElement = elements.create('address', {
        mode: 'shipping',
        autocomplete: { mode: 'google_places_api' },
        fields: { phone: 'always' },
        validation: { phone: { required: 'always' } },
        defaultValues: {
          name: $currentUser?.name || '',
          address: { country: 'US' },
          phone: '',
        },
      });

      await tick();

      if (addressContainer) {
        addressElement.mount(addressContainer);
      }
    } catch (err: any) {
      console.error('Failed to initialize Stripe:', err);
      stripeError = `Failed to initialize payment system: ${err.message || err}`;
    }
  }

  async function handleCreatePayment() {
    if (!email.trim()) {
      showToast('Please enter your email address.');
      return;
    }

    if (!stripe || !addressElement) {
      showToast('Payment system is not fully loaded. Please refresh the page.');
      return;
    }

    loading = true;
    stripeError = null;

    try {
      const addressResult = await addressElement.getValue();
      if (!addressResult.complete) {
        showToast('Please complete your shipping address.');
        loading = false;
        return;
      }

      const addr = addressResult.value;

      savedAddress = {
        name: addr.name || '',
        line1: addr.address?.line1 || '',
        line2: addr.address?.line2 || null,
        city: addr.address?.city || '',
        state: addr.address?.state || '',
        zip: addr.address?.postal_code || '',
        country: addr.address?.country || 'US',
        phone: addr.phone || null,
      };

      const res = await fetch('/api/v1/checkout/create-session', {
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
            first_name: savedAddress.name.split(' ')[0] || '',
            last_name: savedAddress.name.split(' ').slice(1).join(' ') || '',
            address_line1: savedAddress.line1,
            address_line2: savedAddress.line2,
            city: savedAddress.city,
            state: savedAddress.state,
            zip: savedAddress.zip,
            country: savedAddress.country,
            phone: savedAddress.phone,
          },
        })
      });

      if (res.ok) {
        const payload = await res.json();
        clientSecret = payload.clientSecret;
        paymentIntentId = payload.paymentIntentId;
        subtotal = payload.subtotal;
        shippingCost = payload.shippingCost;
        salesTax = payload.salesTax;
        total = payload.total;

        step = 'confirm';
        await tick();
        await mountPaymentElement();
      } else {
        let errBody;
        try { errBody = await res.json(); } catch { errBody = {}; }
        stripeError = errBody.error || `Server error (${res.status}). Please try again.`;
        showToast(stripeError!);
      }
    } catch (e) {
      console.error('Checkout error:', e);
      stripeError = 'Unable to connect to the server. Check your connection and try again.';
      showToast(stripeError!);
    } finally {
      loading = false;
    }
  }

  async function mountPaymentElement() {
    if (!stripe || !clientSecret || !paymentContainer) return;

    paymentElements = stripe.elements({ clientSecret, appearance: getAppearance() });
    paymentElement = paymentElements.create('payment', {
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: false,
        spacedAccordionItems: true,
      },
      wallets: {
        applePay: 'auto',
        googlePay: 'auto',
      },
    });

    await tick();
    paymentElement.mount(paymentContainer);
  }

  async function handleConfirmPayment() {
    if (!stripe || !paymentElements || !paymentElement) {
      showToast('Payment system not ready. Please wait a moment.');
      return;
    }

    processingPayment = true;
    stripeError = null;

    try {
      const { error } = await stripe.confirmPayment({
        elements: paymentElements,
        confirmParams: {
          return_url: `${window.location.origin}/?checkout=success&session_id=${paymentIntentId}`,
          receipt_email: email,
        },
      });

      if (error) {
        stripeError = error.message || 'Payment failed. Please try a different method.';
        showToast(stripeError!);
      }
    } catch (e) {
      console.error('Payment error:', e);
      stripeError = 'Connection lost during payment. Your card was not charged.';
      showToast(stripeError!);
    } finally {
      processingPayment = false;
    }
  }
</script>

<svelte:head>
  <title>Checkout — Protection Valley</title>
  <meta name="description" content="Secure checkout for Protection Valley premium workgear." />
</svelte:head>

<div class="bg-black min-h-[100dvh]">
  <!-- Top Bar -->
  <div class="border-b border-white/5 bg-[#0A0A0A]">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <a href="/catalog" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-lux text-sm">
        <ArrowLeft class="w-4 h-4" />
        <span class="hidden sm:inline">Back to shopping</span>
      </a>
      <div class="flex items-center gap-2 text-zinc-500 text-xs">
        <Lock class="w-3.5 h-3.5" />
        <span>Secure checkout</span>
      </div>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
    <!-- Step Indicator -->
    <div class="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-14">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold {step === 'info' ? 'bg-primary text-black' : 'bg-primary/20 text-primary'}">1</div>
        <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider {step === 'info' ? 'text-white' : 'text-zinc-500'}">Details</span>
      </div>
      <div class="w-6 sm:w-8 h-px {step === 'confirm' || step === 'success' ? 'bg-primary' : 'bg-white/10'}"></div>
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold {step === 'confirm' ? 'bg-primary text-black' : step === 'success' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-zinc-600'}">2</div>
        <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider {step === 'confirm' ? 'text-white' : 'text-zinc-500'}">Pay</span>
      </div>
      <div class="w-6 sm:w-8 h-px {step === 'success' ? 'bg-primary' : 'bg-white/10'}"></div>
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold {step === 'success' ? 'bg-primary text-black' : 'bg-white/10 text-zinc-600'}">3</div>
        <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider {step === 'success' ? 'text-white' : 'text-zinc-500'}">Done</span>
      </div>
    </div>

    {#if step === 'success'}
      <!-- Success State -->
      <div class="max-w-lg mx-auto text-center py-12 sm:py-16 animate-fade-in">
        <div class="inline-flex p-5 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8">
          <CheckCircle2 class="w-14 h-14 text-emerald-400" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-serif text-white mb-4">Order Confirmed</h1>
        <p class="text-sm text-zinc-400 leading-relaxed mb-10 max-w-sm mx-auto">
          Your payment was processed. You'll receive a confirmation email with tracking information shortly.
        </p>
        <a href="/catalog" class="btn-primary inline-flex text-sm tracking-[0.15em]">
          CONTINUE SHOPPING
        </a>
      </div>
    {:else}
      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">

        <!-- LEFT: Form Column -->
        <div class="lg:col-span-7 order-2 lg:order-1 space-y-6 sm:space-y-8">

          {#if step === 'info'}
            <!-- Contact -->
            <section>
              <h2 class="text-base sm:text-lg font-serif text-white mb-4 sm:mb-5">Contact</h2>
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label for="checkout-email" class="text-[11px] text-zinc-500 uppercase tracking-wider block font-semibold">Email address</label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    bind:value={email}
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:outline-none transition-lux"
                  />
                </div>
              </div>
            </section>

            <!-- Shipping Address (Stripe Address Element) -->
            <section>
              <h2 class="text-base sm:text-lg font-serif text-white mb-4 sm:mb-5">Shipping address</h2>
              <div
                bind:this={addressContainer}
                class="stripe-element-container"
              ></div>
            </section>

            {#if stripeError}
              <div class="bg-red-500/10 border border-red-500/20 rounded-sm p-4">
                <p class="text-sm text-red-400">{stripeError}</p>
              </div>
            {/if}

            <button
              onclick={handleCreatePayment}
              disabled={loading}
              class="btn-primary w-full py-4 text-sm tracking-[0.15em] gap-2"
            >
              {#if loading}
                <span class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                PROCESSING...
              {:else}
                CONTINUE TO PAYMENT
              {/if}
            </button>

          {:else if step === 'confirm'}
            <!-- Payment Step -->
            <section class="animate-fade-in">
              <div class="flex items-center justify-between mb-5">
                <h2 class="text-base sm:text-lg font-serif text-white">Payment</h2>
                <button onclick={() => { step = 'info'; }} class="text-xs text-zinc-500 hover:text-primary transition-lux flex items-center gap-1.5">
                  <ArrowLeft class="w-3.5 h-3.5" />
                  Edit details
                </button>
              </div>

              <!-- Stripe Payment Element -->
              <div
                bind:this={paymentContainer}
                class="stripe-element-container mb-6"
              ></div>

              {#if stripeError}
                <div class="bg-red-500/10 border border-red-500/20 rounded-sm p-4 mb-6">
                  <p class="text-sm text-red-400">{stripeError}</p>
                </div>
              {/if}

              <!-- Zelle Option -->
              <div class="border border-white/10 bg-[#0A0A0A] rounded-sm p-4 sm:p-5 mb-6">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-primary/15 rounded-sm flex items-center justify-center flex-shrink-0">
                    <span class="text-primary font-bold text-sm">Z</span>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-white mb-1">Pay with Zelle</h4>
                    <p class="text-xs text-zinc-500 leading-relaxed">
                      Send payment to <span class="text-zinc-300 font-medium select-all">pay@protectionvalley.com</span> and include your order email in the memo. We'll confirm and ship within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onclick={handleConfirmPayment}
                disabled={processingPayment}
                class="btn-primary w-full py-4 text-sm tracking-[0.15em] gap-2"
              >
                {#if processingPayment}
                  <span class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  PROCESSING...
                {:else}
                  PAY ${total.toFixed(2)}
                {/if}
              </button>

              <div class="flex items-center justify-center gap-4 mt-5 text-[10px] text-zinc-600 uppercase tracking-wider">
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>SSL encrypted</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Lock class="w-3.5 h-3.5" />
                  <span>PCI compliant</span>
                </div>
              </div>
            </section>
          {/if}
        </div>

        <!-- RIGHT: Order Summary -->
        <div class="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
          <div class="bg-[#0A0A0A] border border-white/10 rounded-sm overflow-hidden">
            <div class="p-4 sm:p-5 border-b border-white/5">
              <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">Order summary</h2>
            </div>

            <!-- Cart Items -->
            <div class="divide-y divide-white/5 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto">
              {#each $cart as item}
                <div class="flex gap-3 sm:gap-4 p-4 sm:p-5">
                  <div class="w-14 h-14 sm:w-16 sm:h-16 bg-black border border-white/5 rounded-sm flex-shrink-0 overflow-hidden relative">
                    <OptimizedImage
                      src={item.image || '/images/logo.png'}
                      alt={item.name}
                      class="w-full h-full object-contain"
                      width={80}
                      height={80}
                    />
                    {#if item.quantity > 1}
                      <span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    {/if}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm text-white leading-tight truncate">{item.name}</h3>
                    {#if item.size || item.color || item.texture}
                      <p class="text-[11px] text-zinc-500 mt-1">{[item.size, item.color, item.texture].filter(Boolean).join(' · ')}</p>
                    {/if}
                  </div>
                  <span class="text-sm font-serif text-white whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              {/each}
            </div>

            <!-- Totals -->
            <div class="border-t border-white/10 p-4 sm:p-5 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-zinc-500">Subtotal</span>
                <span class="text-white">{(step === 'confirm' ? subtotal : cartSubtotal).toFixed(2)}</span>
              </div>
              {#if step === 'confirm'}
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">Shipping</span>
                  <span class="text-white">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">Tax</span>
                  <span class="text-white">${salesTax.toFixed(2)}</span>
                </div>
              {:else}
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">Shipping</span>
                  <span class="text-zinc-500 text-xs">Calculated next</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">Tax</span>
                  <span class="text-zinc-500 text-xs">Calculated next</span>
                </div>
              {/if}
              <div class="pt-3 border-t border-white/10 flex justify-between items-center">
                <span class="text-sm font-semibold text-zinc-400">Total</span>
                <span class="text-lg sm:text-xl font-serif text-primary font-bold">${(step === 'confirm' ? total : cartSubtotal).toFixed(2)}</span>
              </div>
            </div>


          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .stripe-element-container {
    min-height: 60px;
  }

  .stripe-element-container :global(.StripeElement) {
    padding: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in {
      animation: none !important;
      opacity: 1 !important;
    }
  }
</style>
