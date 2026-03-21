<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from '../lib/router'
  import { isAdmin, isAuthenticated } from '../stores/auth'
  import { 
    ArrowLeft, 
    Search, 
    Filter, 
    Download,
    Eye,
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle
  } from 'lucide-svelte'

  // Redirect if not admin
  onMount(() => {
    if (!$isAuthenticated || !$isAdmin) {
      navigate('/login')
    }
  })

  let searchQuery = ''
  let statusFilter = 'all'

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: { name: 'John Smith', email: 'john@example.com', company: '' },
      items: [
        { name: 'Professional Cordless Drill', quantity: 1, price: 149.99 }
      ],
      total: 164.99,
      status: 'completed',
      date: '2024-01-15',
      shipping: { method: 'Standard', cost: 15 },
      payment: { method: 'Credit Card', last4: '4242' }
    },
    {
      id: 'ORD-2024-002',
      customer: { name: 'Sarah Johnson', email: 'sarah@construction.com', company: 'Johnson Construction' },
      items: [
        { name: 'Circular Saw 7-1/4"', quantity: 3, price: 71.99 },
        { name: 'Hammer Drill Rotary', quantity: 2, price: 199.99 }
      ],
      total: 615.95,
      status: 'processing',
      date: '2024-01-15',
      shipping: { method: 'Express', cost: 25 },
      payment: { method: 'Credit Card', last4: '8888' }
    },
    {
      id: 'ORD-2024-003',
      customer: { name: 'Mike Davis', email: 'mike@electricpro.com', company: 'Electric Pro LLC' },
      items: [
        { name: 'Electrician Tool Set 45-Piece', quantity: 5, price: 159.99 },
        { name: 'Multimeter Digital', quantity: 10, price: 55.99 }
      ],
      total: 1359.85,
      status: 'shipped',
      date: '2024-01-14',
      shipping: { method: 'Freight', cost: 75 },
      payment: { method: 'Wire Transfer', last4: '' }
    },
    {
      id: 'ORD-2024-004',
      customer: { name: 'Lisa Wilson', email: 'lisa@example.com', company: '' },
      items: [
        { name: 'Tape Measure 25ft', quantity: 2, price: 24.99 }
      ],
      total: 49.98,
      status: 'pending',
      date: '2024-01-14',
      shipping: { method: 'Standard', cost: 0 },
      payment: { method: 'PayPal', last4: '' }
    },
    {
      id: 'ORD-2024-005',
      customer: { name: 'Robert Brown', email: 'rob@buildcorp.com', company: 'BuildCorp Inc.' },
      items: [
        { name: 'Angle Grinder 4-1/2"', quantity: 8, price: 63.99 },
        { name: 'Pliers Set 6-Piece', quantity: 10, price: 39.99 },
        { name: 'Wire Stripper Automatic', quantity: 15, price: 27.99 }
      ],
      total: 1687.65,
      status: 'completed',
      date: '2024-01-13',
      shipping: { method: 'Freight', cost: 100 },
      payment: { method: 'Credit Card', last4: '1234' }
    },
    {
      id: 'ORD-2024-006',
      customer: { name: 'Emily Chen', email: 'emily@example.com', company: '' },
      items: [
        { name: 'Level 48" Magnetic', quantity: 1, price: 59.99 }
      ],
      total: 59.99,
      status: 'cancelled',
      date: '2024-01-12',
      shipping: { method: 'Standard', cost: 0 },
      payment: { method: 'Credit Card', last4: '5555' }
    }
  ]

  $: filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed': return CheckCircle
      case 'processing': return Clock
      case 'shipped': return Truck
      case 'pending': return Package
      case 'cancelled': return XCircle
      default: return Package
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  let selectedOrder: typeof orders[0] | null = null
</script>

<svelte:head>
  <title>Orders - ToolPro Supply Admin</title>
</svelte:head>

