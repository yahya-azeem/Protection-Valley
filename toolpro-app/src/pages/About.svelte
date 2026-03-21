<script lang="ts">
  import { navigate } from '../lib/router'
  import { Award, Users, Truck, Shield } from 'lucide-svelte'
</script>

<svelte:head>
  <title>About Us - ToolPro Supply</title>
  <meta name="description" content="Learn about ToolPro Supply's commitment to providing professional-grade tools for every trade." />
</svelte:head>

<div class="min-h-screen">
  <!-- Hero -->
  <section class="relative py-24 bg-gray-900">
    <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('/images/about-hero.jpg');" />
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h1 class="text-5xl md:text-6xl font-serif mb-6">Our Story</h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">
        Building success, one tool at a time. We've been serving professionals 
        with quality tools since 2010.
      </p>
    </div>
  </section>

  <!-- Mission -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-primary font-medium tracking-widest uppercase mb-4">Our Mission</p>
          <h2 class="text-4xl font-serif mb-6">Empowering Professionals with Quality Tools</h2>
          <p class="text-gray-600 mb-4">
            At ToolPro Supply, we believe that quality tools are the foundation of quality work. 
            That's why we've dedicated ourselves to sourcing and providing only the best professional-grade 
            tools for handymen, construction workers, electricians, and DIY enthusiasts.
          </p>
          <p class="text-gray-600 mb-6">
            From power tools to hand tools, from measuring equipment to storage solutions, 
            we offer a comprehensive range of products that meet the highest standards of 
            durability, performance, and value.
          </p>
          <button 
            class="btn-primary"
            on:click={() => navigate('/products')}
          >
            Explore Our Products
          </button>
        </div>
        <div class="relative">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="/images/about-mission.jpg" 
              alt="Our workshop"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Values -->
  <section class="py-20 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-primary font-medium tracking-widest uppercase mb-2">Our Values</p>
        <h2 class="text-4xl font-serif">What We Stand For</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each [
          { icon: Award, title: 'Quality First', description: 'We only stock tools that meet our rigorous quality standards.' },
          { icon: Users, title: 'Customer Focus', description: 'Your success is our success. Were here to support you.' },
          { icon: Truck, title: 'Fast Shipping', description: 'Get your tools when you need them with our quick delivery.' },
          { icon: Shield, title: 'Satisfaction Guaranteed', description: 'Every purchase is backed by our commitment to your satisfaction.' }
        ] as value}
          <div class="bg-white p-8 rounded-lg text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svelte:component this={value.icon} class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-medium mb-2">{value.title}</h3>
            <p class="text-gray-600">{value.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Team -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-primary font-medium tracking-widest uppercase mb-2">Our Team</p>
        <h2 class="text-4xl font-serif">Meet the People Behind ToolPro</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each [
          { name: 'Michael Torres', role: 'Founder & CEO', image: '/images/team-1.jpg' },
          { name: 'Sarah Chen', role: 'Operations Manager', image: '/images/team-2.jpg' },
          { name: 'David Rodriguez', role: 'Product Specialist', image: '/images/team-3.jpg' }
        ] as member}
          <div class="text-center">
            <div class="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name}
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="text-xl font-medium">{member.name}</h3>
            <p class="text-gray-600">{member.role}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 bg-primary">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h2 class="text-4xl font-serif mb-6">Ready to Get Started?</h2>
      <p class="text-xl text-white/80 mb-8">
        Browse our collection of professional tools and experience the ToolPro difference.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          class="bg-white text-primary px-8 py-4 font-medium hover:bg-gray-100 transition-colors"
          on:click={() => navigate('/products')}
        >
          Shop Now
        </button>
        <button 
          class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-primary transition-colors"
          on:click={() => navigate('/contact')}
        >
          Contact Us
        </button>
      </div>
    </div>
  </section>
</div>
