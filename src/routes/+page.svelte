<script lang="ts">
  import { base } from '$app/paths';
  import { currentPage } from '$lib/stores';
  import Home from '$lib/pages/Home.svelte';
  import Catalog from '$lib/pages/Catalog.svelte';
  import ProductDetail from '$lib/pages/ProductDetail.svelte';
  import About from '$lib/pages/About.svelte';
  import Contact from '$lib/pages/Contact.svelte';
  import Login from '$lib/pages/Login.svelte';
</script>

<svelte:head>
  <title>Protection Valley - Premium Workgear</title>
</svelte:head>

{#if $currentPage === 'home'}
  <Home />
{:else if $currentPage === 'catalog'}
  <Catalog />
{:else if $currentPage === 'product-detail'}
  <ProductDetail />
{:else if $currentPage === 'about'}
  <About />
{:else if $currentPage === 'contact'}
  <Contact />
{:else if $currentPage === 'login'}
  <Login />
{/if}
