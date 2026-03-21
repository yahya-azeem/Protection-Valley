<script lang="ts">
  import { onMount } from 'svelte'
  import { cart, cartTotal, cartWholesaleTotal } from '../stores/cart'
  import { isAuthenticated, isWholesale, auth } from '../stores/auth'
  import { navigate } from '../lib/router'
  import { loadStripe } from '@stripe/stripe-js'
  import { CreditCard, Truck, Package, Check, Lock } from 'lucide-svelte'

  // Redirect if cart is empty
  onMount(() => {
    if ($cart.length === 0) {
      navigate('/cart')
    }
  })

  let step: 'shipping' | 'payment' | 'confirmation' = 'shipping'
  let loading = false
  let orderComplete = false

  // Shipping form
  let shippingData = {
    firstName: $auth?.name.split(' ')[0] || '',
    lastName: $auth?.name.split(' ')[1] || '',
    email: $auth?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  }

  // Payment form (mock)
  let paymentData = {
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  }

  $: total = $isWholesale ? $cartWholesaleTotal : $cartTotal
  $: shippingCost = total >= 100 ? 0 : 15
  $: finalTotal = total + shippingCost

  function handleShippingSubmit() {
    step = 'payment'
    window.scrollTo(0, 0)
  }

  async function handlePaymentSubmit() {
    loading = true
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart and show confirmation
    cart.clear()
    orderComplete = true
    step = 'confirmation'
    loading = false
    window.scrollTo(0, 0)
  }

  function formatCardNumber(value: string) {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }
</script>

<svelte:head>
  <title>Checkout - ToolPro Supply</title>
  <meta name="description" content="Complete your purchase securely." />
</svelte:head>

<div class="min-h-screen bg-background">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if orderComplete}
      <!-- Order Confirmation -->
      <div class="max-w-2xl mx-auto text-center py-16">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-10 h-10 text-green-600" />
        </div>
        <h1 class="text-4xl font-serif mb-4">Order Confirmed!</h1>
        <p class="text-gray-600 mb-8">
          Thank you for your purchase. We've sent a confirmation email to {shippingData.email}.
          Your order will be processed and shipped within 1-2 business days.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            class="btn-primary"
            on:click={() => navigate('/products')}
          >
            Continue Shopping
          </button>
          {#if $isAuthenticated}
            <button 
              class="btn-secondary"
              on:click={() => navigate('/admin/orders')}
            >
              View Orders
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Progress Steps -->
          <div class="flex items-center mb-8">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                <Truck class="w-5 h-5" />
              </div>
              <span class="ml-2 font-medium">Shipping</span>
            </div>
            <div class="flex-1 h-px bg-gray-200 mx-4" />
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full {step === 'payment' || step === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center">
                <CreditCard class="w-5 h-5" />
              </div>
              <span class="ml-2 font-medium {step === 'payment' || step === 'confirmation' ? '' : 'text-gray-500'}">Payment</span>
            </div>
            <div class="flex-1 h-px bg-gray-200 mx-4" />
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full {step === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center">
                <Package class="w-5 h-5" />
              </div>
              <span class="ml-2 font-medium {step === 'confirmation' ? '' : 'text-gray-500'}">Confirmation</span>
            </div>
          </div>

          {#if step === 'shipping'}
            <!-- Shipping Form -->
            <div class="bg-white rounded-lg p-8">
              <h2 class="text-2xl font-serif mb-6">Shipping Information</h2>
              
              <form on:submit|preventDefault={handleShippingSubmit} class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium mb-2">First Name *</label>
                    <input 
                      type="text"
                      bind:value={shippingData.firstName}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">Last Name *</label>
                    <input 
                      type="text"
                      bind:value={shippingData.lastName}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium mb-2">Email *</label>
                    <input 
                      type="email"
                      bind:value={shippingData.email}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">Phone *</label>
                    <input 
                      type="tel"
                      bind:value={shippingData.phone}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Address *</label>
                  <input 
                    type="text"
                    bind:value={shippingData.address}
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium mb-2">City *</label>
                    <input 
                      type="text"
                      bind:value={shippingData.city}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">State *</label>
                    <input 
                      type="text"
                      bind:value={shippingData.state}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">ZIP *</label>
                    <input 
                      type="text"
                      bind:value={shippingData.zip}
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button type="submit" class="w-full btn-primary py-4">
                  Continue to Payment
                </button>
              </form>
            </div>
          {:else if step === 'payment'}
            <!-- Payment Form (Mock) -->
            <div class="bg-white rounded-lg p-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-serif">Payment Information</h2>
                <div class="flex items-center text-green-600">
                  <Lock class="w-4 h-4 mr-1" />
                  <span class="text-sm">Secure</span>
                </div>
              </div>

              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p class="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> This is a demonstration checkout. No real payment will be processed.
                  Use any test card number like 4242 4242 4242 4242.
                </p>
              </div>
              
              <form on:submit|preventDefault={handlePaymentSubmit} class="space-y-6">
                <div>
                  <label class="block text-sm font-medium mb-2">Card Number *</label>
                  <div class="relative">
                    <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      bind:value={paymentData.cardNumber}
                      on:input={(e) => paymentData.cardNumber = formatCardNumber(e.currentTarget.value)}
                      placeholder="4242 4242 4242 4242"
                      maxlength="19"
                      required
                      class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Cardholder Name *</label>
                  <input 
                    type="text"
                    bind:value={paymentData.name}
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium mb-2">Expiry Date *</label>
                    <input 
                      type="text"
                      bind:value={paymentData.expiry}
                      placeholder="MM/YY"
                      maxlength="5"
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">CVC *</label>
                    <input 
                      type="text"
                      bind:value={paymentData.cvc}
                      placeholder="123"
                      maxlength="4"
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div class="flex gap-4">
                  <button 
                    type="button" 
                    class="flex-1 btn-secondary"
                    on:click={() => step = 'shipping'}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    class="flex-1 btn-primary py-4"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          {/if}
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg p-6 sticky top-24">
            <h2 class="text-xl font-serif mb-6">Order Summary</h2>

            <!-- Items -->
            <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {#each $cart as item}
                <div class="flex gap-4">
                  <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p class="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p class="text-sm text-primary">
                      ${$isWholesale 
                        ? (item.wholesalePrice * item.quantity).toFixed(2) 
                        : (item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              {/each}
            </div>

            <div class="border-t border-gray-200 pt-4 space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {#if $isWholesale}
                <div class="flex justify-between text-green-600">
                  <span>Wholesale Savings</span>
                  <span>-${($cartTotal - $cartWholesaleTotal).toFixed(2)}</span>
                </div>
              {/if}
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-lg">Total</span>
                  <span class="text-2xl font-serif text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
