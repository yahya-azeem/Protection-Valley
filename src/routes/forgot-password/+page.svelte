<script lang="ts">
  import { Lock, Mail, ArrowLeft } from 'lucide-svelte';
  import { showToast } from '$lib/stores';

  let email = $state('');
  let loading = $state(false);
  let error = $state('');
  let successMessage = $state('');

  async function handleForgotPassword(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = '';
    successMessage = '';

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        const data = await res.json();
        successMessage = data.message || 'Password reset instructions have been sent to your email address.';
        showToast('Reset email sent');
      } else {
        const err = await res.json();
        error = err.error || 'Failed to request password reset. Please try again.';
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      error = 'Could not connect to authentication server.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Forgot Password | Protection Valley</title>
  <meta name="description" content="Request a password reset link to recover access to your Protection Valley wholesale contractor account." />
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-md w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded mb-6 flex items-center justify-center">
        <Mail class="w-6 h-6 text-primary" />
      </div>
      <h1 class="text-3xl font-serif text-white mb-2">
        Reset Password
      </h1>
      <p class="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
        Enter your email to receive recovery instructions.
      </p>
    </div>

    <!-- Form Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded shadow-2xl space-y-6 text-left">
      {#if successMessage}
        <div class="space-y-4 text-center">
          <div class="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm rounded">
            {successMessage}
          </div>
          <p class="text-[10px] text-zinc-500 uppercase tracking-widest italic pt-2">
            Be sure to check your spam/junk folder if you do not receive the email.
          </p>
          <a href="/login" class="apple-btn w-full flex items-center justify-center gap-2 mt-4">
            <ArrowLeft class="w-4 h-4" />
            RETURN TO SIGN IN
          </a>
        </div>
      {:else}
        <form onsubmit={handleForgotPassword} class="space-y-4">
          {#if error}
            <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded">
              {error}
            </div>
          {/if}

          <div>
            <label for="forgot-email" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
            <input 
              id="forgot-email"
              type="email" 
              bind:value={email}
              required
              placeholder="name@company.com" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            class="apple-btn w-full mt-4 flex items-center justify-center gap-2"
          >
            {#if loading}
              <span>Sending...</span>
            {:else}
              <span>SEND RESET LINK</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <!-- Links -->
    <div class="mt-8">
      <a href="/login" class="text-xs font-semibold text-zinc-400 hover:text-white transition-lux border-b border-white/10 pb-1 uppercase tracking-widest flex items-center justify-center gap-2 w-max mx-auto">
        <ArrowLeft class="w-3.5 h-3.5" /> Back to Sign In
      </a>
    </div>
  </div>
</div>
