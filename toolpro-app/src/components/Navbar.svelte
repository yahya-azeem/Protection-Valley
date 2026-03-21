<script lang="ts">
  import { ShoppingCart, Menu, X, Search, User } from 'lucide-svelte'
  import { cartCount } from '../stores/cart'
  import { isAuthenticated, isWholesale, isAdmin, auth } from '../stores/auth'
  import { cartOpen, mobileMenuOpen } from '../stores/ui'
  import { navigate, currentPath } from '../lib/router'
  import { searchQuery } from '../stores/products'

  let searchValue = ''

  function handleSearch(e: Event) {
    e.preventDefault()
    searchQuery.set(searchValue)
    navigate('/products')
    searchValue = ''
  }

  function handleLogout() {
    auth.logout()
    navigate('/')
  }

  $: isActive = (path: string) => {
    if (path === '/') return $currentPath === '/'
    return $currentPath.startsWith(path)
  }
</script>

<nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <button 
        class="flex items-center space-x-2"
        on:click={() => navigate('/')}
      >
        <span class="text-2xl font-serif text-primary">ToolPro</span>
        <span class="text-sm text-secondary hidden sm:inline">Supply</span>
        {#if $isWholesale}
          <span class="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded">Wholesale</span>
        {/if}
      </button>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <button 
          class="text-sm font-medium transition-colors {isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'}"
          on:click={() => navigate('/')}
        >
          Home
        </button>
        <button 
          class="text-sm font-medium transition-colors {isActive('/products') ? 'text-primary' : 'text-gray-700 hover:text-primary'}"
          on:click={() => navigate('/products')}
        >
          Products
        </button>
        <button 
          class="text-sm font-medium transition-colors {isActive('/about') ? 'text-primary' : 'text-gray-700 hover:text-primary'}"
          on:click={() => navigate('/about')}
        >
          About
        </button>
        <button 
          class="text-sm font-medium transition-colors {isActive('/contact') ? 'text-primary' : 'text-gray-700 hover:text-primary'}"
          on:click={() => navigate('/contact')}
        >
          Contact
        </button>
        {#if $isAdmin}
          <button 
            class="text-sm font-medium transition-colors {isActive('/admin') ? 'text-primary' : 'text-gray-700 hover:text-primary'}"
            on:click={() => navigate('/admin')}
          >
            Admin
          </button>
        {/if}
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <form on:submit={handleSearch} class="hidden sm:flex items-center">
          <div class="relative">
            <input
              type="text"
              bind:value={searchValue}
              placeholder="Search tools..."
              class="w-48 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-primary transition-colors"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </form>

        <!-- Cart -->
        <button
          class="relative p-2 text-gray-700 hover:text-primary transition-colors"
          on:click={() => cartOpen.set(true)}
          aria-label="Open cart"
        >
          <ShoppingCart class="w-5 h-5" />
          {#if $cartCount > 0}
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              {$cartCount}
            </span>
          {/if}
        </button>

        <!-- Auth -->
        {#if $isAuthenticated}
          <div class="relative group">
            <button class="p-2 text-gray-700 hover:text-primary transition-colors">
              <User class="w-5 h-5" />
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div class="p-3 border-b border-gray-100">
                <p class="text-sm font-medium">{$auth?.name}</p>
                <p class="text-xs text-gray-500">{$auth?.email}</p>
              </div>
              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                on:click={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        {:else}
          <button
            class="hidden sm:flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            on:click={() => navigate('/login')}
          >
            <User class="w-5 h-5" />
            <span>Sign In</span>
          </button>
        {/if}

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 text-gray-700"
          on:click={() => mobileMenuOpen.update(v => !v)}
        >
          {#if $mobileMenuOpen}
            <X class="w-6 h-6" />
          {:else}
            <Menu class="w-6 h-6" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if $mobileMenuOpen}
    <div class="md:hidden bg-white border-t border-gray-100">
      <div class="px-4 py-4 space-y-3">
        <form on:submit={handleSearch} class="flex items-center">
          <input
            type="text"
            bind:value={searchValue}
            placeholder="Search tools..."
            class="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
          <button type="submit" class="ml-2 p-2 text-primary">
            <Search class="w-5 h-5" />
          </button>
        </form>
        
        <button 
          class="block w-full text-left py-2 text-gray-700"
          on:click={() => { navigate('/'); mobileMenuOpen.set(false) }}
        >
          Home
        </button>
        <button 
          class="block w-full text-left py-2 text-gray-700"
          on:click={() => { navigate('/products'); mobileMenuOpen.set(false) }}
        >
          Products
        </button>
        <button 
          class="block w-full text-left py-2 text-gray-700"
          on:click={() => { navigate('/about'); mobileMenuOpen.set(false) }}
        >
          About
        </button>
        <button 
          class="block w-full text-left py-2 text-gray-700"
          on:click={() => { navigate('/contact'); mobileMenuOpen.set(false) }}
        >
          Contact
        </button>
        {#if !$isAuthenticated}
          <button 
            class="block w-full text-left py-2 text-primary font-medium"
            on:click={() => { navigate('/login'); mobileMenuOpen.set(false) }}
          >
            Sign In
          </button>
        {:else}
          {#if $isAdmin}
            <button 
              class="block w-full text-left py-2 text-gray-700"
              on:click={() => { navigate('/admin'); mobileMenuOpen.set(false) }}
            >
              Admin
            </button>
          {/if}
          <button 
            class="block w-full text-left py-2 text-red-600"
            on:click={() => { handleLogout(); mobileMenuOpen.set(false) }}
          >
            Sign Out
          </button>
        {/if}
      </div>
    </div>
  {/if}
</nav>
