<script lang="ts">
  import { onMount } from 'svelte';
  import { ShieldAlert, Trash2, Plus, Edit, X, Percent, DollarSign, Users, Award, ShoppingBag, Bell, Truck, ExternalLink, Clock, RefreshCw, Database } from 'lucide-svelte';
  import { currentUser, products, showToast, loadProducts } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';
  import type { Product, ProductVariant } from '$lib/types';

  interface WholesaleUser {
    id: number;
    email: string;
    name: string;
    company: string | null;
    sales_tax_id: string | null;
    wholesale_discount: number;
    is_wholesale_approved?: boolean | null;
  }

  interface CustomPrice {
    id: number;
    user_id: number;
    variant_id: number;
    custom_price: number;
  }

  interface Order {
    id: string;
    customer_id: number;
    customer_name: string;
    customer_email: string;
    items: {
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      sku?: string;
    }[];
    subtotal: number;
    shipping_cost: number;
    sales_tax: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    shipping_address: {
      first_name: string;
      last_name: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    payment_method: string;
    carrier?: string;
    tracking_number?: string;
    shipping_label_url?: string;
    shipping_label_printed: boolean;
    shipping_label_printed_at?: string;
    created_at: string;
    updated_at: string;
  }

  let activeTab = $state<'users' | 'prices' | 'orders' | 'notifications' | 'erp'>('users');
  let token = $state<string | null>(null);
  let users = $state<WholesaleUser[]>([]);
  let loadingUsers = $state(true);

  let orders = $state<Order[]>([]);
  let loadingOrders = $state(false);
  let syncingInventory = $state(false);
  let generatingLabel = $state<Record<string, boolean>>({});

  let ordersSubTab = $state<'awaiting' | 'archived'>('awaiting');

  let awaitingOrders = $derived(
    orders.filter(o => !o.shipping_label_printed && o.status !== 'cancelled')
  );

  let archivedOrders = $derived(
    orders.filter(o => {
      if (!o.shipping_label_printed) return false;
      if (!o.shipping_label_printed_at) return true;
      const printedAt = new Date(o.shipping_label_printed_at).getTime();
      return (Date.now() - printedAt) <= 14 * 24 * 60 * 60 * 1000;
    })
  );

  let editingUser = $state<WholesaleUser | null>(null);
  let editDiscountVal = $state(30);

  let selectedUser = $state<WholesaleUser | null>(null);
  let customPrices = $state<CustomPrice[]>([]);
  let loadingPrices = $state(false);

  let selectedProduct = $state<Product | null>(null);
  let selectedVariant = $state<ProductVariant | null>(null);
  let customPriceVal = $state(0);

  onMount(async () => {
    token = localStorage.getItem('authToken');
    if ($currentUser && $currentUser.role === 'admin') {
      await loadProducts();
      await fetchUsers();
      await fetchOrders();
    }
  });

  function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  let activities = $derived.by(() => {
    const list: { type: 'order' | 'user'; title: string; subtitle: string; time: string; date: Date }[] = [];
    
    for (const u of users) {
      list.push({
        type: 'user',
        title: `New customer registration: ${u.name}`,
        subtitle: `${u.email} • Role: ${u.sales_tax_id ? 'Wholesale' : 'Retail'}`,
        time: u.id ? 'Recently' : 'Recently',
        date: new Date()
      });
    }

    for (const o of orders) {
      list.push({
        type: 'order',
        title: `New order ${o.id} placed by ${o.customer_name}`,
        subtitle: `Total: $${o.total.toFixed(2)} • Items: ${o.items.length} item(s) • Status: ${o.status}`,
        time: o.created_at ? formatTimeAgo(new Date(o.created_at)) : 'Recently',
        date: o.created_at ? new Date(o.created_at) : new Date()
      });
    }

    return list;
  });

  async function fetchOrders() {
    loadingOrders = true;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        orders = await res.json();
      } else {
        showToast('Failed to load orders');
      }
    } catch (e) {
      console.error(e);
      showToast('Error fetching orders');
    } finally {
      loadingOrders = false;
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });
      if (res.ok) {
        showToast(`Order status updated to ${status}`);
        await fetchOrders();
      } else {
        showToast('Failed to update order status');
      }
    } catch (e) {
      console.error(e);
      showToast('Error updating order status');
    }
  }

  async function generateShippingLabel(orderId: string) {
    if (generatingLabel[orderId]) return;
    generatingLabel[orderId] = true;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/orders/${orderId}/shipment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showToast('Shipping label generated successfully');
        await fetchOrders();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to generate shipping label');
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating shipping label');
    } finally {
      generatingLabel[orderId] = false;
    }
  }

  async function triggerEbaySync() {
    syncingInventory = true;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/ebay/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Inventory Sync Successful! Synced ${data.synced} items.`);
        await loadProducts();
      } else {
        showToast('Failed to sync inventory with eBay');
      }
    } catch (e) {
      console.error(e);
      showToast('Error syncing with eBay');
    } finally {
      syncingInventory = false;
    }
  }

  async function fetchUsers() {
    loadingUsers = true;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/admin/wholesale-users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        users = await res.json();
      } else {
        showToast('Failed to load wholesale users');
      }
    } catch (e) {
      console.error(e);
      showToast('Error fetching wholesale users');
    } finally {
      loadingUsers = false;
    }
  }

  async function fetchCustomPrices(userId: number) {
    loadingPrices = true;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/admin/customer-prices?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        customPrices = await res.json();
      } else {
        showToast('Failed to load custom prices');
      }
    } catch (e) {
      console.error(e);
      showToast('Error fetching custom prices');
    } finally {
      loadingPrices = false;
    }
  }

  async function updateDiscount() {
    if (!editingUser) return;
    try {
      const token = localStorage.getItem('authToken');
      const decimalDiscount = editDiscountVal / 100;
      const res = await fetch(`${API_CONFIG.baseUrl}/admin/wholesale-users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wholesale_discount: decimalDiscount })
      });

      if (res.ok) {
        showToast(`Discount updated to ${editDiscountVal}% for ${editingUser.name}`);
        editingUser = null;
        await fetchUsers();
      } else {
        showToast('Failed to update discount');
      }
    } catch (e) {
      console.error(e);
      showToast('Error updating discount');
    }
  }

  async function addCustomPrice() {
    if (!selectedUser || !selectedVariant || customPriceVal <= 0) {
      showToast('Please select a variant and input a valid price');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/admin/customer-prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          variant_id: selectedVariant.id,
          custom_price: customPriceVal
        })
      });

      if (res.ok) {
        showToast('Custom price saved successfully');
        selectedProduct = null;
        selectedVariant = null;
        customPriceVal = 0;
        await fetchCustomPrices(selectedUser.id);
      } else {
        showToast('Failed to save custom price');
      }
    } catch (e) {
      console.error(e);
      showToast('Error saving custom price');
    }
  }

  async function deleteCustomPrice(price: CustomPrice) {
    if (!selectedUser) return;
    if (!confirm('Are you sure you want to remove this custom price?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_CONFIG.baseUrl}/admin/customer-prices?user_id=${selectedUser.id}&variant_id=${price.variant_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showToast('Custom price deleted');
        await fetchCustomPrices(selectedUser.id);
      } else {
        showToast('Failed to delete custom price');
      }
    } catch (e) {
      console.error(e);
      showToast('Error deleting custom price');
    }
  }

  function getVariantName(variantId: number): string {
    for (const p of $products) {
      if (p.variants) {
        const found = p.variants.find(v => v.id === variantId);
        if (found) {
          return `${p.name} - ${found.original_name}`;
        }
      }
    }
    return `Variant #${variantId}`;
  }

  function getVariantRetailPrice(variantId: number): number {
    for (const p of $products) {
      if (p.variants) {
        const found = p.variants.find(v => v.id === variantId);
        if (found) return found.price;
      }
    }
    return 0;
  }
