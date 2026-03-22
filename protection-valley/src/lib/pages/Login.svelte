<script lang="ts">
  import { base } from '$app/paths';
  import { currentUser, showPage, showToast } from '$lib/stores';

  function loginWithGoogle() {
    currentUser.login({ name: 'John Smith', email: 'john@gmail.com', role: 'retail', provider: 'google' });
    showToast('Signed in with Google!');
    showPage('home');
  }

  function loginWithApple() {
    currentUser.login({ name: 'Jane Doe', email: 'jane@icloud.com', role: 'retail', provider: 'apple' });
    showToast('Signed in with Apple!');
    showPage('home');
  }

  let email = $state('');
  let password = $state('');

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (email === 'wholesale@protectionvalley.com' && password === 'password') {
      currentUser.login({ name: 'Wholesale Customer', email, role: 'wholesale' });
      showToast('Signed in as wholesale!');
    } else {
      currentUser.login({ name: 'Customer', email, role: 'retail' });
      showToast('Signed in!');
    }
    showPage('home');
  }
</script>

<div class="bg-[#0a0a0a] min-h-screen flex items-center justify-center py-12 px-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <img src="{base}/images/logo.png" alt="Protection Valley" class="h-16 w-auto mx-auto mb-4" />
      <h1 class="text-3xl font-serif mb-2">Welcome Back</h1>
      <p class="text-dark-muted">Sign in to access your account</p>
    </div>
    <div class="bg-dark-card rounded-lg p-8 border border-dark-border">
      <div class="space-y-3 mb-6">
        <button onclick={loginWithGoogle} class="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <button onclick={loginWithApple} class="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.22 7.13-.57 1.5-1.31 2.99-2.27 4.08zm-5.85-15.1c.07-1.74 1.54-3.25 3.28-3.39.29 2.32-2.13 4.5-3.28 3.39z"/></svg>
          Continue with Apple
        </button>
      </div>
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-dark-border"></div></div>
        <div class="relative flex justify-center"><span class="bg-dark-card px-4 text-sm text-dark-muted">Or continue with email</span></div>
      </div>
      <form onsubmit={handleSubmit}>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Email Address</label>
            <input type="email" bind:value={email} required class="w-full px-4 py-3 bg-[#0a0a0a] border border-dark-border rounded-lg focus:outline-none focus:border-primary text-dark-text" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input type="password" bind:value={password} required class="w-full px-4 py-3 bg-[#0a0a0a] border border-dark-border rounded-lg focus:outline-none focus:border-primary text-dark-text" placeholder="••••••••" />
          </div>
          <button type="submit" class="w-full btn-primary py-3">Sign In</button>
        </div>
      </form>
      <p class="mt-4 text-center text-sm text-dark-muted">
        Don't have an account? <span class="text-primary hover:underline cursor-pointer">Sign up</span>
      </p>
    </div>
  </div>
</div>
