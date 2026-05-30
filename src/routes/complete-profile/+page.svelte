<script lang="ts">
  import { Lock, FileText, Upload } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { currentUser, showToast } from '$lib/stores';

  let company = $state('');
  let salesTaxId = $state('');
  let proofName = $state('');
  let proofData = $state('');
  let loading = $state(false);
  let error = $state('');

  // Extract temporary token from query parameters, or fallback to stored token
  const token = $page.url.searchParams.get('token') || (typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : '') || '';

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

  async function handleCompleteProfile(e: SubmitEvent) {
    e.preventDefault();
    
    if (!token) {
      error = 'Session expired. Please sign in again.';
      return;
    }

    if (!proofData) {
      error = 'Please upload a proof of sales tax document.';
      return;
    }

    loading = true;
    error = '';

    try {
      const res = await fetch('/api/v1/auth/complete-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
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

        showToast('Profile completed! Wholesale access active.');
        window.location.href = '/catalog';
      } else {
        const err = await res.json();
        error = err.error || 'Failed to submit profile. Please try again.';
      }
    } catch (err) {
      console.error('Complete profile error:', err);
      error = 'Could not connect to server.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Complete Wholesale Profile | Protection Valley</title>
  <meta name="description" content="Submit your company sales tax registration details to verify and activate your wholesale access at Protection Valley." />
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
  <div class="max-w-md w-full px-4 text-center">
    <!-- Icon & Brand Area -->
    <div class="mb-8 text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded mb-6 flex items-center justify-center">
        <Lock class="w-6 h-6 text-primary" />
      </div>
      <h1 class="text-3xl font-serif text-white mb-2">
        Complete Wholesale Profile
      </h1>
      <p class="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
        Submit tax details to activate your wholesale access.
      </p>
    </div>

    <!-- Form Area -->
    <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded shadow-2xl space-y-6 text-left">
      {#if !token}
        <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded text-center">
          Session expired or invalid token. Please log in again.
        </div>
        <a href="/login" class="apple-btn w-full flex items-center justify-center gap-2 mt-4">
          <span>GO TO SIGN IN</span>
        </a>
      {:else}
        <form onsubmit={handleCompleteProfile} class="space-y-4">
          {#if error}
            <div class="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded">
              {error}
            </div>
          {/if}

          <div>
            <label for="complete-company" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Company Name</label>
            <input 
              id="complete-company"
              type="text" 
              bind:value={company}
              required
              placeholder="Gear Pro LLC" 
              class="w-full bg-[#141414] border border-white/10 text-white rounded p-3 text-sm focus:outline-none focus:border-primary/50 transition-lux"
            />
          </div>

          <div>
            <label for="complete-tax-id" class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Sales Tax ID / Permit Number</label>
            <input 
              id="complete-tax-id"
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

          <button 
            type="submit" 
            disabled={loading}
            class="apple-btn w-full mt-4 flex items-center justify-center gap-2"
          >
            {#if loading}
              <span>Submitting Profile...</span>
            {:else}
              <span>COMPLETE PROFILE</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </div>
</div>
