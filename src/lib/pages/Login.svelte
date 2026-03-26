<script lang="ts">
  import { base } from '$app/paths';
  import { showToast } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';

  function triggerGoogleLogin() {
    window.location.href = API_CONFIG.baseUrl + API_CONFIG.endpoints.google_login;
  }

  function notifyPendingProvider() {
    showToast('Apple sign-in is not enabled yet. Use Google to access wholesale mode.');
  }
</script>

<div class="min-h-[80vh] bg-black flex flex-col items-center justify-center p-6 antialiased">
  <div class="max-w-sm w-full bg-[#0A0A0A] border border-white/10 p-10 space-y-8 rounded shadow-2xl relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

    <div class="flex flex-col items-center gap-4 text-center">
      <div class="w-16 h-16 bg-black border border-white/10 rounded-full p-0 flex items-center justify-center overflow-hidden">
        <img src="{base}/images/logo-v3.png" alt="Protection Valley" class="w-full h-full object-contain" />
      </div>
      <div>
        <h2 class="text-2xl font-serif text-white">Wholesale Sign In</h2>
        <p class="text-sm text-zinc-500 mt-1">Use Google OAuth to unlock bulk pricing</p>
      </div>
    </div>

    <div class="space-y-3">
      <button
        onclick={triggerGoogleLogin}
        class="w-full h-11 bg-white rounded flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
      >
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span class="text-sm font-medium text-gray-700">Continue with Google</span>
      </button>

      <button
        onclick={notifyPendingProvider}
        class="w-full h-11 bg-black rounded flex items-center justify-center gap-3 hover:bg-gray-900 active:bg-gray-800 transition-colors border border-gray-600"
      >
        <svg class="w-[15px] h-[18px]" viewBox="0 0 15 18" fill="white">
          <path d="M14.94 13.34c-.35.81-.52 1.17-.97 1.89-.63.99-1.52 2.23-2.62 2.24-1.0.01-1.26-.65-2.62-.64-1.36.01-1.65.65-2.65.64-1.1-.01-1.93-1.12-2.56-2.11C1.78 12.76.98 9.21 2.81 6.84c.64-.83 1.78-1.39 3-1.4 1.07-.02 2.08.72 2.73.72.65 0 1.87-.89 3.15-.76.54.02 2.04.22 3.0 1.63-2.65 1.62-2.2 4.85.25 6.31zM10.1 3.55c.49-.63.87-1.52.73-2.43-.82.06-1.78.57-2.34 1.24-.5.6-.93 1.52-.77 2.4.9.03 1.84-.5 2.38-1.21z" />
        </svg>
        <span class="text-sm font-medium text-white">Apple (coming soon)</span>
      </button>
    </div>

    <div class="pt-4 border-t border-white/10 text-center">
      <p class="text-xs text-zinc-500">Retail mode is available without login. Wholesale mode requires authentication.</p>
    </div>
  </div>
</div>
