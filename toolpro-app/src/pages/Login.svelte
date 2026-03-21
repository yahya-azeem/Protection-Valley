<script lang="ts">
  import { navigate } from '../lib/router'
  import { auth, mockLogin, isAuthenticated } from '../stores/auth'
  import { User, Lock, ArrowRight, Building2, UserCircle } from 'lucide-svelte'

  let email = ''
  let password = ''
  let error = ''
  let loading = false
  let activeTab: 'retail' | 'wholesale' | 'admin' = 'retail'

  async function handleSubmit() {
    error = ''
    loading = true

    try {
      if (activeTab === 'retail') {
        // For retail, just create a basic user session
        auth.login({
          id: Date.now(),
          email: email,
          name: 'Retail Customer',
          role: 'retail',
          token: 'mock-retail-token'
        })
        navigate('/')
        return
      }

      const user = await mockLogin(email, password)
      
      if (user) {
        if (activeTab === 'wholesale' && user.role !== 'wholesale') {
          error = 'This account does not have wholesale access'
          return
        }
        if (activeTab === 'admin' && user.role !== 'admin') {
          error = 'This account does not have admin access'
          return
        }
        auth.login(user)
        navigate(user.role === 'admin' ? '/admin' : '/')
      } else {
        error = 'Invalid email or password'
      }
    } catch (e) {
      error = 'An error occurred. Please try again.'
    } finally {
      loading = false
    }
  }

  // Demo credentials helper
  function fillDemoCredentials() {
    if (activeTab === 'wholesale') {
      email = 'wholesale@toolpro.com'
      password = 'password'
    } else if (activeTab === 'admin') {
      email = 'admin@toolpro.com'
      password = 'password'
    } else {
      email = 'customer@example.com'
      password = 'password'
    }
  }
</script>

<svelte:head>
  <title>Sign In - ToolPro Supply</title>
  <meta name="description" content="Sign in to your ToolPro Supply account for wholesale pricing and order history." />
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center py-12 px-4">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-serif mb-2">Welcome Back</h1>
      <p class="text-gray-600">Sign in to access your account</p>
    </div>

    <!-- Tabs -->
    <div class="flex rounded-lg bg-white p-1 mb-6 shadow-sm">
      <button
        class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors {activeTab === 'retail' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
        on:click={() => { activeTab = 'retail'; error = '' }}
      >
        <div class="flex items-center justify-center gap-2">
          <UserCircle class="w-4 h-4" />
          Retail
        </div>
      </button>
      <button
        class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors {activeTab === 'wholesale' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
        on:click={() => { activeTab = 'wholesale'; error = '' }}
      >
        <div class="flex items-center justify-center gap-2">
          <Building2 class="w-4 h-4" />
          Wholesale
        </div>
      </button>
      <button
        class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors {activeTab === 'admin' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}"
        on:click={() => { activeTab = 'admin'; error = '' }}
      >
        <div class="flex items-center justify-center gap-2">
          <Lock class="w-4 h-4" />
          Admin
        </div>
      </button>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-sm p-8">
      {#if activeTab === 'retail'}
        <div class="text-center mb-6">
          <p class="text-gray-600 text-sm">
            Sign in as a retail customer to track orders and save favorites.
          </p>
        </div>
      {:else if activeTab === 'wholesale'}
        <div class="bg-primary/10 rounded-lg p-4 mb-6">
          <p class="text-sm text-primary">
            <strong>Wholesale Benefits:</strong> Save up to 30% on bulk orders, 
            access exclusive products, and get priority support.
          </p>
        </div>
      {:else}
        <div class="bg-gray-100 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-600">
            Admin access for managing products, orders, and inventory.
          </p>
        </div>
      {/if}

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">Email Address</label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email"
              bind:value={email}
              required
              placeholder="you@example.com"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password"
              bind:value={password}
              required
              placeholder="••••••••"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-gray-600">Remember me</span>
          </label>
          <button type="button" class="text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        <button 
          type="submit"
          disabled={loading}
          class="w-full btn-primary py-4 flex items-center justify-center gap-2"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          {#if !loading}
            <ArrowRight class="w-5 h-5" />
          {/if}
        </button>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <button 
          class="text-sm text-primary hover:underline"
          on:click={fillDemoCredentials}
        >
          Fill demo credentials
        </button>
        {#if activeTab === 'wholesale'}
          <p class="text-xs text-gray-500 mt-2">
            Demo: wholesale@toolpro.com / password
          </p>
        {:else if activeTab === 'admin'}
          <p class="text-xs text-gray-500 mt-2">
            Demo: admin@toolpro.com / password
          </p>
        {/if}
      </div>

      {#if activeTab === 'retail'}
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-600">Don't have an account?</span>
          <button class="text-primary hover:underline ml-1">
            Create account
          </button>
        </div>
      {:else if activeTab === 'wholesale'}
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-600">Need a wholesale account?</span>
          <button class="text-primary hover:underline ml-1">
            Apply now
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
