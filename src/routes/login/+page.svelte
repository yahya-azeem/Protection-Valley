<script lang="ts" context="module">
  declare var google: any;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Lock, LogOut } from 'lucide-svelte';
  import { currentUser, showToast } from '$lib/stores';
  import { env } from '$env/dynamic/public';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  onMount(() => {
    // Initialize Google Sign-In button if script is loaded
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: env.PUBLIC_GOOGLE_CLIENT_ID || '158021442862-21a6g1lgrcddun4pvnvfe0ghv4905ej5.apps.googleusercontent.com',
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
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });
      
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        currentUser.set({
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          token: data.token
        });

        showToast('Google login successful');

        // Check if sales tax id is missing
        if (!user.sales_tax_id) {
          window.location.href = `/complete-profile?token=${data.token}`;
        } else {
          window.location.href = '/catalog';
        }
      } else {
        const err = await res.json();
        showToast(err.error || 'Google verification failed.');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      showToast('An error occurred during Google sign-in.');
    }
  }

  async function handlePasswordLogin(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        currentUser.set({
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          token: data.token
        });

        showToast('Login successful');

        // Check if sales tax id is missing
        if (!user.sales_tax_id) {
          window.location.href = `/complete-profile?token=${data.token}`;
        } else {
          window.location.href = '/catalog';
        }
      } else {
        const err = await res.json();
        error = err.error || 'Invalid email or password.';
      }
    } catch (err) {
      console.error('Login error:', err);
      error = 'Could not connect to authentication server.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Wholesale Portal | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-md w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded mb-6 flex items-center justify-center">
        <Lock class="w-6 h-6 text-primary" />
      </div>
      <h1 class="text-3xl font-serif text-white mb-2">
        Wholesale Portal
      </h1>
      <p class="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
        Access specialized wholesale pricing and bulk fulfillment.
      </p>
    </div>

    <!-- Login Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded shadow-2xl space-y-6">
      {#if $currentUser}
        <div class="space-y-4 text-center">
          <p class="text-xs text-zinc-500 uppercase tracking-widest">
            Logged in as: <span class="text-primary font-semibold">{$currentUser.email}</span>
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
        <!-- Password Login Form -->
        <form onsubmit={handlePasswordLogin} class="space-y-4 w-full text-left">
          {#if error}
            <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded">
              {error}
            </div>
          {/if}

          <div>
            <label for="login-email" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
            <input 
              id="login-email"
              type="email" 
              bind:value={email}
              required
              placeholder="name@company.com" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="login-password" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Password</label>
              <a href="/forgot-password" class="text-[10px] text-zinc-400 hover:text-white transition-lux uppercase tracking-wider font-semibold">Forgot?</a>
            </div>
            <input 
              id="login-password"
              type="password" 
              bind:value={password}
              required
              placeholder="••••••••" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            class="apple-btn w-full mt-4 flex items-center justify-center gap-2"
          >
            {#if loading}
              <span>Authenticating...</span>
            {:else}
              <span>SIGN IN</span>
            {/if}
          </button>
        </form>

        <div class="relative flex py-2 items-center w-full">
          <div class="flex-grow border-t border-white/5"></div>
          <span class="flex-shrink mx-4 text-[10px] text-zinc-600 uppercase tracking-widest">or</span>
          <div class="flex-grow border-t border-white/5"></div>
        </div>

        <div class="flex flex-col items-center space-y-4">
          <!-- Branded Google Sign-In Button Container -->
          <div id="google-btn" class="flex justify-center min-h-[44px]"></div>
          
          <p class="text-[10px] text-zinc-600 uppercase tracking-widest pt-2 italic">
            Wholesale access requires verified sales tax account.
          </p>
        </div>
      {/if}
    </div>

    <!-- Links -->
    <div class="mt-8 flex flex-col items-center gap-3">
      <a href="/register" class="text-xs font-semibold text-zinc-400 hover:text-white transition-lux border-b border-white/10 pb-1 uppercase tracking-widest">
        Register for Wholesale Account
      </a>
      <a href="/contact" class="text-xs font-semibold text-zinc-500 hover:text-white transition-lux uppercase tracking-widest">
        Contact Support
      </a>
    </div>
  </div>
</div>
