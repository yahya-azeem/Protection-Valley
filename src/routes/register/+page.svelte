<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { Lock, FileText, Upload, User, ShieldCheck } from 'lucide-svelte';
  import { currentUser, showToast } from '$lib/stores';

  let activeTab = $state<'retail' | 'wholesale'>('retail');

  // Fields
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let company = $state('');
  let businessType = $state('');
  let phone = $state('');
  let website = $state('');
  let salesTaxId = $state('');
  let proofName = $state('');
  let proofData = $state('');
  
  let loading = $state(false);
  let error = $state('');

  onMount(() => {
    // Check if wholesale was requested via URL query params
    const type = $page.url.searchParams.get('type');
    if (type === 'wholesale') {
      activeTab = 'wholesale';
    }
  });

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        showToast('Proof document must be under 5MB.');
        target.value = '';
        return;
      }
      
      proofName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        proofData = result.split(',')[1] || '';
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleRegister(e: SubmitEvent) {
    e.preventDefault();
    
    if (activeTab === 'wholesale' && !proofData) {
      error = 'Please upload a proof of sales tax document.';
      return;
    }

    loading = true;
    error = '';

    const payload = activeTab === 'retail' ? {
      name,
      email,
      password,
      role: 'retail'
    } : {
      name,
      email,
      password,
      role: 'wholesale',
      company,
      business_type: businessType,
      phone,
      website: website || undefined,
      sales_tax_id: salesTaxId,
      sales_tax_proof_name: proofName,
      sales_tax_proof_data: proofData
    };

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        currentUser.set({
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          token: data.token
        });

        if (activeTab === 'wholesale') {
          showToast('Wholesale application submitted! Access pending approval.');
        } else {
          showToast('Registration successful! Welcome to Protection Valley.');
        }
        
        window.location.href = '/catalog';
      } else {
        const err = await res.json();
        error = err.error || 'Registration failed. Please try again.';
      }
    } catch (err) {
      console.error('Registration error:', err);
      error = 'Could not connect to authentication server.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{activeTab === 'retail' ? 'Create Account' : 'Wholesale Application'} | Protection Valley</title>
  <meta name="description" content="Register an account with Protection Valley. Sign up for a consumer profile or apply for a tax-exempt wholesale contractor account." />
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-lg w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded mb-6 flex items-center justify-center">
        {#if activeTab === 'retail'}
          <User class="w-6 h-6 text-primary" />
        {:else}
          <ShieldCheck class="w-6 h-6 text-primary" />
        {/if}
      </div>
      <h1 class="text-3xl font-serif text-white mb-2">
        {activeTab === 'retail' ? 'Customer Registration' : 'Wholesale Application'}
      </h1>
      <p class="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
        {activeTab === 'retail' 
          ? 'Sign up to shop our premium collection and save.' 
          : 'Submit tax exempt permits to activate trade pricing.'}
      </p>
    </div>

    <!-- Tab Selection -->
    <div class="flex border-b border-white/10 mb-6 bg-[#0A0A0A] p-1 rounded-t">
      <button 
        onclick={() => { activeTab = 'retail'; error = ''; }}
        class="flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-lux rounded
          {activeTab === 'retail' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-white'}"
      >
        Retail Account
      </button>
      <button 
        onclick={() => { activeTab = 'wholesale'; error = ''; }}
        class="flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-lux rounded
          {activeTab === 'wholesale' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-white'}"
      >
        Wholesale Contractor
      </button>
    </div>

    <!-- Register Form Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded shadow-2xl space-y-6 text-left">
      <form onsubmit={handleRegister} class="space-y-4">
        {#if error}
          <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded">
            {error}
          </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="reg-name" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
            <input 
              id="reg-name"
              type="text" 
              bind:value={name}
              required
              placeholder="John Doe" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>

          <div>
            <label for="reg-email" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
            <input 
              id="reg-email"
              type="email" 
              bind:value={email}
              required
              placeholder="john@example.com" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>
        </div>

        <div>
          <label for="reg-password" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Password</label>
          <input 
            id="reg-password"
            type="password" 
            bind:value={password}
            required
            placeholder="Min. 8 characters" 
            class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
          />
        </div>

        {#if activeTab === 'wholesale'}
          <div class="border-t border-white/5 pt-6 my-4 space-y-4">
            <h3 class="text-xs font-serif text-primary uppercase tracking-wider mb-2">Business Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="reg-company" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Company Name</label>
                <input 
                  id="reg-company"
                  type="text" 
                  bind:value={company}
                  required={activeTab === 'wholesale'}
                  placeholder="Gear Pro LLC" 
                  class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
                />
              </div>

              <div>
                <label for="reg-business-type" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Business Type</label>
                <select 
                  id="reg-business-type"
                  bind:value={businessType}
                  required={activeTab === 'wholesale'}
                  class="w-full bg-[#141414] border border-white/10 text-zinc-300 rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
                >
                  <option value="" disabled selected>Select Business Type</option>
                  <option value="Contractor">Contractor / Builder</option>
                  <option value="Retailer">Retailer / Shop Owner</option>
                  <option value="Distributor">Wholesaler / Distributor</option>
                  <option value="Other">Other Professional</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="reg-phone" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Phone Number</label>
                <input 
                  id="reg-phone"
                  type="tel" 
                  bind:value={phone}
                  required={activeTab === 'wholesale'}
                  placeholder="+1 (469) 555-0199" 
                  class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
                />
              </div>

              <div>
                <label for="reg-website" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Website (Optional)</label>
                <input 
                  id="reg-website"
                  type="url" 
                  bind:value={website}
                  placeholder="www.company.com" 
                  class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
                />
              </div>
            </div>

            <div class="border-t border-white/5 pt-4">
              <h3 class="text-xs font-serif text-primary uppercase tracking-wider mb-4">Tax Exempt Verification</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="reg-tax-id" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Sales Tax ID / Permit Number</label>
                  <input 
                    id="reg-tax-id"
                    type="text" 
                    bind:value={salesTaxId}
                    required={activeTab === 'wholesale'}
                    placeholder="TX-123456789-0" 
                    class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
                  />
                </div>

                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Proof of Sales Tax (Certificate / Document)</label>
                  <label class="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-primary/50 bg-[#141414] hover:bg-[#1a1a1a] transition-lux rounded p-6 cursor-pointer text-center group">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      onchange={handleFileChange}
                      class="hidden"
                    />
                    {#if proofName}
                      <FileText class="w-8 h-8 text-primary mb-2" />
                      <span class="text-xs text-white max-w-xs truncate font-medium">{proofName}</span>
                      <span class="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider">Click to replace file</span>
                    {:else}
                      <Upload class="w-8 h-8 text-zinc-500 group-hover:text-primary transition-lux mb-2" />
                      <span class="text-xs text-zinc-400 group-hover:text-zinc-200 transition-lux font-medium">Upload PDF or Image certificate</span>
                      <span class="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider">Max size 5MB</span>
                    {/if}
                  </label>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <button 
          type="submit" 
          disabled={loading}
          class="apple-btn w-full mt-4 flex items-center justify-center gap-2"
        >
          {#if loading}
            <span>{activeTab === 'wholesale' ? 'Processing Application...' : 'Creating Account...'}</span>
          {:else}
            <span>{activeTab === 'wholesale' ? 'SUBMIT APPLICATION' : 'CREATE ACCOUNT'}</span>
          {/if}
        </button>
      </form>
    </div>

    <!-- Links -->
    <div class="mt-8 flex flex-col items-center gap-3">
      <a href="/login" class="text-xs font-semibold text-zinc-400 hover:text-white transition-lux border-b border-white/10 pb-1 uppercase tracking-widest">
        Already have an account? Sign In
      </a>
      <a href="/contact" class="text-xs font-semibold text-zinc-500 hover:text-white transition-lux uppercase tracking-widest">
        Contact Support
      </a>
    </div>
  </div>
</div>
