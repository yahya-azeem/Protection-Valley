<script lang="ts">
  import { FileText } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Terms of Service | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
        <FileText class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 class="text-4xl font-serif text-white">Terms of Service</h1>
        <p class="text-sm text-zinc-500 uppercase tracking-widest mt-1">Last Updated: April 2024</p>
      </div>
    </div>

    <div class="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-400">
      <section>
        <h2 class="text-white font-serif text-2xl mb-4">Acceptance of Terms</h2>
        <p>By accessing and using Protection Valley, you agree to comply with our shipping, returns, and wholesale terms.</p>
      </section>

      <section>
        <h2 class="text-white font-serif text-xl mb-4">1. Commercial Use</h2>
        <p>Items purchased via the wholesale portal are intended for resale or professional use only.</p>
      </section>

      <section>
        <h2 class="text-white font-serif text-xl mb-4">2. Returns</h2>
        <p>We offer a 30-day evaluation period for all gear. Custom or used items may be subject to restocking fees.</p>
      </section>

      <p class="text-xs pt-12 text-zinc-600 italic">This is a placeholder for specialized gear fulfillment terms.</p>
    </div>
  </div>
</div>
