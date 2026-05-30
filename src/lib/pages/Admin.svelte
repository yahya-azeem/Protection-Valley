<script lang="ts">
  import { onMount } from 'svelte';
  import { ShieldAlert, Trash2, Plus, Edit, X, Percent, DollarSign, Users, Award } from 'lucide-svelte';
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
  }

  interface CustomPrice {
    id: number;
    user_id: number;
    variant_id: number;
    custom_price: number;
  }

  let activeTab = $state<'users' | 'prices'>('users');
  let users = $state<WholesaleUser[]>([]);
  let loadingUsers = $state(true);

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
    if ($currentUser && $currentUser.role === 'admin') {
      await loadProducts();
      await fetchUsers();
    }
  });

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
      <div class="flex gap-4 border-b border-white/5 mb-8">
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
                    <td class="py-4 px-6 font-medium">{user.name}</td>
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
      {:else}
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
