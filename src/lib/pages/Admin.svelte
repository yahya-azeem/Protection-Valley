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

  // Orders State
  let orders = $state<Order[]>([]);
  let loadingOrders = $state(false);
  let syncingInventory = $state(false);
  let generatingLabel = $state<Record<string, boolean>>({});

  // Sub-tabs for Orders
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

  // Edit Discount State
  let editingUser = $state<WholesaleUser | null>(null);
  let editDiscountVal = $state(30);

  // Custom Pricing State
  let selectedUser = $state<WholesaleUser | null>(null);
  let customPrices = $state<CustomPrice[]>([]);
  let loadingPrices = $state(false);

  // Add Custom Price State
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
    
    // Add user registrations
    for (const u of users) {
      list.push({
        type: 'user',
        title: `New customer registration: ${u.name}`,
        subtitle: `${u.email} • Role: ${u.sales_tax_id ? 'Wholesale' : 'Retail'}`,
        time: u.id ? 'Recently' : 'Recently', // Placeholder helper
        date: new Date() // Normally parsed from created_at
      });
    }

    // Add orders
    for (const o of orders) {
      list.push({
        type: 'order',
        title: `New order ${o.id} placed by ${o.customer_name}`,
        subtitle: `Total: $${o.total.toFixed(2)} • Items: ${o.items.length} item(s) • Status: ${o.status}`,
        time: o.created_at ? formatTimeAgo(new Date(o.created_at)) : 'Recently',
        date: o.created_at ? new Date(o.created_at) : new Date()
      });
    }

    return list; // Sorting can be done or default order
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
  <!-- Beautiful Access Denied View -->
  <div class="min-h-screen bg-black flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center space-y-6 border border-red-500/20 bg-red-950/10 p-8 rounded shadow-2xl">
      <ShieldAlert class="w-16 h-16 text-red-500 mx-auto opacity-80" />
      <h1 class="text-3xl font-serif text-red-500">Access Denied</h1>
      <p class="text-sm text-zinc-400">This dashboard is restricted to administrators of Protection Valley.</p>
      <a href="/" class="inline-block btn-primary px-6 py-2.5 text-xs font-bold tracking-[0.15em] rounded-sm">RETURN HOME</a>
    </div>
  </div>
{:else}
  <!-- Admin Dashboard -->
  <div class="min-h-screen bg-black text-white pt-10 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="border-b border-white/5 pb-8 mb-8">
        <h1 class="text-3xl md:text-4xl font-serif tracking-tight text-white mb-2">Wholesale Pricing Control</h1>
        <p class="text-xs text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
          <Award class="w-4 h-4 text-primary" /> Protection Valley Admin Panel
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap gap-4 border-b border-white/5 mb-8">
        <button
          onclick={() => activeTab = 'users'}
          class="pb-4 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-lux flex items-center gap-2
            {activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
        >
          <Users class="w-3.5 h-3.5" /> Wholesale Customers
        </button>
        <button
          onclick={() => activeTab = 'prices'}
          class="pb-4 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-lux flex items-center gap-2
            {activeTab === 'prices' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
        >
          <DollarSign class="w-3.5 h-3.5" /> Customer Specific Prices
        </button>
        <button
          onclick={() => activeTab = 'orders'}
          class="pb-4 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-lux flex items-center gap-2
            {activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
        >
          <ShoppingBag class="w-3.5 h-3.5" /> Orders
        </button>
        <button
          onclick={() => activeTab = 'notifications'}
          class="pb-4 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-lux flex items-center gap-2
            {activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
        >
          <Bell class="w-3.5 h-3.5" /> Activity Log
        </button>
        <button
          onclick={() => activeTab = 'erp'}
          class="pb-4 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-lux flex items-center gap-2
            {activeTab === 'erp' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
        >
          <Database class="w-3.5 h-3.5" /> ERPNext
        </button>
        <button
          onclick={triggerEbaySync}
          disabled={syncingInventory}
          class="ml-auto pb-4 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 hover:text-white flex items-center gap-2 transition-lux disabled:opacity-50"
        >
          <RefreshCw class="w-3.5 h-3.5 {syncingInventory ? 'animate-spin' : ''}" /> Sync eBay Listings
        </button>
      </div>

      <!-- Content Area -->
      {#if activeTab === 'users'}
        <!-- Users Tab -->
        {#if loadingUsers}
          <div class="py-20 text-center text-zinc-500 text-xs uppercase tracking-widest font-bold">
            Loading wholesale accounts...
          </div>
        {:else}
          <div class="overflow-x-auto border border-white/5 rounded bg-[#0A0A0A]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/10 bg-white/2">
                  <th class="py-4 px-6 text-xs uppercase tracking-widest text-zinc-400 font-bold">Name</th>
                  <th class="py-4 px-6 text-xs uppercase tracking-widest text-zinc-400 font-bold">Email</th>
                  <th class="py-4 px-6 text-xs uppercase tracking-widest text-zinc-400 font-bold">Company</th>
                  <th class="py-4 px-6 text-xs uppercase tracking-widest text-zinc-400 font-bold text-center">Base Discount</th>
                  <th class="py-4 px-6 text-xs uppercase tracking-widest text-zinc-400 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                {#each users as user}
                  <tr class="hover:bg-white/1 transition-lux">
                    <td class="py-4 px-6 font-medium">
                      <div class="flex items-center gap-2">
                        <span>{user.name}</span>
                        {#if user.is_wholesale_approved === false}
                          <span class="px-2 py-0.5 text-[9px] font-sans font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-sm">Pending</span>
                        {/if}
                      </div>
                    </td>
                    <td class="py-4 px-6 text-zinc-400">{user.email}</td>
                    <td class="py-4 px-6 text-zinc-400">{user.company || '—'}</td>
                    <td class="py-4 px-6 text-center font-mono font-bold text-primary">
                      {((user.wholesale_discount ?? 0.30) * 100).toFixed(0)}%
                    </td>
                    <td class="py-4 px-6 text-right">
                      <button
                        onclick={() => {
                          editingUser = user;
                          editDiscountVal = Math.round((user.wholesale_discount ?? 0.30) * 100);
                        }}
                        class="p-2 border border-white/10 hover:border-primary/50 text-zinc-400 hover:text-primary transition-lux rounded"
                        title="Edit discount rate"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {:else if activeTab === 'prices'}
        <!-- Custom Prices Tab -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left list: select customer -->
          <div class="border border-white/5 rounded p-5 bg-[#0A0A0A] space-y-4">
            <h3 class="text-sm font-serif text-white uppercase tracking-wider mb-2">1. Select Account</h3>
            <div class="space-y-2">
              {#each users as u}
                <button
                  onclick={() => {
                    selectedUser = u;
                    fetchCustomPrices(u.id);
                  }}
                  class="w-full text-left p-3 border rounded transition-lux flex flex-col gap-1
                    {selectedUser?.id === u.id
                      ? 'bg-primary/5 border-primary text-white' 
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'}"
                >
                  <span class="text-xs font-bold uppercase tracking-wide">{u.name}</span>
                  <span class="text-[10px] opacity-75">{u.company || u.email}</span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Middle & Right: prices management -->
          <div class="lg:col-span-2 space-y-8">
            {#if selectedUser}
              
              <!-- Setup dynamic pricing -->
              <div class="border border-white/5 rounded p-6 bg-[#0A0A0A] space-y-6">
                <h3 class="text-sm font-serif text-white uppercase tracking-wider">Add Custom Price for {selectedUser.name}</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Select Product -->
                  <div>
                    <label class="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Product</label>
                    <select
                      bind:value={selectedProduct}
                      class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      <option value={null}>Select a product...</option>
                      {#each $products as p}
                        <option value={p}>{p.name}</option>
                      {/each}
                    </select>
                  </div>

                  <!-- Select Variant -->
                  {#if selectedProduct && selectedProduct.variants}
                    <div>
                      <label class="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Variant</label>
                      <select
                        bind:value={selectedVariant}
                        class="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
                      >
                        <option value={null}>Select variant SKU / Name...</option>
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
                      <label class="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Custom Price ($)</label>
                      <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          bind:value={customPriceVal}
                          class="w-full bg-black border border-white/10 rounded pl-7 pr-4 py-2.5 text-xs text-white font-mono focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onclick={addCustomPrice}
                      class="btn-primary py-2.5 px-6 text-xs font-bold tracking-widest flex items-center gap-1.5 rounded-sm"
                    >
                      <Plus class="w-3.5 h-3.5" /> SAVE PRICE
                    </button>
                  </div>
                {/if}
              </div>

              <!-- List current custom prices -->
              <div class="border border-white/5 rounded p-6 bg-[#0A0A0A] space-y-4">
                <h3 class="text-sm font-serif text-white uppercase tracking-wider mb-2">Current Custom Prices</h3>
                
                {#if loadingPrices}
                  <div class="text-center py-8 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Loading pricing configuration...
                  </div>
                {:else if customPrices.length === 0}
                  <p class="text-xs text-zinc-500 py-4">No custom specific prices configured. User will receive their base discount.</p>
                {:else}
                  <div class="divide-y divide-white/5">
                    {#each customPrices as price}
                      <div class="flex justify-between items-center py-3.5">
                        <div class="space-y-1">
                          <p class="text-xs font-bold text-white uppercase tracking-wide">{getVariantName(price.variant_id)}</p>
                          <p class="text-[10px] text-zinc-500">Retail: ${getVariantRetailPrice(price.variant_id).toFixed(2)}</p>
                        </div>
                        <div class="flex items-center gap-6">
                          <span class="text-sm font-mono font-bold text-emerald-400">${price.custom_price.toFixed(2)}</span>
                          <button
                            onclick={() => deleteCustomPrice(price)}
                            class="text-zinc-600 hover:text-red-500 transition-lux p-1 rounded"
                            title="Delete custom price"
                          >
                            <Trash2 class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>

            {:else}
              <div class="border border-dashed border-white/10 rounded-lg p-20 text-center text-zinc-500 text-xs uppercase tracking-widest">
                Select a wholesale customer to configure custom prices
              </div>
            {/if}
          </div>
        </div>
      {:else if activeTab === 'orders'}
        <!-- Orders Tab -->
        {#if loadingOrders}
          <div class="py-20 text-center text-zinc-500 text-xs uppercase tracking-widest font-bold">
            Loading orders...
          </div>
        {:else}
          {@const activeList = ordersSubTab === 'awaiting' ? awaitingOrders : archivedOrders}
          <div class="space-y-6 animate-fade-in">
            <!-- Sub-tab switcher -->
            <div class="flex gap-4 border-b border-white/5 pb-4">
              <button
                onclick={() => ordersSubTab = 'awaiting'}
                class="px-4 py-2 text-xs uppercase tracking-wider font-bold border-b-2 transition-lux
                  {ordersSubTab === 'awaiting' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
              >
                Awaiting Label ({awaitingOrders.length})
              </button>
              <button
                onclick={() => ordersSubTab = 'archived'}
                class="px-4 py-2 text-xs uppercase tracking-wider font-bold border-b-2 transition-lux
                  {ordersSubTab === 'archived' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'}"
              >
                Archived ({archivedOrders.length})
              </button>
            </div>

            {#if activeList.length === 0}
              <div class="border border-dashed border-white/10 rounded-lg p-20 text-center text-zinc-500 text-xs uppercase tracking-widest">
                {#if ordersSubTab === 'awaiting'}
                  No orders awaiting shipping labels.
                {:else}
                  No archived orders found within the last 14 days.
                {/if}
              </div>
            {:else}
              <div class="space-y-6">
                {#each activeList as order}
                  {@const orderPlacedTime = new Date(order.created_at).getTime()}
                  {@const isLate = !order.shipping_label_printed && (Date.now() - orderPlacedTime > 24 * 60 * 60 * 1000)}
                  <div
                    class="border rounded bg-[#0A0A0A] p-6 space-y-4 transition-lux
                      {isLate ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-white/5'}"
                  >
                    <div class="flex flex-wrap justify-between items-start border-b border-white/5 pb-4 gap-4">
                      <div>
                        <div class="flex items-center gap-3">
                          <h3 class="text-sm font-bold text-white font-mono uppercase tracking-wide">{order.id}</h3>
                          {#if isLate}
                            <span class="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] uppercase tracking-wider font-bold">
                              ⚠️ LATE ORDER (Pending label > 24h)
                            </span>
                          {/if}
                        </div>
                        <p class="text-[10px] text-zinc-500 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded bg-white/5 text-zinc-300">
                          Status: {order.status}
                        </span>
                        <select
                          value={order.status}
                          onchange={(e) => updateOrderStatus(order.id, e.currentTarget.value)}
                          class="bg-black border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:border-primary focus:outline-none font-semibold uppercase tracking-wider"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <!-- Customer & Delivery -->
                      <div class="space-y-2">
                        <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Customer Info</h4>
                        <p class="text-xs text-white font-medium">{order.customer_name}</p>
                        <p class="text-xs text-zinc-400">{order.customer_email || 'No email registered'}</p>
                        <p class="text-xs text-zinc-400 font-semibold">Payment: <span class="font-mono uppercase tracking-wider text-[10px] text-primary">{order.payment_method}</span></p>
                      </div>

                      <!-- Shipping Address -->
                      <div class="space-y-2">
                        <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Shipping Address</h4>
                        <p class="text-xs text-zinc-300 leading-relaxed font-sans">
                          {order.shipping_address.address_line1}<br />
                          {#if order.shipping_address.address_line2}
                            {order.shipping_address.address_line2}<br />
                          {/if}
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                          {order.shipping_address.country}
                        </p>
                      </div>

                      <!-- Order Summary & Shipping Details -->
                      <div class="space-y-2">
                        <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Order Summary</h4>
                        <div class="text-xs space-y-1 font-mono">
                          <div class="flex justify-between">
                            <span class="text-zinc-500">Subtotal:</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-zinc-500">Shipping:</span>
                            <span>${order.shipping_cost.toFixed(2)}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-zinc-500">Sales Tax:</span>
                            <span>${(order.sales_tax || 0.00).toFixed(2)}</span>
                          </div>
                          <div class="flex justify-between text-white font-bold border-t border-white/5 pt-1 mt-1">
                            <span>Total:</span>
                            <span class="text-primary">${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <!-- EasyPost Labels if present -->
                        {#if order.shipping_label_printed}
                          <div class="border-t border-white/5 pt-3 mt-3 space-y-2">
                            <p class="text-[10px] text-zinc-400 flex items-center gap-1.5">
                              <Truck class="w-3.5 h-3.5 text-emerald-400" />
                              <span>{order.carrier || 'Carrier'} Tracking: {order.tracking_number}</span>
                            </p>
                            {#if order.shipping_label_url}
                              <a
                                href={order.shipping_label_url}
                                target="_blank"
                                class="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                              >
                                <ExternalLink class="w-3 h-3" /> PRINT SHIPPING LABEL
                              </a>
                            {/if}
                            {#if order.shipping_label_printed_at}
                              <p class="text-[9px] text-zinc-600 font-sans mt-1">
                                Archived on: {new Date(order.shipping_label_printed_at).toLocaleDateString()}<br />
                                Auto-hides on: {new Date(new Date(order.shipping_label_printed_at).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </p>
                            {/if}
                          </div>
                        {:else if order.status !== 'cancelled'}
                          <div class="border-t border-white/5 pt-3 mt-3">
                            <button
                              onclick={() => generateShippingLabel(order.id)}
                              disabled={generatingLabel[order.id]}
                              class="w-full text-center py-2 px-3 bg-primary/10 border border-primary/20 hover:border-primary text-primary hover:text-white transition-lux text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {#if generatingLabel[order.id]}
                                <span class="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                GENERATING SHIPPING LABEL...
                              {:else}
                                <Truck class="w-3.5 h-3.5" />
                                GENERATE EASYPOST SHIPPING LABEL
                              {/if}
                            </button>
                          </div>
                        {/if}
                      </div>
                    </div>

                    <!-- Items list -->
                    <div class="border-t border-white/5 pt-4">
                      <h4 class="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Items Ordered</h4>
                      <div class="divide-y divide-white/5">
                        {#each order.items as item}
                          <div class="flex justify-between py-2.5 text-xs">
                            <div class="text-zinc-300 font-sans">
                              {item.product_name} <span class="text-zinc-500 font-mono text-[10px] font-bold">x{item.quantity}</span>
                            </div>
                            <div class="font-mono text-white">
                              ${(item.total_price || (item.unit_price * item.quantity)).toFixed(2)}
                            </div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      {:else if activeTab === 'notifications'}
        <!-- Activity Log / Notifications Tab -->
        <div class="border border-white/5 rounded bg-[#0A0A0A] p-6 space-y-6">
          <div class="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 class="text-sm font-serif text-white uppercase tracking-wider">Activity Feed</h3>
            <span class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Real-Time Events</span>
          </div>

          {#if activities.length === 0}
            <p class="text-xs text-zinc-500 py-4 text-center">No recent activity detected.</p>
          {:else}
            <div class="space-y-4">
              {#each activities as activity}
                <div class="flex gap-4 p-4 border border-white/2 bg-black/45 rounded-sm hover:border-white/10 transition-lux">
                  <div class="flex-shrink-0 mt-0.5">
                    {#if activity.type === 'order'}
                      <div class="p-2 bg-emerald-500/10 rounded">
                        <ShoppingBag class="w-4 h-4 text-emerald-400" />
                      </div>
                    {:else}
                      <div class="p-2 bg-blue-500/10 rounded">
                        <Users class="w-4 h-4 text-blue-400" />
                      </div>
                    {/if}
                  </div>
                  <div class="flex-grow space-y-1">
                    <p class="text-xs font-bold text-white uppercase tracking-wide">{activity.title}</p>
                    <p class="text-xs text-zinc-400">{activity.subtitle}</p>
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
        <!-- ERPNext Launch Portal -->
        <div class="border border-white/5 rounded bg-[#0A0A0A] p-12 overflow-hidden shadow-2xl relative flex flex-col items-center justify-center text-center space-y-6" style="height: 500px;">
          <div class="p-5 bg-primary/5 rounded-full border border-primary/10 shadow-[0_0_50px_rgba(217,119,6,0.08)]">
            <Database class="w-12 h-12 text-primary" />
          </div>
          
          <div class="max-w-md space-y-2">
            <h2 class="text-lg font-serif text-white tracking-wide">ERPNext Management Portal</h2>
            <p class="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm mx-auto">
              Access the business operations, accounting, inventory, and purchase order modules in a dedicated browser tab.
            </p>
          </div>

          {#if token}
            <a
              href="/api/v1/admin/erp/desk?token={token}"
              target="_blank"
              rel="noopener noreferrer"
              class="px-8 py-3.5 bg-primary/10 border border-primary/20 hover:border-primary text-primary hover:text-white transition-lux text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(217,119,6,0.08)]"
            >
              <span>Launch ERPNext</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          {:else}
            <div class="text-zinc-500 text-[10px] uppercase tracking-widest font-bold animate-pulse">
              Generating secure SSO token...
            </div>
          {/if}
        </div>
      {/if}

    </div>
  </div>
{/if}

<!-- Edit Discount Modal -->
{#if editingUser}
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div class="max-w-md w-full border border-white/10 bg-[#0A0A0A] rounded shadow-2xl p-6 relative animate-fade-in">
      <button
        onclick={() => editingUser = null}
        class="absolute top-4 right-4 text-zinc-400 hover:text-white"
      >
        <X class="w-5 h-5" />
      </button>

      <h3 class="text-lg font-serif text-white mb-2">Adjust Wholesale Discount</h3>
      <p class="text-xs text-zinc-500 mb-6">Modify the baseline discount for <strong>{editingUser.name}</strong> ({editingUser.company || 'No Company'}).</p>

      <div class="space-y-6 mb-8">
        <div>
          <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            <span>Discount Percentage</span>
            <span class="font-mono text-primary text-sm">{editDiscountVal}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            bind:value={editDiscountVal}
            class="w-full accent-primary bg-zinc-950"
          />
        </div>

        <div class="bg-black/50 border border-white/5 p-4 rounded text-xs text-zinc-500 space-y-1">
          <p><strong>Retail Price Example:</strong> $100.00</p>
          <p><strong>Discounted Wholesale Price:</strong> <span class="text-primary font-bold font-mono">${(100 * (1 - editDiscountVal / 100)).toFixed(2)}</span></p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          onclick={() => editingUser = null}
          class="border border-white/10 hover:bg-white/5 py-2 px-5 text-xs font-bold tracking-widest rounded-sm text-zinc-400 hover:text-white transition-lux"
        >
          CANCEL
        </button>
        <button
          onclick={updateDiscount}
          class="btn-primary py-2 px-5 text-xs font-bold tracking-widest rounded-sm flex items-center gap-1.5"
        >
          <Percent class="w-3.5 h-3.5" /> SAVE CHANGES
        </button>
      </div>
    </div>
  </div>
{/if}
