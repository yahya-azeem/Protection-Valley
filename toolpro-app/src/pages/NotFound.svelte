<script lang="ts">
  import { navigate } from '../lib/router'
  import { Home, Search, ArrowLeft } from 'lucide-svelte'
</script>

<svelte:head>
  <title>Page Not Found - ToolPro Supply</title>
  <meta name="description" content="The page you're looking for doesn't exist." />
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center px-4">
  <div class="text-center max-w-lg">
    <!-- 404 Graphic -->
    <div class="mb-8">
      <div class="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Search class="w-16 h-16 text-primary" />
      </div>
      <h1 class="text-8xl font-serif text-primary mb-2">404</h1>
      <p class="text-2xl font-medium text-gray-800 mb-2">Page Not Found</p>
      <p class="text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        class="btn-primary flex items-center justify-center gap-2"
        on:click={() => navigate('/')}
      >
        <Home class="w-5 h-5" />
        Go Home
      </button>
      <button 
        class="btn-secondary flex items-center justify-center gap-2"
        on:click={() => window.history.back()}
      >
        <ArrowLeft class="w-5 h-5" />
        Go Back
      </button>
    </div>

    <!-- Quick Links -->
    <div class="mt-12 pt-8 border-t border-gray-200">
      <p class="text-sm text-gray-500 mb-4">Popular pages:</p>
      <div class="flex flex-wrap gap-3 justify-center">
        <button 
          class="px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:shadow-sm transition-all"
          on:click={() => navigate('/products')}
        >
          Products
        </button>
        <button 
          class="px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:shadow-sm transition-all"
          on:click={() => navigate('/about')}
        >
          About Us
        </button>
        <button 
          class="px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:shadow-sm transition-all"
          on:click={() => navigate('/contact')}
        >
          Contact
        </button>
        <button 
          class="px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:shadow-sm transition-all"
          on:click={() => navigate('/cart')}
        >
          Cart
        </button>
      </div>
    </div>
  </div>
</div>
