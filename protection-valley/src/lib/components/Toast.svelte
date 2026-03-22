<script lang="ts">
  import { toastMessage, toastVisible } from '$lib/stores';
</script>

<div
  class="fixed bottom-4 right-4 bg-primary text-[#0a0a0a] px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50"
  class:translate-y-20={!$toastVisible}
  class:opacity-0={!$toastVisible}
>
  {$toastMessage}
</div>
