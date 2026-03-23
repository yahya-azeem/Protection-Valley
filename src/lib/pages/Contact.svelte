<script lang="ts">
  import { Phone, Mail, MapPin, Send, Globe } from 'lucide-svelte';

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let isSending = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    isSending = true;
    setTimeout(() => {
      alert('Message Received. Our concierge will contact you shortly.');
      isSending = false;
      name = ''; email = ''; message = '';
    }, 1500);
  }
</script>

<div class="bg-black min-h-screen text-white antialiased">
  <!-- Header -->
  <section class="pt-48 pb-16">
    <div class="max-w-7xl mx-auto px-6">
      <div class="space-y-6 mb-12">
        <span class="text-[0.65rem] font-bold uppercase tracking-[0.5em] text-primary">Inquiries</span>
        <h1 class="text-6xl md:text-8xl font-serif text-white tracking-tight leading-none">
          Contact<br/><span class="italic text-primary">Heritage.</span>
        </h1>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-24">
    <!-- Contact Info -->
    <div class="lg:col-span-5 space-y-20">
      <div class="space-y-12">
        <div class="flex items-start space-x-8 group">
          <div class="w-16 h-16 bg-dark-surface border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux">
            <Phone class="w-6 h-6 text-primary" />
          </div>
          <div class="space-y-2">
            <h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Telephone</h3>
            <p class="text-3xl font-serif tracking-tight">800-PRO-GEAR</p>
            <p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-zinc-600">Mon - Fri, 08:00 - 18:00 EST</p>
          </div>
        </div>

        <div class="flex items-start space-x-8 group">
          <div class="w-16 h-16 bg-dark-surface border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux">
            <Mail class="w-6 h-6 text-primary" />
          </div>
          <div class="space-y-2">
            <h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Electronic Mail</h3>
            <p class="text-2xl font-serif tracking-tight break-all">HQ@PROTECTIONVALLEY.COM</p>
          </div>
        </div>

        <div class="flex items-start space-x-8 group">
          <div class="w-16 h-16 bg-dark-surface border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux">
            <MapPin class="w-6 h-6 text-primary" />
          </div>
          <div class="space-y-2">
            <h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500">Studio HQ</h3>
            <p class="text-2xl font-serif tracking-tight">LOS ANGELES</p>
            <p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-zinc-600">1234 Industrial Way, Suite 100</p>
          </div>
        </div>
      </div>

      <div class="p-10 bg-dark-surface border border-white/5 rounded-sm">
        <h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary mb-6">Global Presence</h4>
        <div class="flex items-center space-x-6 text-zinc-500">
          <Globe class="w-10 h-10 opacity-20" />
          <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] leading-loose">
            Supporting exceptional trade professionals across North America, Europe, and Asia-Pacific.
          </p>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="lg:col-span-7">
      <div class="bg-dark-surface border border-white/10 p-10 md:p-16 shadow-2xl relative rounded-sm">
        <h2 class="text-3xl font-serif tracking-tight mb-12">Submit Inquiry</h2>
        
        <form onsubmit={handleSubmit} class="space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-3">
              <label for="name" class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500 ml-1">Name</label>
              <input 
                id="name"
                bind:value={name}
                required
                class="w-full bg-black border border-white/5 focus:border-primary/40 p-5 text-[0.7rem] font-bold uppercase tracking-[0.3em] outline-none transition-lux rounded-sm"
                placeholder="FIRST LAST"
              />
            </div>
            <div class="space-y-3">
              <label for="email" class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500 ml-1">Email</label>
              <input 
                id="email"
                type="email"
                bind:value={email}
                required
                class="w-full bg-black border border-white/5 focus:border-primary/40 p-5 text-[0.7rem] font-bold uppercase tracking-[0.3em] outline-none transition-lux rounded-sm"
                placeholder="NAME@DOMAIN.COM"
              />
            </div>
          </div>
          
          <div class="space-y-3">
            <label for="message" class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-zinc-500 ml-1">Message</label>
            <textarea 
              id="message"
              bind:value={message}
              required
              rows="6"
              class="w-full bg-black border border-white/5 focus:border-primary/40 p-5 text-[0.7rem] font-bold uppercase tracking-[0.3em] outline-none transition-lux rounded-sm resize-none"
              placeholder="HOW CAN WE ASSIST YOUR CRAFT?"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSending}
            class="w-full bg-white text-black font-bold uppercase tracking-[0.4em] py-6 flex items-center justify-center group transition-lux disabled:opacity-50 hover:bg-primary"
          >
            {#if isSending}
              <div class="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full mr-4"></div>
              Sending...
            {:else}
              <Send class="w-4 h-4 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-lux" />
              Send Brief
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
