<script lang="ts">
  import { base } from '$app/paths';
  import { isWholesale, showToast, showPage } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';

  function handleLoginSuccess() {
    isWholesale.set(true);
    showToast('Authorized for Wholesale Access');
    showPage('catalog');
  }

  // Real OAuth triggers
  function triggerGoogleLogin() {
    window.location.href = API_CONFIG.baseUrl + API_CONFIG.endpoints.google_login;
  }

  function triggerAppleLogin() {
    handleLoginSuccess();
  }
</script>

<div class="min-h-[80vh] bg-black flex flex-col items-center justify-center p-6 antialiased">
  <div class="max-w-md w-full bg-dark-surface border border-white/5 p-12 md:p-16 space-y-16 rounded-sm shadow-2xl relative overflow-hidden">
    <!-- Subtle Gradient Highlight -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
    
    <div class="flex flex-col items-center space-y-8 text-center">
      <div class="w-24 h-24 bg-black border border-white/10 rounded-full p-0 flex items-center justify-center overflow-hidden shadow-gold group">
        <img src="{base}/images/logo-v3.png" alt="Protection Valley" class="w-full h-full object-contain group-hover:scale-110 transition-lux" />
      </div>
      <div class="space-y-4">
        <h2 class="text-4xl font-serif text-white tracking-tight italic">Registry</h2>
        <p class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Authorized Personnel Only</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Google OAuth Button -->
      <button 
        onclick={triggerGoogleLogin}
        class="w-full bg-white text-black h-16 flex items-center justify-center space-x-4 group hover:bg-primary transition-lux"
      >
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span class="text-[0.7rem] font-bold uppercase tracking-[0.4em]">Continue with Google</span>
      </button>

      <!-- Apple OAuth Button -->
      <button 
        onclick={triggerAppleLogin}
        class="w-full bg-black text-white border border-white/20 h-16 flex items-center justify-center space-x-4 group hover:bg-zinc-900 hover:border-white/40 transition-lux"
      >
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05 1.78-3.3 1.78-1.2 0-1.63-.73-3.13-.73-1.48 0-1.98.71-3.13.71-1.18 0-2.38-.93-3.38-1.93-2.13-2.12-3.73-6.02-3.73-9.4 0-5.38 3.5-8.23 6.9-8.23 1.75 0 3.1 1.05 4.18 1.05.98 0 2.58-1.18 4.65-1.18 1.73 0 4.1.83 5.48 2.85-2.8 1.63-2.33 5.15.5 6.43-.98 2.3-2.48 4.63-4.52 6.65M13.73 3.51c.95-1.15 1.58-2.73 1.58-4.28 0-.23-.03-.45-.08-.68-1.35.05-3.05.9-4.03 2.05-.88 1-.1.53-2.58 2.53-4.13.03.23.05.45.05.65 0 1.5.15 2.8.9 3.86" />
        </svg>
        <span class="text-[0.7rem] font-bold uppercase tracking-[0.4em]">Continue with Apple</span>
      </button>
    </div>

    <div class="pt-8 border-t border-white/5 text-center">
      <p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-zinc-600">
        Accessing the wholesale collection requires professional credentials.
      </p>
    </div>
  </div>
</div>
