<script lang="ts">
  import { base } from '$app/paths';
  import { ShoppingBag, Search, User, Menu, X } from 'lucide-svelte';
  import { showPage, cart, cartOpen, searchOpen, currentPage } from '$lib/stores';

  let isMenuOpen = $state(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Collection', id: 'catalog' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' }
  ];

  function navigate(id: string) {
    showPage(id);
    isMenuOpen = false;
  }
</script>

<!-- Simplified Solid Navbar (No Translucency) -->
<nav class="bg-black border-b border-white/5 sticky top-0 z-[100] h-20 transition-lux">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
    <div class="flex items-center justify-between h-full relative">
      
      <!-- Desktop Left -->
      <div class="hidden lg:flex items-center space-x-12 w-1/3">
        {#each navItems.slice(0, 2) as item}
          <button 
            onclick={() => navigate(item.id)}
            class="text-[0.6rem] font-bold uppercase tracking-[0.5em] transition-lux hover:text-primary
              {$currentPage === item.id ? 'text-primary' : 'text-zinc-500'}"
          >
            {item.name}
          </button>
        {/each}
      </div>

      <!-- Center Logo (Simple & Clean) -->
      <div class="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
        <button onclick={() => navigate('home')} class="hover:scale-105 transition-lux">
          <img 
            src="{base}/images/logo-v3.png" 
            alt="Protection Valley" 
            class="h-10 w-auto" 
          />
        </button>
      </div>

      <!-- Desktop Right -->
      <div class="hidden lg:flex items-center justify-end space-x-12 w-1/3">
        <div class="flex items-center space-x-12">
          {#each navItems.slice(2) as item}
            <button 
              onclick={() => navigate(item.id)}
              class="text-[0.6rem] font-bold uppercase tracking-[0.5em] transition-lux hover:text-primary
                {$currentPage === item.id ? 'text-primary' : 'text-zinc-500'}"
            >
              {item.name}
            </button>
          {/each}
        </div>

        <div class="flex items-center space-x-8 border-l border-white/10 pl-12">
          <button onclick={() => searchOpen.set(true)} class="text-zinc-500 hover:text-primary transition-lux">
            <Search class="w-4 h-4" />
          </button>
          
          <button onclick={() => showPage('login')} class="text-zinc-500 hover:text-primary transition-lux">
            <User class="w-4 h-4" />
          </button>

          <button onclick={() => cartOpen.set(true)} class="relative flex items-center gap-3 text-zinc-500 hover:text-primary transition-lux">
            <span class="text-[0.6rem] font-bold uppercase tracking-[0.3em]">Cart</span>
            <div class="relative">
              <ShoppingBag class="w-4 h-4" />
              {#if $cart.length > 0}
                <span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {$cart.length}
                </span>
              {/if}
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div class="lg:hidden flex items-center justify-between w-full">
        <button onclick={() => isMenuOpen = !isMenuOpen} class="text-white">
          <Menu class="w-6 h-6" />
        </button>
        <button onclick={() => navigate('home')} class="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
          <img src="{base}/images/logo-v3.png" alt="Logo" class="h-10 w-auto" />
        </button>
        <button onclick={() => cartOpen.set(true)} class="text-white relative flex items-center gap-2">
          <div class="relative">
            <ShoppingBag class="w-5 h-5" />
            {#if $cart.length > 0}
              <span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{$cart.length}</span>
            {/if}
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Overlay -->
  {#if isMenuOpen}
    <div class="lg:hidden fixed inset-0 z-[150] bg-black p-12 flex flex-col space-y-12 animate-fade-in text-center">
      <div class="flex justify-center mb-12">
        <img src="{base}/images/logo-v3.png" alt="Logo" class="h-20 w-auto" />
      </div>
      <button onclick={() => isMenuOpen = false} class="absolute top-8 right-8 text-white">
        <X class="w-10 h-10" />
      </button>
      {#each navItems as item}
        <button onclick={() => navigate(item.id)} class="text-4xl font-serif text-white tracking-tight italic">
          {item.name}
        </button>
      {/each}
    </div>
  {/if}
</nav>
