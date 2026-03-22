<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isWholesale, showPage, showToast, loadProducts } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import CartSidebar from '$lib/components/CartSidebar.svelte';
  import SearchOverlay from '$lib/components/SearchOverlay.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  onMount(() => {
    loadProducts();

    // Handle OAuth Callback Params
    const token = $page.url.searchParams.get('token');
    const wholesale = $page.url.searchParams.get('wholesale');

    if (token) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('authToken', token);
        if (wholesale === 'true') {
          localStorage.setItem('userRole', 'wholesale');
          isWholesale.set(true);
          showToast('Authorized for Wholesale Access');
          showPage('catalog');
        }
      }
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('wholesale');
      window.history.replaceState({}, '', url);
    }
  });
</script>

<Navbar />
<SearchOverlay />

{@render children()}

<CartSidebar />
<Toast />
<Footer />
