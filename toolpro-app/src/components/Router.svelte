<script lang="ts">
  import { onMount } from 'svelte'
  import { currentPath } from '../lib/router'

  onMount(() => {
    const handlePopState = () => {
      currentPath.set(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  })
</script>

<slot />
