<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isWholesale, showPage, showToast, loadProducts, cart, currentUser } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import CartSidebar from '$lib/components/CartSidebar.svelte';
  import CheckoutModal from '$lib/components/CheckoutModal.svelte';
  import SearchOverlay from '$lib/components/SearchOverlay.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  onMount(async () => {
    loadProducts();
    await currentUser.refreshSession();

    const token = $page.url.searchParams.get('token');
    const wholesale = $page.url.searchParams.get('wholesale');
    const checkout = $page.url.searchParams.get('checkout');
    const sessionId = $page.url.searchParams.get('session_id');

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
      if (sessionId) {
        confirmCheckout(sessionId);
      }
    }

    if (checkout === 'cancel') {
      showToast('Checkout canceled. Your cart is still available.');
    }

    if (token || wholesale || checkout || sessionId) {
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('wholesale');
      url.searchParams.delete('checkout');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url);
    }
  });

  async function confirmCheckout(sessionId: string) {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const { API_CONFIG } = await import('$lib/config');
      const res = await fetch(`${API_CONFIG.baseUrl}/checkout/confirm`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ session_id: sessionId })
      });
      if (res.ok) {
        const order = await res.json();
        showToast(`Order ${order.id} confirmed successfully!`);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Failed to confirm order with backend');
      }
    } catch (e) {
      console.error('Error confirming order:', e);
      showToast('Connection error during order confirmation');
    }
  }
</script>

<Navbar />
<SearchOverlay />

{@render children()}

<CartSidebar />
<CheckoutModal />
<Toast />
<Footer />
