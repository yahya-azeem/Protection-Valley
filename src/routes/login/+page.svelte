<script lang="ts" context="module">
  declare var google: any;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Lock, LogOut } from 'lucide-svelte';
  import { currentUser } from '$lib/stores';
  import { env } from '$env/dynamic/public';

  onMount(() => {
    // Initialize Google Sign-In button if script is loaded
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: env.PUBLIC_GOOGLE_CLIENT_ID || '855476311029-79f874i7uubivt2525is5t1u62j8u55k.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        context: 'signin',
        ux_mode: 'popup',
        auto_select: false
      });

      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { 
          theme: 'outline', 
          size: 'large', 
          text: 'signin_with', 
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 300
        }
      );
    }
  });

  async function handleCredentialResponse(response: any) {
    try {
      // Send ID token to backend for verification and session creation
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });
      
      if (res.ok) {
        const data = await res.json();
        currentUser.set({
          email: data.email,
          name: data.name,
          role: data.role || 'Member',
          token: data.token
        });
        // Redirect to catalog
        window.location.href = '/catalog';
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  }
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
        <div class="space-y-4 text-center">
          <p class="text-[10px] text-zinc-500 uppercase tracking-widest">
            Logged in as: <span class="text-primary">{$currentUser.email}</span>
          </p>
          <button 
            onclick={() => currentUser.logout()}
            class="apple-btn w-full flex items-center justify-center gap-3"
          >
            <LogOut class="w-4 h-4" />
            SIGN OUT
          </button>
        </div>
      {:else}
        <div class="flex flex-col items-center space-y-4">
          <!-- Branded Google Sign-In Button Container -->
          <div id="google-btn" class="flex justify-center min-h-[44px]"></div>
          
          <p class="text-[10px] text-zinc-600 uppercase tracking-widest pt-4 italic">
            Wholesale access requires verified account approval.
          </p>
        </div>
      {/if}
    </div>

    <!-- Links -->
    <div class="mt-12">
      <a href="/contact" class="text-xs font-semibold text-zinc-500 hover:text-white transition-lux border-b border-white/10 pb-1 uppercase tracking-widest">
        Request an account
      </a>
    </div>
  </div>
</div>