</script>

{#if !$currentUser || $currentUser.role !== 'admin'}
  <div class="min-h-screen bg-black flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center space-y-6 border border-red-500/20 bg-red-950/10 p-8 rounded-sm">
      <ShieldAlert class="w-16 h-16 text-red-500 mx-auto opacity-80" />
      <h1 class="text-2xl font-sans font-semibold text-red-500 tracking-tight">Access Denied</h1>
      <p class="text-sm text-zinc-400">This dashboard is restricted to administrators of Protection Valley.</p>
      <a href="/" class="inline-block btn-primary px-6 py-2.5 text-xs font-bold tracking-[0.15em] rounded-sm">RETURN HOME</a>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-black text-white pt-8 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="border-b border-white/5 pb-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-sans font-semibold text-white tracking-tight">Admin</h1>
            <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">Protection Valley Dashboard</p>
          </div>
          <button
            onclick={triggerEbaySync}
            disabled={syncingInventory}
            class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-admin flex items-center gap-2 border border-white/5 hover:border-white/20 rounded-sm px-4 py-2.5 disabled:opacity-50"
          >
            <RefreshCw class="w-3.5 h-3.5 {syncingInventory ? 'animate-spin' : ''}" />
            Sync eBay
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap gap-1 border-b border-white/5 mb-6">
        <button
          onclick={() => activeTab = 'users'}
          class="px-4 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-admin flex items-center gap-2
            {activeTab === 'users' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
        >
          <Users class="w-3.5 h-3.5" /> Wholesale Customers
        </button>
        <button
          onclick={() => activeTab = 'prices'}
          class="px-4 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-admin flex items-center gap-2
            {activeTab === 'prices' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
        >
          <DollarSign class="w-3.5 h-3.5" /> Customer Prices
        </button>
        <button
          onclick={() => activeTab = 'orders'}
          class="px-4 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-admin flex items-center gap-2
            {activeTab === 'orders' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
        >
          <ShoppingBag class="w-3.5 h-3.5" /> Orders
        </button>
        <button
          onclick={() => activeTab = 'notifications'}
          class="px-4 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-admin flex items-center gap-2
            {activeTab === 'notifications' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
        >
          <Bell class="w-3.5 h-3.5" /> Activity
        </button>
        <button
          onclick={() => activeTab = 'erp'}
          class="px-4 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-admin flex items-center gap-2
            {activeTab === 'erp' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
        >
          <Database class="w-3.5 h-3.5" /> ERPNext
        </button>
      </div>

      <!-- Content Area -->
      {#if activeTab === 'users'}
        {#if loadingUsers}
          <div class="space-y-4">
            {#each Array(4) as _}
              <div class="h-16 bg-dark-surface border border-white/5 rounded-sm animate-pulse" />
            {/each}
          </div>
        {:else}
          <div class="overflow-x-auto border border-white/5 rounded-sm bg-dark-surface">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="py-3 px-5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Name</th>
                  <th class="py-3 px-5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</th>
                  <th class="py-3 px-5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Company</th>
                  <th class="py-3 px-5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-center">Discount</th>
                  <th class="py-3 px-5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                {#each users as user}
                  <tr class="hover:bg-white/[0.02] transition-admin">
                    <td class="py-3 px-5">
                      <div class="flex items-center gap-2">
                        <span class="text-[13px] font-medium text-white">{user.name}</span>
                        {#if user.is_wholesale_approved === false}
                          <span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-sm">Pending</span>
                        {/if}
                      </div>
                    </td>
                    <td class="py-3 px-5 text-[13px] text-zinc-400">{user.email}</td>
                    <td class="py-3 px-5 text-[13px] text-zinc-400">{user.company || '\u2014'}</td>
                    <td class="py-3 px-5 text-center font-mono font-semibold text-primary text-[13px]">
                      {((user.wholesale_discount ?? 0.30) * 100).toFixed(0)}%
                    </td>
                    <td class="py-3 px-5 text-right">
                      <button
                        onclick={() => {
                          editingUser = user;
                          editDiscountVal = Math.round((user.wholesale_discount ?? 0.30) * 100);
                        }}
                        class="p-1.5 border border-white/10 hover:border-primary/50 text-zinc-500 hover:text-primary transition-admin rounded-sm"
                        title="Edit discount rate"
                      >
                        <Edit class="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {:else if activeTab === 'prices'}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Left: Select customer -->
          <div class="border border-white/5 rounded-sm p-5 bg-dark-surface">
            <h3 class="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">1. Select Account</h3>
            <div class="space-y-1.5">
              {#each users as u}
                <button
                  onclick={() => {
                    selectedUser = u;
                    fetchCustomPrices(u.id);
                  }}
                  class="w-full text-left px-3 py-2.5 border rounded-sm transition-admin flex flex-col gap-0.5
                    {selectedUser?.id === u.id
                      ? 'bg-primary/5 border-primary/30 text-white'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/15'}"
                >
                  <span class="text-[12px] font-semibold tracking-wide">{u.name}</span>
                  <span class="text-[10px] text-zinc-500">{u.company || u.email}</span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Middle & Right: pricing management -->
          <div class="lg:col-span-2 space-y-6">
            {#if selectedUser}

              <!-- Add custom price -->
              <div class="border border-white/5 rounded-sm p-5 bg-dark-surface space-y-5">
                <h3 class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Add Custom Price for {selectedUser.name}</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">Product</span>
                    <select
                      bind:value={selectedProduct}
                      class="w-full bg-black border border-white/10 rounded-sm px-3 py-2.5 text-[13px] text-white focus:border-primary focus:outline-none transition-admin"
                    >
                      <option value={null}>Select a product...</option>
                      {#each $products as p}
                        <option value={p}>{p.name}</option>
                      {/each}
                    </select>
                  </div>

                  {#if selectedProduct && selectedProduct.variants}
                    <div>
                      <span class="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">Variant</span>
                      <select
                        bind:value={selectedVariant}
                        class="w-full bg-black border border-white/10 rounded-sm px-3 py-2.5 text-[13px] text-white focus:border-primary focus:outline-none transition-admin"
                      >
                        <option value={null}>Select variant...</option>
                        {#each selectedProduct.variants as v}
                          <option value={v}>{v.sku} - {v.original_name} (${v.price.toFixed(2)} retail)</option>
                        {/each}
                      </select>
                    </div>
                  {/if}
                </div>

                {#if selectedVariant}
                  <div class="flex items-end gap-4 border-t border-white/5 pt-4">
                    <div class="w-1/2">
                      <span class="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">Custom Price</span>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[13px]">$</span>
                        <input
                          type="number"
                          step="0.01"
                          bind:value={customPriceVal}
                          class="w-full bg-black border border-white/10 rounded-sm pl-6 pr-3 py-2.5 text-[13px] text-white font-mono focus:border-primary focus:outline-none transition-admin"
                        />
                      </div>
                    </div>
                    <button
                      onclick={addCustomPrice}
                      class="btn-primary py-2.5 px-5 text-[10px] font-bold tracking-widest flex items-center gap-1.5 rounded-sm"
                    >
                      <Plus class="w-3.5 h-3.5" /> SAVE PRICE
                    </button>
                  </div>
                {/if}
              </div>

              <!-- Current custom prices -->
              <div class="border border-white/5 rounded-sm p-5 bg-dark-surface">
                <h3 class="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Current Custom Prices</h3>

                {#if loadingPrices}
                  <div class="space-y-3">
                    {#each Array(3) as _}
                      <div class="h-12 bg-black/40 rounded-sm animate-pulse" />
                    {/each}
                  </div>
                {:else if customPrices.length === 0}
                  <div class="border border-dashed border-white/5 rounded-sm py-8 text-center">
                    <p class="text-xs text-zinc-500">No custom prices configured for this account.</p>
                    <p class="text-[10px] text-zinc-600 mt-1">The base wholesale discount will be applied to all variants.</p>
                  </div>
                {:else}
                  <div class="divide-y divide-white/5">
                    {#each customPrices as price}
                      <div class="flex justify-between items-center py-3 transition-admin hover:bg-white/[0.01] px-2 -mx-2 rounded-sm">
                        <div class="space-y-0.5">
                          <p class="text-[13px] font-medium text-white">{getVariantName(price.variant_id)}</p>
                          <p class="text-[11px] text-zinc-500">Retail: ${getVariantRetailPrice(price.variant_id).toFixed(2)}</p>
                        </div>
                        <div class="flex items-center gap-4">
                          <span class="text-sm font-mono font-semibold text-emerald-400">${price.custom_price.toFixed(2)}</span>
                          <button
                            onclick={() => deleteCustomPrice(price)}
                            class="text-zinc-600 hover:text-red-500 transition-admin p-1 rounded-sm"
                            title="Delete custom price"
                          >
                            <Trash2 class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>

            {:else}
              <div class="border border-dashed border-white/5 rounded-sm py-16 text-center">
                <DollarSign class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p class="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Select a customer to configure prices</p>
                <p class="text-[10px] text-zinc-600 mt-1">Choose an account from the left panel to add or edit custom variant pricing.</p>
              </div>
            {/if}
          </div>
        </div>
      {:else if activeTab === 'orders'}
        {#if loadingOrders}
          <div class="space-y-4">
            {#each Array(3) as _}
              <div class="h-48 bg-dark-surface border border-white/5 rounded-sm animate-pulse" />
            {/each}
          </div>
        {:else}
          {@const activeList = ordersSubTab === 'awaiting' ? awaitingOrders : archivedOrders}
          <div class="space-y-5 animate-fade-in-fast">
            <!-- Sub-tab switcher -->
            <div class="flex gap-1 border-b border-white/5 pb-3">
              <button
                onclick={() => ordersSubTab = 'awaiting'}
                class="px-3 pb-3 pt-1 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition-admin
                  {ordersSubTab === 'awaiting' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
              >
                Awaiting Label &middot; {awaitingOrders.length}
              </button>
              <button
                onclick={() => ordersSubTab = 'archived'}
                class="px-3 pb-3 pt-1 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition-admin
                  {ordersSubTab === 'archived' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}"
              >
                Archived &middot; {archivedOrders.length}
              </button>
            </div>

            {#if activeList.length === 0}
              <div class="border border-dashed border-white/5 rounded-sm py-16 text-center">
                <ShoppingBag class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p class="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                  {ordersSubTab === 'awaiting' ? 'All caught up' : 'No recent archives'}
                </p>
                <p class="text-[10px] text-zinc-600 mt-1">
                  {ordersSubTab === 'awaiting'
                    ? 'Every order has a shipping label printed.'
                    : 'Archived orders older than 14 days are automatically removed.'}
                </p>
              </div>
            {:else}
              <div class="space-y-4">
                {#each activeList as order}
                  {@const orderPlacedTime = new Date(order.created_at).getTime()}
                  {@const isLate = !order.shipping_label_printed && (Date.now() - orderPlacedTime > 24 * 60 * 60 * 1000)}
                  <div
                    class="border rounded-sm bg-dark-surface transition-admin
                      {isLate ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.12)]' : 'border-white/5 hover:border-white/10'}"
                  >
                    <div class="p-5 space-y-4">
                      <!-- Order header -->
                      <div class="flex flex-wrap justify-between items-start gap-3">
                        <div>
                          <div class="flex items-center gap-3">
                            <h3 class="text-sm font-mono font-semibold text-white tracking-wide">{order.id}</h3>
                            {#if isLate}
                              <span class="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] uppercase tracking-wider font-bold">
                                Late &mdash; pending label &gt; 24h
                              </span>
                            {/if}
                          </div>
                          <p class="text-[11px] text-zinc-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-sm bg-white/5 text-zinc-400">
                            {order.status}
                          </span>
                          <select
                            value={order.status}
                            onchange={(e) => updateOrderStatus(order.id, e.currentTarget.value)}
                            class="bg-black border border-white/10 rounded-sm px-2 py-1 text-[11px] text-white focus:border-primary focus:outline-none font-semibold uppercase tracking-wider transition-admin"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <!-- Order details grid -->
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <!-- Customer & Delivery -->
                        <div class="space-y-1.5">
                          <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Customer</h4>
                          <p class="text-[13px] text-white font-medium">{order.customer_name}</p>
                          <p class="text-[12px] text-zinc-400">{order.customer_email || '\u2014'}</p>
                          <p class="text-[12px] text-zinc-500">Payment: <span class="text-primary font-semibold">{order.payment_method}</span></p>
                        </div>

                        <!-- Shipping Address -->
                        <div class="space-y-1.5">
                          <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Shipping</h4>
                          <p class="text-[12px] text-zinc-300 leading-relaxed">
                            {order.shipping_address.address_line1}<br />
                            {#if order.shipping_address.address_line2}
                              {order.shipping_address.address_line2}<br />
                            {/if}
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                            {order.shipping_address.country}
                          </p>
                        </div>

                        <!-- Summary & Shipping -->
                        <div class="space-y-1.5">
                          <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Summary</h4>
                          <div class="text-[12px] space-y-0.5 font-mono">
                            <div class="flex justify-between">
                              <span class="text-zinc-500">Subtotal:</span>
                              <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                              <span class="text-zinc-500">Shipping:</span>
                              <span>${order.shipping_cost.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                              <span class="text-zinc-500">Tax:</span>
                              <span>${(order.sales_tax || 0.00).toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between text-white font-semibold border-t border-white/5 pt-1 mt-1">
                              <span>Total:</span>
                              <span class="text-primary">${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {#if order.shipping_label_printed}
                            <div class="border-t border-white/5 pt-3 mt-3 space-y-1.5">
                              <p class="text-[11px] text-zinc-400 flex items-center gap-1.5">
                                <Truck class="w-3.5 h-3.5 text-emerald-400" />
                                <span>{order.carrier || 'Carrier'} &middot; {order.tracking_number}</span>
                              </p>
                              {#if order.shipping_label_url}
                                <a
                                  href={order.shipping_label_url}
                                  target="_blank"
                                  class="inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-bold uppercase tracking-wider transition-admin"
                                >
                                  <ExternalLink class="w-3 h-3" /> Print Label
                                </a>
                              {/if}
                              {#if order.shipping_label_printed_at}
                                <p class="text-[9px] text-zinc-600 mt-1">
                                  Archived {new Date(order.shipping_label_printed_at).toLocaleDateString()}
                                  &middot; expires {new Date(new Date(order.shipping_label_printed_at).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </p>
                              {/if}
                            </div>
                          {:else if order.status !== 'cancelled'}
                            <div class="border-t border-white/5 pt-3 mt-3">
                              <button
                                onclick={() => generateShippingLabel(order.id)}
                                disabled={generatingLabel[order.id]}
                                class="w-full py-2.5 px-3 bg-primary/5 border border-primary/15 hover:border-primary/40 text-primary hover:text-white transition-admin text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {#if generatingLabel[order.id]}
                                  <span class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                  Generating...
                                {:else}
                                  <Truck class="w-3.5 h-3.5" />
                                  Generate Shipping Label
                                {/if}
                              </button>
                            </div>
                          {/if}
                        </div>
                      </div>

                      <!-- Items list -->
                      <div class="border-t border-white/5 pt-3">
                        <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">Items</h4>
                        <div class="divide-y divide-white/5">
                          {#each order.items as item}
                            <div class="flex justify-between py-2 text-[13px]">
                              <span class="text-zinc-300">{item.product_name} <span class="text-zinc-500 font-mono">&times;{item.quantity}</span></span>
                              <span class="font-mono text-white">${(item.total_price || (item.unit_price * item.quantity)).toFixed(2)}</span>
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      {:else if activeTab === 'notifications'}
        <div class="border border-white/5 rounded-sm bg-dark-surface animate-fade-in-fast">
          <div class="flex justify-between items-center border-b border-white/5 px-5 py-4">
            <h3 class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Activity Feed</h3>
          </div>

          {#if activities.length === 0}
            <div class="py-12 text-center">
              <Bell class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p class="text-xs text-zinc-500">No recent activity.</p>
            </div>
          {:else}
            <div class="divide-y divide-white/5">
              {#each activities as activity}
                <div class="flex gap-4 px-5 py-4 transition-admin hover:bg-white/[0.01]">
                  <div class="flex-shrink-0 mt-0.5">
                    {#if activity.type === 'order'}
                      <div class="p-1.5 bg-emerald-500/10 rounded-sm">
                        <ShoppingBag class="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    {:else}
                      <div class="p-1.5 bg-blue-500/10 rounded-sm">
                        <Users class="w-3.5 h-3.5 text-blue-400" />
                      </div>
                    {/if}
                  </div>
                  <div class="flex-grow min-w-0 space-y-0.5">
                    <p class="text-[13px] font-medium text-white truncate">{activity.title}</p>
                    <p class="text-[12px] text-zinc-400 truncate">{activity.subtitle}</p>
                  </div>
                  <div class="flex-shrink-0 text-right">
                    <span class="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock class="w-3 h-3" /> {activity.time}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {:else if activeTab === 'erp'}
        <div class="border border-white/5 rounded-sm bg-dark-surface animate-fade-in-fast flex flex-col items-center justify-center text-center px-8 py-16">
          <div class="p-4 bg-primary/5 rounded-full border border-primary/10 mb-6">
            <Database class="w-10 h-10 text-primary" />
          </div>

          <div class="max-w-sm space-y-2 mb-6">
            <h2 class="text-base font-sans font-semibold text-white tracking-tight">ERPNext</h2>
            <p class="text-[13px] text-zinc-400 leading-relaxed">
              Accounting, inventory, purchase orders, and business operations.
            </p>
          </div>

          {#if token}
            <a
              href="/api/v1/admin/erp/desk?token={token}"
              target="_blank"
              rel="noopener noreferrer"
              class="px-8 py-3 bg-primary/5 border border-primary/15 hover:border-primary/40 text-primary hover:text-white transition-admin text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-2"
            >
              <span>Launch ERPNext</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          {:else}
            <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p class="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-3">Generating SSO token...</p>
          {/if}
        </div>
      {/if}

    </div>
  </div>
{/if}

<!-- Edit Discount Modal -->
{#if editingUser}
  <div class="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
    <div class="max-w-md w-full border border-white/10 bg-dark-elevated rounded-sm p-6 relative animate-fade-in-fast">
      <button
        onclick={() => editingUser = null}
        class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-admin"
      >
        <X class="w-4 h-4" />
      </button>

      <h3 class="text-base font-sans font-semibold text-white mb-1">Adjust Wholesale Discount</h3>
      <p class="text-[13px] text-zinc-400 mb-5">
        Modify the baseline discount for <strong class="text-white">{editingUser.name}</strong>
        {#if editingUser.company}
          <span class="text-zinc-500"> ({editingUser.company})</span>
        {/if}
      </p>

      <div class="space-y-5 mb-6">
        <div>
          <div class="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            <span>Discount</span>
            <span class="font-mono text-primary">{editDiscountVal}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            bind:value={editDiscountVal}
            class="w-full accent-primary"
          />
        </div>

        <div class="bg-black/50 border border-white/5 p-4 rounded-sm text-[13px] text-zinc-400 space-y-1">
          <p><span class="text-zinc-500">Retail example:</span> $100.00</p>
          <p><span class="text-zinc-500">Wholesale price:</span> <span class="text-primary font-bold font-mono">${(100 * (1 - editDiscountVal / 100)).toFixed(2)}</span></p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          onclick={() => editingUser = null}
          class="border border-white/10 hover:bg-white/5 py-2 px-5 text-[10px] font-bold tracking-widest rounded-sm text-zinc-400 hover:text-white transition-admin"
        >
          Cancel
        </button>
        <button
          onclick={updateDiscount}
          class="btn-primary py-2 px-5 text-[10px] font-bold tracking-widest rounded-sm flex items-center gap-1.5"
        >
          <Percent class="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>
    </div>
  </div>
{/if}
