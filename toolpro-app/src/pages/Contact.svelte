<script lang="ts">
  import { Mail, Phone, MapPin, Clock, Send } from 'lucide-svelte'

  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
  let submitted = false
  let loading = false

  async function handleSubmit() {
    loading = true
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    submitted = true
    loading = false
  }
</script>

<svelte:head>
  <title>Contact Us - ToolPro Supply</title>
  <meta name="description" content="Get in touch with ToolPro Supply. We're here to help with your tool needs." />
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Hero -->
  <section class="bg-gray-900 py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h1 class="text-5xl font-serif mb-6">Get in Touch</h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">
        Have questions about our products or need help with an order? 
        We're here to help you find the right tools for your job.
      </p>
    </div>
  </section>

  <!-- Contact Info Cards -->
  <section class="py-16 -mt-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each [
          { icon: Phone, title: 'Phone', content: '1-800-TOOLPRO', sub: 'Mon-Fri 8am-6pm EST' },
          { icon: Mail, title: 'Email', content: 'support@toolprosupply.com', sub: '24/7 support' },
          { icon: MapPin, title: 'Address', content: '123 Tool Street', sub: 'Industrial City, IC 12345' },
          { icon: Clock, title: 'Hours', content: 'Mon-Fri: 8am-6pm', sub: 'Sat: 9am-4pm' }
        ] as info}
          <div class="bg-white rounded-lg p-6 shadow-sm text-center">
            <div class="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svelte:component this={info.icon} class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-medium mb-1">{info.title}</h3>
            <p class="text-gray-800">{info.content}</p>
            <p class="text-sm text-gray-500">{info.sub}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Contact Form -->
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Form -->
        <div class="bg-white rounded-lg p-8">
          {#if submitted}
            <div class="text-center py-12">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send class="w-8 h-8 text-green-600" />
              </div>
              <h2 class="text-2xl font-serif mb-2">Message Sent!</h2>
              <p class="text-gray-600">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
          {:else}
            <h2 class="text-2xl font-serif mb-6">Send Us a Message</h2>
            
            <form on:submit|preventDefault={handleSubmit} class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">Your Name *</label>
                  <input 
                    type="text"
                    bind:value={formData.name}
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Email Address *</label>
                  <input 
                    type="email"
                    bind:value={formData.email}
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Subject *</label>
                <select 
                  bind:value={formData.subject}
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Status</option>
                  <option value="product">Product Question</option>
                  <option value="wholesale">Wholesale Application</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Message *</label>
                <textarea 
                  bind:value={formData.message}
                  required
                  rows={6}
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                class="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Message'}
                {#if !loading}
                  <Send class="w-5 h-5" />
                {/if}
              </button>
            </form>
          {/if}
        </div>

        <!-- Map & Additional Info -->
        <div class="space-y-8">
          <div class="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            <div class="text-center text-gray-500">
              <MapPin class="w-12 h-12 mx-auto mb-2" />
              <p>Interactive Map</p>
              <p class="text-sm">123 Tool Street, Industrial City</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6">
            <h3 class="text-xl font-medium mb-4">Frequently Asked Questions</h3>
            <div class="space-y-4">
              {#each [
                { q: 'What are your shipping times?', a: 'Standard shipping takes 3-5 business days. Express options available.' },
                { q: 'Do you offer wholesale pricing?', a: 'Yes! Create a wholesale account to save up to 30% on bulk orders.' },
                { q: 'What is your return policy?', a: 'We offer 30-day returns on all unused items in original packaging.' }
              ] as faq}
                <div class="border-b border-gray-100 pb-4 last:border-0">
                  <p class="font-medium mb-1">{faq.q}</p>
                  <p class="text-sm text-gray-600">{faq.a}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
