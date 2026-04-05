<script lang="ts">
  import { Shield } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Privacy Policy | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
        <Shield class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 class="text-4xl font-serif text-white">Privacy Policy</h1>
        <p class="text-sm text-zinc-500 uppercase tracking-widest mt-1">Last Updated: April 2024</p>
      </div>
    </div>

    <div class="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-400">
      <section>
        <h2 class="text-white font-serif text-2xl mb-4">Our Commitment</h2>
        <p>Protection Valley is committed to protecting your privacy. This policy outlines how we handle your personal information and data safely.</p>
      </section>

      <section>
        <h2 class="text-white font-serif text-xl mb-4">1. Data Collection</h2>
        <p>We only collect data necessary for fulfillment, such as shipping addresses and contact information provided during checkout or wholesale registration.</p>
      </section>

      <section>
        <h2 class="text-white font-serif text-xl mb-4">2. Security</h2>
        <p>All transactions are processed through secure payment gateways (Stripe/PayPal). We do not store full credit card information on our servers.</p>
      </section>
      
      <p class="text-xs pt-12 text-zinc-600 italic">This is a placeholder policy for specialized gear fulfillment.</p>
    </div>
  </div>
</div>
