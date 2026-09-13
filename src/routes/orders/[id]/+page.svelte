<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, ExternalLink, MapPin } from 'lucide-svelte';
  import { currentUser, showToast } from '$lib/stores';
  import type { Order } from '$lib/types';

  let order = $state<Order | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  const orderId = $derived($page.params.id);

  const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string; label: string }> = {
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Pending' },
    processing: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Processing' },
    shipped: { icon: Truck, color: 'text-primary', bg: 'bg-primary/10 border-primary/20', label: 'Shipped' },
    completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Cancelled' },
  };

  function getTrackingUrl(carrier: string, tracking: string): string {
    switch (carrier.toUpperCase()) {
      case 'USPS': return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`;
      case 'UPS': return `https://www.ups.com/track?tracknum=${tracking}`;
      case 'FEDEX': return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`;
      default: return `https://www.google.com/search?q=track+${encodeURIComponent(carrier)}+${tracking}`;
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  onMount(async () => {
    if (!orderId) {
      error = 'Order ID not found';
      loading = false;
      return;
    }

    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/v1/orders/${orderId}`, { headers });
      if (res.ok) {
        order = await res.json();
      } else if (res.status === 403) {
        error = 'You are not authorized to view this order.';
      } else if (res.status === 404) {
        error = 'Order not found.';
      } else {
        error = 'Failed to load order details.';
      }
    } catch (e) {
      error = 'Connection error. Please try again.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{order ? `Order ${order.id}` : 'Order Details'} — Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-[100dvh]">
  <div class="border-b border-white/5 bg-[#0A0A0A]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <a href="/catalog" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-lux text-sm">
        <ArrowLeft class="w-4 h-4" />
        <span class="hidden sm:inline">Back to shopping</span>
      </a>
      <span class="text-[11px] text-zinc-600 uppercase tracking-wider">Order Details</span>
    </div>
  </div>

  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    {#if loading}
      <div class="text-center py-20">
        <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-sm text-zinc-500">Loading order details...</p>
      </div>
    {:else if error}
      <div class="text-center py-20">
        <div class="inline-flex p-4 bg-red-500/10 rounded-full border border-red-500/20 mb-6">
          <XCircle class="w-10 h-10 text-red-400" />
        </div>
        <h1 class="text-xl font-serif text-white mb-3">Unable to Load Order</h1>
        <p class="text-sm text-zinc-400 mb-8">{error}</p>
        <a href="/catalog" class="btn-primary inline-flex text-sm tracking-[0.15em]">BROWSE CATALOG</a>
      </div>
    {:else if order}
      {@const sc = statusConfig[order.status] || statusConfig.pending}
      <!-- Header -->
      <div class="mb-8 sm:mb-10">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <h1 class="text-2xl sm:text-3xl font-serif text-white">Order {order.id}</h1>
          <div class="inline-flex items-center gap-2 {sc.bg} border rounded-sm px-3 py-1">
            <sc.icon class="w-3.5 h-3.5 {sc.color}" />
            <span class="text-xs font-semibold {sc.color}">{sc.label}</span>
          </div>
        </div>
        <p class="text-sm text-zinc-500">Placed on {formatDate(order.created_at)}</p>
      </div>

      <!-- Tracking Section -->
      {#if order.tracking_number}
        <div class="bg-[#0A0A0A] border border-primary/30 rounded-sm p-5 sm:p-6 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p class="text-[11px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Tracking Number</p>
              <p class="text-xl sm:text-2xl font-mono text-primary font-bold tracking-wider">{order.tracking_number}</p>
              <p class="text-sm text-zinc-400 mt-1">Shipped via <span class="text-white font-medium">{order.carrier}</span></p>
            </div>
            <div class="flex gap-3">
              <a
                href={getTrackingUrl(order.carrier || '', order.tracking_number)}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-primary text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-lux"
              >
                Track Shipment
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
              {#if order.shipping_label_url}
                <a
                  href={order.shipping_label_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 border border-white/10 text-zinc-300 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm hover:border-primary/40 hover:text-white transition-lux"
                >
                  View Label
                </a>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Items -->
        <div class="lg:col-span-2">
          <div class="bg-[#0A0A0A] border border-white/10 rounded-sm">
            <div class="p-4 sm:p-5 border-b border-white/5">
              <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">Items Ordered</h2>
            </div>
            <div class="divide-y divide-white/5">
              {#each order.items as item}
                <div class="flex items-start gap-4 p-4 sm:p-5">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm text-white font-medium leading-tight">{item.product_name}</h3>
                    {#if item.sku}
                      <p class="text-[11px] text-secondary mt-1 font-mono">SKU: {item.sku}</p>
                    {/if}
                    <p class="text-xs text-zinc-500 mt-1">Qty: {item.quantity} &times; ${item.unit_price.toFixed(2)}</p>
                  </div>
                  <span class="text-sm font-serif text-white whitespace-nowrap">${item.total_price.toFixed(2)}</span>
                </div>
              {/each}
            </div>
            <!-- Totals -->
            <div class="border-t border-white/10 p-4 sm:p-5 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-zinc-500">Subtotal</span>
                <span class="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-zinc-500">Shipping</span>
                <span class="text-white">{order.shipping_cost === 0 ? 'Free' : `$${order.shipping_cost.toFixed(2)}`}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-zinc-500">Tax</span>
                <span class="text-white">${order.sales_tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between pt-3 mt-2 border-t border-white/10">
                <span class="text-sm font-semibold text-zinc-400">Total</span>
                <span class="text-lg font-serif text-primary font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Shipping Address -->
          <div class="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 sm:p-5">
            <div class="flex items-center gap-2 mb-4">
              <MapPin class="w-4 h-4 text-primary" />
              <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">Shipping Address</h3>
            </div>
            <p class="text-sm text-white leading-relaxed">
              {order.shipping_address.first_name} {order.shipping_address.last_name}<br>
              {order.shipping_address.address_line1}<br>
              {#if order.shipping_address.address_line2}
                {order.shipping_address.address_line2}<br>
              {/if}
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br>
              {order.shipping_address.country}
            </p>
          </div>

          <!-- Payment -->
          <div class="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 sm:p-5">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">Payment</h3>
            <p class="text-sm text-white">{order.payment_method}</p>
            <p class="text-xs text-zinc-500 mt-1">{order.customer_email}</p>
          </div>

          <!-- Status Timeline -->
          <div class="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 sm:p-5">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">Order Status</h3>
            <div class="space-y-4">
              {#each ['pending', 'processing', 'shipped', 'completed'] as step}
                {@const stepConfig = statusConfig[step]}
                {@const stepIndex = ['pending', 'processing', 'shipped', 'completed'].indexOf(step)}
                {@const currentIdx = ['pending', 'processing', 'shipped', 'completed'].indexOf(order.status)}
                {@const isActive = stepConfig.label === statusConfig[order.status]?.label}
                {@const isPast = currentIdx > stepIndex}
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 {isPast ? 'bg-primary/20' : isActive ? stepConfig.bg : 'bg-white/5 border border-white/10'}">
                    <stepConfig.icon class="w-3.5 h-3.5 {isPast ? 'text-primary' : isActive ? stepConfig.color : 'text-zinc-600'}" />
                  </div>
                  <span class="text-sm {isPast ? 'text-primary' : isActive ? 'text-white' : 'text-zinc-600'}">{stepConfig.label}</span>
                  {#if isActive}
                    <span class="text-[10px] text-zinc-500 uppercase tracking-wider ml-auto">Current</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
