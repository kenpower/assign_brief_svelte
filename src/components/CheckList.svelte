<script>
export let items={};
</script>

<div id="checklists">
{#each Object.entries(items) as [key, item]}
	<span for={item.id}>
		<label>
			<input  type="checkbox" bind:checked={item.checked} id={item.id}/>
			{item.checklist_item_description}
		</label>
	</span>
{/each}
</div>
		
<style>

#checklists {
  display: flex;
  flex-grow: 2;
  flex-direction: column;
}
	
span{	
	background: khaki;
	margin:1px;
}
</style>