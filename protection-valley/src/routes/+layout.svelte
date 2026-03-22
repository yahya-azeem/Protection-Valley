<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import CartSidebar from '$lib/components/CartSidebar.svelte';
  import SearchOverlay from '$lib/components/SearchOverlay.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<Navbar />
<SearchOverlay />

{@render children()}

<CartSidebar />
<Toast />
<Footer />
