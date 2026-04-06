<script lang="ts">
  import { Lock, LogIn, LogOut } from 'lucide-svelte';
  import { currentUser } from '$lib/stores';
</script>

<svelte:head>
  <title>Wholesale Portal | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-md w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-12 text-center flex flex-col items-center">
      <div class="w-20 h-20 bg-[#0A0A0A] border border-white/10 rounded mb-8 flex items-center justify-center">
        <Lock class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-4xl font-serif text-white mb-4">
        Wholesale Portal
      </h1>
      <p class="text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
        Access specialized wholesale pricing and bulk fulfillment for professionals.
      </p>
    </div>

    <!-- Login Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-10 rounded shadow-2xl space-y-6">
      {#if $currentUser}
        <div class="space-y-4">
          <button 
            onclick={() => currentUser.logout()}
            class="apple-btn w-full flex items-center justify-center gap-3"
          >
            <LogOut class="w-4 h-4" />
            SIGN OUT
          </button>
          <p class="text-[10px] text-zinc-500 uppercase tracking-widest">
            Logged in as: <span class="text-primary">{$currentUser.email}</span>
          </p>
        </div>
      {:else}
        <button class="apple-btn w-full flex items-center justify-center gap-3">
          <LogIn class="w-4 h-4" />
          LOGIN WITH GOOGLE
        </button>
      {/if}
      
      <p class="text-[10px] text-zinc-600 uppercase tracking-widest pt-4 italic">
        Wholesale access requires verified account approval.
      </p>
    </div>

    <!-- Links -->
    <div class="mt-12">
      <a href="/contact" class="text-xs font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-1 uppercase tracking-widest">
        Request an account
      </a>
    </div>
  </div>
</div>
