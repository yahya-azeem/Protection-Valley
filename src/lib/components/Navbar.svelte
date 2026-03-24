<script lang="ts">
  import { base } from '$app/paths';
  import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-svelte';
  import { showPage, cart, cartOpen, searchOpen, currentPage, currentCategory } from '$lib/stores';
  import { NAV_ITEMS } from '$lib/constants';

  let isMenuOpen = $state(false);
  let openDropdown = $state<string | null>(null);
  let dropdownTimer: ReturnType<typeof setTimeout>;

  function navigate(id: string, category?: string) {
    if (category) {
      currentCategory.set(category);
    }
    showPage(id);
    isMenuOpen = false;
    openDropdown = null;
  }

  function startHover(id: string) {
    clearTimeout(dropdownTimer);
    openDropdown = id;
  }

  function endHover() {
    dropdownTimer = setTimeout(() => { openDropdown = null; }, 200);
  }
</script>

<nav class="bg-black border-b border-white/5 sticky top-0 z-[100] h-16 transition-lux">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
    <div class="flex items-center justify-between h-full relative">
      
      <!-- Desktop Left -->
      <div class="hidden lg:flex items-center gap-8 w-1/3">
        {#each NAV_ITEMS.slice(0, 2) as item}
          <div
            class="relative"
            onmouseenter={() => 'children' in item && startHover(item.id)}
            onmouseleave={endHover}
            role="navigation"
          >
            <button
              onclick={() => navigate(item.id)}
              class="text-xs font-semibold uppercase tracking-[0.15em] py-4 flex items-center gap-1.5 transition-lux hover:text-primary
                {$currentPage === item.id ? 'text-primary' : 'text-zinc-400'}"
            >
              {item.name}
              {'children' in item ? '' : ''}
            </button>
            {#if 'children' in item && item.children}
              <button
                onclick={() => navigate(item.id)}
                class="absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-600"
              >
                <ChevronDown class="w-3 h-3" />
              </button>
            {/if}

            <!-- Dropdown -->
            {#if 'children' in item && item.children && openDropdown === item.id}
              <div
                class="absolute top-full left-0 mt-0 pt-2 z-50"
                onmouseenter={() => startHover(item.id)}
                onmouseleave={endHover}
                role="menu"
              >
                <div class="bg-[#0A0A0A] border border-white/10 rounded shadow-2xl min-w-[200px] py-2">
                  {#each item.children as child}
                    <button
                      onclick={() => navigate(item.id, child.category)}
                      class="w-full text-left px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-lux"
                      role="menuitem"
                    >
                      {child.name}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Center Logo -->
      <div class="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
        <button onclick={() => navigate('home')} class="hover:scale-105 transition-lux">
          <img 
            src="{base}/images/logo-v3.png" 
            alt="Protection Valley" 
            class="h-14 w-auto" 
          />
        </button>
      </div>

      <!-- Desktop Right -->
      <div class="hidden lg:flex items-center justify-end gap-8 w-1/3">
        <div class="flex items-center gap-8">
          {#each NAV_ITEMS.slice(2) as item}
            <button 
              onclick={() => navigate(item.id)}
              class="text-xs font-semibold uppercase tracking-[0.15em] transition-lux hover:text-primary
                {$currentPage === item.id ? 'text-primary' : 'text-zinc-400'}"
            >
              {item.name}
            </button>
          {/each}
        </div>

        <div class="flex items-center gap-5 border-l border-white/10 pl-8">
          <button onclick={() => searchOpen.set(true)} class="text-zinc-400 hover:text-primary transition-lux" aria-label="Search">
            <Search class="w-[18px] h-[18px]" />
          </button>
          
          <button onclick={() => showPage('login')} class="text-zinc-400 hover:text-primary transition-lux" aria-label="Account">
            <User class="w-[18px] h-[18px]" />
          </button>

          <button onclick={() => cartOpen.set(true)} class="relative flex items-center gap-2 text-zinc-400 hover:text-primary transition-lux" aria-label="Cart">
            <span class="text-xs font-semibold uppercase tracking-[0.1em]">Cart</span>
            <div class="relative">
              <ShoppingBag class="w-[18px] h-[18px]" />
              {#if $cart.length > 0}
                <span class="absolute -top-1.5 -right-1.5 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {$cart.length}
                </span>
              {/if}
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div class="lg:hidden flex items-center justify-between w-full">
        <button onclick={() => isMenuOpen = !isMenuOpen} class="text-white" aria-label="Menu">
          <Menu class="w-6 h-6" />
        </button>
        <button onclick={() => navigate('home')} class="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
          <img src="{base}/images/logo-v3.png" alt="Logo" class="h-12 w-auto" />
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
    <div class="lg:hidden fixed inset-0 z-[150] bg-black p-10 flex flex-col gap-8 animate-fade-in">
      <div class="flex justify-between items-center mb-4">
        <img src="{base}/images/logo-v3.png" alt="Logo" class="h-14 w-auto" />
        <button onclick={() => isMenuOpen = false} class="text-white">
          <X class="w-8 h-8" />
        </button>
      </div>
      {#each NAV_ITEMS as item}
        <button onclick={() => navigate(item.id)} class="text-2xl font-serif text-white tracking-tight text-left hover:text-primary transition-lux">
          {item.name}
        </button>
        {#if 'children' in item && item.children}
          <div class="pl-4 flex flex-col gap-3 -mt-4">
            {#each item.children as child}
              <button
                onclick={() => navigate(item.id, child.category)}
                class="text-sm text-zinc-500 hover:text-primary transition-lux text-left"
              >
                {child.name}
              </button>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</nav>
