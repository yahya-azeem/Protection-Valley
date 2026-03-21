<script lang="ts">
  import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-svelte'
  import { navigate } from '../lib/router'

  const linkGroups = [
    {
      title: 'Products',
      links: [
        { label: 'Power Tools', href: '/products?category=Power+Tools' },
        { label: 'Hand Tools', href: '/products?category=Hand+Tools' },
        { label: 'Electrical', href: '/products?category=Electrical' },
        { label: 'Measuring', href: '/products?category=Measuring' },
        { label: 'Storage', href: '/products?category=Storage' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '#' },
        { label: 'Shipping', href: '#' },
        { label: 'Returns', href: '#' },
        { label: 'Warranty', href: '#' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ]
</script>

<footer class="bg-gray-900 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
      <!-- Brand -->
      <div class="lg:col-span-2">
        <button 
          class="text-3xl font-serif text-primary mb-4"
          on:click={() => navigate('/')}
        >
          ToolPro Supply
        </button>
        <p class="text-gray-400 mb-6 max-w-sm">
          Professional tools for handymen, construction workers, and electricians. 
          Quality you can trust at prices you'll love.
        </p>
        
        <!-- Contact Info -->
        <div class="space-y-3">
          <div class="flex items-center space-x-3 text-gray-400">
            <MapPin class="w-5 h-5 text-primary" />
            <span>123 Tool Street, Industrial City, IC 12345</span>
          </div>
          <div class="flex items-center space-x-3 text-gray-400">
            <Phone class="w-5 h-5 text-primary" />
            <span>1-800-TOOLPRO</span>
          </div>
          <div class="flex items-center space-x-3 text-gray-400">
            <Mail class="w-5 h-5 text-primary" />
            <span>support@toolprosupply.com</span>
          </div>
        </div>
      </div>

      <!-- Link Groups -->
      {#each linkGroups as group}
        <div>
          <h3 class="text-lg font-medium mb-4">{group.title}</h3>
          <ul class="space-y-3">
            {#each group.links as link}
              <li>
                <button 
                  class="text-gray-400 hover:text-primary transition-colors"
                  on:click={() => navigate(link.href)}
                >
                  {link.label}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Newsletter -->
    <div class="mt-12 pt-12 border-t border-gray-800">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-lg font-medium mb-2">Subscribe to our newsletter</h3>
          <p class="text-gray-400 text-sm">Get the latest deals and product updates</p>
        </div>
        <form class="flex w-full md:w-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            class="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary text-white"
          />
          <button 
            type="submit"
            class="px-6 py-3 bg-primary hover:bg-primary-dark transition-colors rounded-r-lg font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-gray-400 text-sm">
        © 2024 ToolPro Supply. All rights reserved.
      </p>
      
      <!-- Social Links -->
      <div class="flex items-center space-x-4">
        {#each socialLinks as social}
          <a 
            href={social.href}
            class="p-2 text-gray-400 hover:text-primary transition-colors"
            aria-label={social.label}
          >
            <svelte:component this={social.icon} class="w-5 h-5" />
          </a>
        {/each}
      </div>
      
      <!-- Legal Links -->
      <div class="flex items-center space-x-6 text-sm text-gray-400">
        <button class="hover:text-primary transition-colors">Privacy Policy</button>
        <button class="hover:text-primary transition-colors">Terms of Service</button>
      </div>
    </div>
  </div>
</footer>
