<script lang="ts">
  import { base } from '$app/paths';
  import { Search, ShoppingCart, User } from 'lucide-svelte';
  import { showPage, searchOpen, cartOpen, cartCount, currentUser } from '$lib/stores';

  function toggleSearch() { searchOpen.update(v => !v); }
  function toggleCart() { cartOpen.update(v => !v); }
</script>

<nav class="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-dark-border">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <button onclick={() => showPage('home')} class="flex items-center space-x-3">
        <img src="{base}/images/logo.png" alt="Protection Valley" class="h-12 w-auto" />
      </button>
      <div class="hidden md:flex items-center space-x-8">
        {#each ['Home', 'Catalog', 'About', 'Contact'] as label}
          <button onclick={() => showPage(label.toLowerCase())} class="text-sm font-medium text-dark-text hover:text-primary transition-colors">{label}</button>
        {/each}
      </div>
      <div class="flex items-center space-x-4">
        <button onclick={toggleSearch} class="p-2 text-dark-text hover:text-primary transition-colors">
          <Search class="w-5 h-5" />
        </button>
        <button onclick={toggleCart} class="relative p-2 text-dark-text hover:text-primary transition-colors">
          <ShoppingCart class="w-5 h-5" />
          {#if $cartCount > 0}
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[#0a0a0a] text-xs rounded-full flex items-center justify-center">{$cartCount}</span>
          {/if}
        </button>
        <button
          onclick={() => $currentUser ? currentUser.logout() : showPage('login')}
          class="p-2 text-dark-text hover:text-primary transition-colors"
        >
          {#if $currentUser}
            <span class="text-sm">{$currentUser.name}</span>
          {:else}
            <User class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>
  </div>
</nav>
