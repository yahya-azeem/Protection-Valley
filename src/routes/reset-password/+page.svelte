<script lang="ts">
  import { Lock, ArrowLeft, Check } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { showToast } from '$lib/stores';

  let newPassword = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state(false);

  // Extract token from query parameters
  const token = $page.url.searchParams.get('token') || '';

  async function handleResetPassword(e: SubmitEvent) {
    e.preventDefault();
    
    if (!token) {
      error = 'No reset token found. Please check your recovery link.';
      return;
    }

    if (newPassword !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }

    if (newPassword.length < 8) {
      error = 'Password must be at least 8 characters long.';
      return;
    }

    loading = true;
    error = '';

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword })
      });

      if (res.ok) {
        success = true;
        showToast('Password updated successfully');
      } else {
        const err = await res.json();
        error = err.error || 'Failed to reset password. The link may have expired.';
      }
    } catch (err) {
      console.error('Reset password error:', err);
      error = 'Could not connect to authentication server.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Reset Password | Protection Valley</title>
  <meta name="description" content="Choose a new secure password for your Protection Valley wholesale contractor account." />
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-md w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded mb-6 flex items-center justify-center">
        <Lock class="w-6 h-6 text-primary" />
      </div>
      <h1 class="text-3xl font-serif text-white mb-2">
        New Password
      </h1>
      <p class="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
        Set a secure password for your account.
      </p>
    </div>

    <!-- Form Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded shadow-2xl space-y-6 text-left">
      {#if !token}
        <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded text-center">
          Invalid recovery link. The reset token is missing.
        </div>
        <a href="/login" class="apple-btn w-full flex items-center justify-center gap-2 mt-4">
          <ArrowLeft class="w-4 h-4" />
          RETURN TO SIGN IN
        </a>
      {:else}
        {#if success}
          <div class="space-y-4 text-center">
            <div class="w-12 h-12 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check class="w-6 h-6" />
            </div>
            <div class="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm rounded">
              Your password has been reset successfully.
            </div>
            <a href="/login" class="apple-btn w-full flex items-center justify-center gap-2 mt-4">
              <span>SIGN IN</span>
            </a>
          </div>
        {:else}
          <form onsubmit={handleResetPassword} class="space-y-4">
            {#if error}
              <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded">
                {error}
              </div>
            {/if}

            <div>
              <label for="reset-new-pw" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">New Password</label>
              <input 
                id="reset-new-pw"
                type="password" 
                bind:value={newPassword}
                required
                placeholder="••••••••" 
                class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
              />
            </div>

            <div>
              <label for="reset-confirm-pw" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Confirm New Password</label>
              <input 
                id="reset-confirm-pw"
                type="password" 
                bind:value={confirmPassword}
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
                <span>Updating Password...</span>
              {:else}
                <span>UPDATE PASSWORD</span>
              {/if}
            </button>
          </form>
        {/if}
      {/if}
    </div>
  </div>
</div>
