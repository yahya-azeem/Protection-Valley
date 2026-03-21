<script lang="ts">
  import { onMount } from 'svelte'
  import { currentPath, matchRoute, getParams } from '../lib/router'

  export let path: string
  export let component: any

  let isMatch = false
  let params: Record<string, string> = {}

  onMount(() => {
    const unsubscribe = currentPath.subscribe(p => {
      isMatch = matchRoute(p, path)
      if (isMatch && path.includes(':')) {
        params = getParams(p, path) || {}
      }
    })
    return unsubscribe
  })
</script>

{#if isMatch}
  <svelte:component this={component} {...params} />
{/if}