{#if $isAdmin}
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white min-h-screen shadow-sm fixed left-0 top-0 z-30">
        <div class="p-6">
          <button 
            class="text-2xl font-serif text-primary"
            on:click={() => navigate('/')}
          >
            ToolPro Admin
          </button>
        </div>

        <nav class="px-4 pb-4">
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            on:click={() => navigate('/admin')}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Dashboard
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            on:click={() => navigate('/admin')}
          >
            <Package class="w-5 h-5" />
            Products
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            Orders
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8">
        <!-- Header -->
        <div class="mb-8">
          <button 
            class="flex items-center text-gray-500 hover:text-primary mb-4"
            on:click={() => navigate('/admin')}
          >
            <ArrowLeft class="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-serif">Orders</h1>
              <p class="text-gray-600">Manage and track customer orders</p>
            </div>
            <button class="btn-secondary flex items-center gap-2">
              <Download class="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg p-4 mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="relative flex-1">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                bind:value={searchQuery}
                placeholder="Search orders, customers..."
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <select 
              bind:value={statusFilter}
              class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {#each filteredOrders as order}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <span class="font-medium">{order.id}</span>
                      <p class="text-xs text-gray-500">{order.items.length} item(s)</p>
                    </td>
                    <td class="px-6 py-4">
                      <p class="font-medium">{order.customer.name}</p>
                      {#if order.customer.company}
                        <p class="text-xs text-gray-500">{order.customer.company}</p>
                      {/if}
                    </td>
                    <td class="px-6 py-4 text-gray-500">{order.date}</td>
                    <td class="px-6 py-4">
                      <span class="font-medium">${order.total.toFixed(2)}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium {getStatusColor(order.status)}">
                        <svelte:component this={getStatusIcon(order.status)} class="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button 
                        class="p-2 text-gray-400 hover:text-primary transition-colors"
                        on:click={() => selectedOrder = order}
                      >
                        <Eye class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Order Detail Modal -->
        {#if selectedOrder}
          <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-serif">{selectedOrder.id}</h2>
                  <p class="text-sm text-gray-500">Placed on {selectedOrder.date}</p>
                </div>
                <button 
                  class="p-2 text-gray-400 hover:text-gray-600"
                  on:click={() => selectedOrder = null}
                >
                  ×
                </button>
              </div>

              <div class="p-6 space-y-6">
                <!-- Status -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span class="font-medium">Status</span>
                  <span class="px-3 py-1 rounded-full text-sm font-medium {getStatusColor(selectedOrder.status)}">
                    {selectedOrder.status}
                  </span>
                </div>

                <!-- Customer Info -->
                <div>
                  <h3 class="font-medium mb-3">Customer Information</h3>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="font-medium">{selectedOrder.customer.name}</p>
                    <p class="text-gray-600">{selectedOrder.customer.email}</p>
                    {#if selectedOrder.customer.company}
                      <p class="text-gray-600">{selectedOrder.customer.company}</p>
                    {/if}
                  </div>
                </div>

                <!-- Items -->
                <div>
                  <h3 class="font-medium mb-3">Order Items</h3>
                  <div class="space-y-3">
                    {#each selectedOrder.items as item}
                      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p class="font-medium">{item.name}</p>
                          <p class="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span class="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- Totals -->
                <div class="border-t border-gray-200 pt-4">
                  <div class="space-y-2">
                    <div class="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${(selectedOrder.total - selectedOrder.shipping.cost).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-gray-600">
                      <span>Shipping ({selectedOrder.shipping.method})</span>
                      <span>${selectedOrder.shipping.cost.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span class="text-primary">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <!-- Payment -->
                <div>
                  <h3 class="font-medium mb-3">Payment Information</h3>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-gray-600">
                      {selectedOrder.payment.method}
                      {#if selectedOrder.payment.last4}
                        ending in {selectedOrder.payment.last4}
                      {/if}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6 border-t border-gray-100 flex gap-4">
                <button 
                  class="flex-1 btn-secondary"
                  on:click={() => selectedOrder = null}
                >
                  Close
                </button>
                {#if selectedOrder.status === 'pending'}
                  <button class="flex-1 btn-primary">
                    Process Order
                  </button>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </main>
    </div>
  </div>
{/if}
