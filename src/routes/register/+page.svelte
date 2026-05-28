<script lang="ts">
  import { Lock, FileText, Upload } from 'lucide-svelte';
  import { currentUser, showToast } from '$lib/stores';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let company = $state('');
  let salesTaxId = $state('');
  let proofName = $state('');
  let proofData = $state('');
  let loading = $state(false);
  let error = $state('');

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
        // Extract raw base64 data from Data URL
        proofData = result.split(',')[1] || '';
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleRegister(e: SubmitEvent) {
    e.preventDefault();
    
    if (!proofData) {
      error = 'Please upload a proof of sales tax document.';
      return;
    }

    loading = true;
    error = '';

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'wholesale',
          company,
          sales_tax_id: salesTaxId,
          sales_tax_proof_name: proofName,
          sales_tax_proof_data: proofData
        })
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        currentUser.set({
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          token: data.token
        });

        showToast('Registration successful! Wholesale access granted.');
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
  <title>Wholesale Registration | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-lg w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded mb-6 flex items-center justify-center">
        <Lock class="w-6 h-6 text-primary" />
      </div>
      <h1 class="text-3xl font-serif text-white mb-2">
        Wholesale Registration
      </h1>
      <p class="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
        Submit tax details to enable professional wholesale pricing.
      </p>
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
            <label for="reg-company" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Company Name</label>
            <input 
              id="reg-company"
              type="text" 
              bind:value={company}
              required
              placeholder="Gear Pro LLC" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>
        </div>

        <div>
          <label for="reg-email" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
          <input 
            id="reg-email"
            type="email" 
            bind:value={email}
            required
            placeholder="john@company.com" 
            class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
          />
        </div>

        <div>
          <label for="reg-password" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Password</label>
          <input 
            id="reg-password"
            type="password" 
            bind:value={password}
            required
            placeholder="••••••••" 
            class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
          />
        </div>

        <div class="border-t border-white/5 pt-4 my-4">
          <h3 class="text-xs font-serif text-primary uppercase tracking-wider mb-4">Tax Exempt Verification</h3>
          
          <div class="space-y-4">
            <div>
              <label for="reg-tax-id" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Sales Tax ID / Permit Number</label>
              <input 
                id="reg-tax-id"
                type="text" 
                bind:value={salesTaxId}
                required
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

        <button 
          type="submit" 
          disabled={loading}
          class="apple-btn w-full mt-4 flex items-center justify-center gap-2"
        >
          {#if loading}
            <span>Processing Application...</span>
          {:else}
            <span>SUBMIT APPLICATION</span>
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
