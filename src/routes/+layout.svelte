<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isWholesale, showPage, showToast, loadProducts, cart } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import CartSidebar from '$lib/components/CartSidebar.svelte';
  import SearchOverlay from '$lib/components/SearchOverlay.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  onMount(() => {
    loadProducts();

    const token = $page.url.searchParams.get('token');
    const wholesale = $page.url.searchParams.get('wholesale');
    const checkout = $page.url.searchParams.get('checkout');

    if (token && typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
      if (wholesale === 'true') {
        localStorage.setItem('userRole', 'wholesale');
        isWholesale.set(true);
        showToast('Authorized for wholesale access');
        showPage('catalog');
      }
    }

    if (checkout === 'success') {
      cart.clear();
      showToast('Checkout complete. Thank you for your order.');
    }

    if (checkout === 'cancel') {
      showToast('Checkout canceled. Your cart is still available.');
    }

    if (token || wholesale || checkout) {
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('wholesale');
      url.searchParams.delete('checkout');
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
