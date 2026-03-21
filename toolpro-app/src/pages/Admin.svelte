<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from '../lib/router'
  import { isAdmin, isAuthenticated } from '../stores/auth'
  import { products, type Product } from '../stores/products'
  import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    Settings,
    Plus,
    Edit2,
    Trash2,
    Search,
    TrendingUp,
    DollarSign,
    AlertCircle
  } from 'lucide-svelte'

  // Redirect if not admin
  onMount(() => {
    if (!$isAuthenticated || !$isAdmin) {
      navigate('/login')
    }
  })

  let activeTab = 'dashboard'
  let searchQuery = ''
  let editingProduct: Product | null = null
  let showAddModal = false

  // Mock stats
  const stats = {
    totalOrders: 156,
    totalRevenue: 45230.50,
    totalProducts: 124,
    lowStock: 8
  }

  // Mock recent orders
  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', total: 245.99, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'ABC Construction', total: 1899.50, status: 'processing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', total: 89.99, status: 'shipped', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Electric Pro LLC', total: 567.00, status: 'pending', date: '2024-01-14' },
    { id: 'ORD-005', customer: 'Sarah Williams', total: 345.50, status: 'completed', date: '2024-01-13' }
  ]

  $: filteredProducts = $products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      products.update(p => p.filter(prod => prod.id !== id))
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
</script>

<svelte:head>
  <title>Admin Dashboard - ToolPro Supply</title>
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
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => activeTab = 'dashboard'}
          >
            <LayoutDashboard class="w-5 h-5" />
            Dashboard
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => activeTab = 'products'}
          >
            <Package class="w-5 h-5" />
            Products
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => navigate('/admin/orders')}
          >
            <ShoppingCart class="w-5 h-5" />
            Orders
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {activeTab === 'customers' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => activeTab = 'customers'}
          >
            <Users class="w-5 h-5" />
            Customers
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => activeTab = 'settings'}
          >
            <Settings class="w-5 h-5" />
            Settings
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8">
        {#if activeTab === 'dashboard'}
          <div class="mb-8">
            <h1 class="text-3xl font-serif">Dashboard</h1>
            <p class="text-gray-600">Welcome back, {$auth?.name}</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-primary/10 rounded-lg">
                  <ShoppingCart class="w-6 h-6 text-primary" />
                </div>
                <span class="text-green-600 text-sm font-medium">+12%</span>
              </div>
              <p class="text-gray-600 text-sm">Total Orders</p>
              <p class="text-2xl font-serif">{stats.totalOrders}</p>
            </div>

            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-green-100 rounded-lg">
                  <DollarSign class="w-6 h-6 text-green-600" />
                </div>
                <span class="text-green-600 text-sm font-medium">+8%</span>
              </div>
              <p class="text-gray-600 text-sm">Revenue</p>
              <p class="text-2xl font-serif">${stats.totalRevenue.toLocaleString()}</p>
            </div>

            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <Package class="w-6 h-6 text-blue-600" />
                </div>
                <span class="text-gray-500 text-sm font-medium">—</span>
              </div>
              <p class="text-gray-600 text-sm">Products</p>
              <p class="text-2xl font-serif">{stats.totalProducts}</p>
            </div>

            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-red-100 rounded-lg">
                  <AlertCircle class="w-6 h-6 text-red-600" />
                </div>
                <span class="text-red-600 text-sm font-medium">Action</span>
              </div>
              <p class="text-gray-600 text-sm">Low Stock</p>
              <p class="text-2xl font-serif">{stats.lowStock}</p>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="bg-white rounded-lg overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-xl font-serif">Recent Orders</h2>
              <button 
                class="text-primary hover:underline"
                on:click={() => navigate('/admin/orders')}
              >
                View All
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {#each recentOrders as order}
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 font-medium">{order.id}</td>
                      <td class="px-6 py-4">{order.customer}</td>
                      <td class="px-6 py-4 text-gray-500">{order.date}</td>
                      <td class="px-6 py-4">${order.total.toFixed(2)}</td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-xs font-medium {getStatusColor(order.status)}">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>

        {:else if activeTab === 'products'}
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-serif">Products</h1>
                <p class="text-gray-600">Manage your product inventory</p>
              </div>
              <button 
                class="btn-primary flex items-center gap-2"
                on:click={() => showAddModal = true}
              >
                <Plus class="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>

          <!-- Search -->
          <div class="bg-white rounded-lg p-4 mb-6">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                bind:value={searchQuery}
                placeholder="Search products by name or SKU..."
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <!-- Products Table -->
          <div class="bg-white rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {#each filteredProducts as product}
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <img src={product.image} alt={product.name} class="w-10 h-10 rounded object-cover" />
                          <span class="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-gray-500">{product.sku}</td>
                      <td class="px-6 py-4">
                        <div class="text-sm">
                          <span class="font-medium">${product.price.toFixed(2)}</span>
                          <span class="text-gray-500 text-xs block">WS: ${product.wholesalePrice.toFixed(2)}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="{product.stock < 10 ? 'text-red-600' : 'text-green-600'}">
                          {product.stock}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button 
                            class="p-2 text-gray-400 hover:text-primary transition-colors"
                            on:click={() => editingProduct = product}
                          >
                            <Edit2 class="w-4 h-4" />
                          </button>
                          <button 
                            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            on:click={() => deleteProduct(product.id)}
                          >
                            <Trash2 class="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {:else}
          <div class="text-center py-16">
            <p class="text-gray-500">This section is coming soon.</p>
          </div>
        {/if}
      </main>
    </div>
  </div>
{/if}
