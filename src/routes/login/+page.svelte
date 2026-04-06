<script lang="ts">
  import { Lock, User, LogIn, LogOut } from 'lucide-svelte';
  import { base } from '$app/paths';
  import { currentUser } from '$lib/stores';
</script>

<svelte:head>
  <title>Wholesale Login | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-md w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-12">
      <div class="w-20 h-20 bg-[#0A0A0A] border border-white/10 rounded mx-auto mb-8 flex items-center justify-center">
        <Lock class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-4xl font-serif text-white mb-4">
        {$currentUser ? 'Account' : 'Wholesale Portal'}
      </h1>
      <p class="text-sm text-zinc-500 uppercase tracking-widest leading-relaxed">
        {$currentUser 
          ? 'Manage your specialized account and wholesale preferences.' 
          : 'Access specialized wholesale pricing and bulk fulfillment for professionals.'}
      </p>
    </div>

    <!-- Login Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-10 rounded shadow-2xl space-y-8">
      {#if $currentUser}
        <div class="space-y-6">
          <div class="p-4 bg-white/5 border border-white/5 rounded">
            <p class="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Signed in as</p>
            <p class="text-xl font-serif text-white">{$currentUser.email}</p>
            <p class="mt-2 text-[10px] text-primary uppercase font-bold tracking-widest">
              Account Role: {$currentUser.role}
            </p>
          </div>

          <button 
            onclick={() => currentUser.logout()}
            class="apple-btn w-full flex items-center justify-center gap-3"
          >
            <LogOut class="w-4 h-4" />
            SIGN OUT
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          <button class="apple-btn w-full flex items-center justify-center gap-3">
            <LogIn class="w-4 h-4" />
            LOGIN WITH GOOGLE
          </button>
          <p class="text-[10px] text-zinc-600 uppercase tracking-widest pt-4 italic">
            Wholesale access requires verified account approval.
          </p>
        </div>
      {/if}
    </div>

    <!-- Links -->
    <div class="mt-12 space-y-4">
      {#if !$currentUser}
        <a href="/contact" class="text-xs font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-1">
          REQUEST AN ACCOUNT
        </a>
      {:else}
        <a href="/catalog" class="text-xs font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-1">
          RETURN TO SHOPPING
        </a>
      {/if}
    </div>
  </div>
</div>
