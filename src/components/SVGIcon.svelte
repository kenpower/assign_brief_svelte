<script>
	export let name;
	
	if(!name) name= "blank";
</script>

<svg class="icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="{name +'svg-icon'}">	
{#if name == "chevron-down"}
		<path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
{:else if name == "chevron-right"}
		<path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
{:else if name == "blank"}
		<path d=""></path>
{:else}
	unknown icon
{/if}
	
</svg>
<style>
	.icon{
		width: 1.5em;
    height: 1.5em;
		}
</style>