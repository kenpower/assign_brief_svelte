<script>
import Skills from "./Skills.svelte"

export let skills = {}
	
let selectedAreaSkills = [];
let selectedArea;
let data = {};

$:{
	data = skills;
	if(Object.entries(data)[0]){
		selectedArea = Object.entries(data)[0][1]; 		
		selectedAreaSkills =  selectedArea["skills"]
	}
}
						
</script>

<div id="checklist_item_selector">
    <div id="areas">
			{#each Object.entries(data) as [key, area]}
				<input type="button" value={area.areaName} on:click= {() => selectedAreaSkills = area["skills"] }>
			{/each}
	</div>
	<div id="area-detail">
		<Skills skills={selectedAreaSkills} />
 	</div>
</div>

<style>
#areas {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

#area-detail {
  display: flex;
  flex-direction: row;
}
</style>