<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from '../lib/router'
  import { Truck, ShieldCheck, Wrench, Award } from 'lucide-svelte'

  let heroVisible = false
  let statsVisible = false

  onMount(() => {
    heroVisible = true
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            statsVisible = true
          }
        })
      },
      { threshold: 0.3 }
    )

    const statsSection = document.getElementById('stats-section')
    if (statsSection) observer.observe(statsSection)

    return () => observer.disconnect()
  })

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $100'
    },
    {
      icon: ShieldCheck,
      title: 'Quality Guarantee',
      description: 'All tools backed by manufacturer warranty'
    },
    {
      icon: Wrench,
      title: 'Expert Support',
      description: 'Professional advice from tool experts'
    },
    {
      icon: Award,
      title: 'Wholesale Pricing',
      description: 'Special rates for bulk orders'
    }
  ]

  const stats = [
    { value: 5000, suffix: '+', label: 'Products' },
    { value: 15000, suffix: '+', label: 'Happy Customers' },
    { value: 99, suffix: '%', label: 'Satisfaction' },
    { value: 24, suffix: 'h', label: 'Support' }
  ]
</script>

<svelte:head>
  <title>ToolPro Supply - Professional Tools for Every Trade</title>
  <meta name="description" content="Quality tools for handymen, construction workers, and electricians. Retail and wholesale options available." />
</svelte:head>

<!-- Hero Section -->
<section class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
  <!-- Background Image -->
  <div 
    class="absolute inset-0 bg-cover bg-center bg-fixed"
    style="background-image: url('/images/hero-bg.jpg');"
  />
  <div class="absolute inset-0 bg-black/50" />
  
  <!-- Content -->
  <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
    {#if heroVisible}
      <p class="text-primary font-medium tracking-widest uppercase mb-4 animate-fade-in">
        Professional Grade Tools
      </p>
      <h1 class="text-5xl md:text-7xl font-serif mb-6 animate-fade-in" style="animation-delay: 0.2s">
        Tools That Build<br/>Your Success
      </h1>
      <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in" style="animation-delay: 0.4s">
        From power tools to hand tools, we provide everything professionals need. 
        Quality guaranteed with wholesale pricing available.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.6s">
        <button 
          class="btn-primary text-lg px-8 py-4"
          on:click={() => navigate('/products')}
        >
          Shop Now
        </button>
        <button 
          class="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
          on:click={() => navigate('/about')}
        >
          Learn More
        </button>
      </div>
    {/if}
  </div>
  
  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
      <div class="w-1.5 h-3 bg-white/50 rounded-full" />
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each features as feature}
        <div class="text-center p-6 group">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
            <svelte:component this={feature.icon} class="w-8 h-8 text-primary group-hover:text-white transition-colors" />
          </div>
          <h3 class="text-lg font-medium mb-2">{feature.title}</h3>
          <p class="text-gray-500 text-sm">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Stats Section -->
<section id="stats-section" class="py-20 bg-primary">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {#each stats as stat}
        <div class="text-center text-white">
          <div class="text-5xl md:text-6xl font-serif mb-2">
            {#if statsVisible}
              <span class="counter">{stat.value.toLocaleString()}</span><span>{stat.suffix}</span>
            {:else}
              0{stat.suffix}
            {/if}
          </div>
          <p class="text-white/80">{stat.label}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Categories Preview -->
<section class="py-20 bg-background">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-primary font-medium tracking-widest uppercase mb-2">Browse by Category</p>
      <h2 class="text-4xl font-serif">Find What You Need</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each [
        { name: 'Power Tools', image: '/images/category-power.jpg', count: 150 },
        { name: 'Hand Tools', image: '/images/category-hand.jpg', count: 200 },
        { name: 'Electrical', image: '/images/category-electrical.jpg', count: 80 },
        { name: 'Measuring', image: '/images/category-measuring.jpg', count: 60 },
        { name: 'Storage', image: '/images/category-storage.jpg', count: 40 },
        { name: 'Safety', image: '/images/category-safety.jpg', count: 90 }
      ] as category}
        <button 
          class="group relative h-64 overflow-hidden rounded-lg"
          on:click={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
        >
          <div 
            class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style="background-image: url('{category.image}');"
          />
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h3 class="text-2xl font-serif mb-2">{category.name}</h3>
            <p class="text-sm text-white/80">{category.count} products</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gray-900">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-4xl md:text-5xl font-serif text-white mb-6">
      Ready to Get Started?
    </h2>
    <p class="text-xl text-gray-400 mb-8">
      Create a wholesale account today and save up to 30% on your tool purchases.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        class="btn-primary text-lg px-8 py-4"
        on:click={() => navigate('/login')}
      >
        Create Wholesale Account
      </button>
      <button 
        class="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
        on:click={() => navigate('/contact')}
      >
        Contact Sales
      </button>
    </div>
  </div>
</section>
