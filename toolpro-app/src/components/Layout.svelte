<script lang="ts">
  import Navbar from './Navbar.svelte'
  import Footer from './Footer.svelte'
  import CartSidebar from './CartSidebar.svelte'
  import { cartOpen } from '../stores/ui'
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />
  
  <main class="flex-1">
    <slot />
  </main>
  
  <Footer />
  
  <CartSidebar />
</div>
