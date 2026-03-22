<script lang="ts">
  import { Phone, Mail, MapPin } from 'lucide-svelte';
</script>

<div class="bg-[#0a0a0a] min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-serif mb-4">Get in Touch</h1>
      <p class="text-dark-muted">Have questions? We're here to help.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-dark-card p-6 rounded-lg text-center border border-dark-border">
        <Phone class="w-8 h-8 text-primary mx-auto mb-4" />
        <h3 class="font-medium mb-1">Phone</h3>
        <p class="text-dark-muted">1-800-PROTECT</p>
      </div>
      <div class="bg-dark-card p-6 rounded-lg text-center border border-dark-border">
        <Mail class="w-8 h-8 text-primary mx-auto mb-4" />
        <h3 class="font-medium mb-1">Email</h3>
        <p class="text-dark-muted">support@protectionvalley.com</p>
      </div>
      <div class="bg-dark-card p-6 rounded-lg text-center border border-dark-border">
        <MapPin class="w-8 h-8 text-primary mx-auto mb-4" />
        <h3 class="font-medium mb-1">Location</h3>
        <p class="text-dark-muted">Portland, Oregon</p>
      </div>
    </div>
  </div>
</div>
