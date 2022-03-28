<script>
import CheckList from "./CheckList.svelte"
export let skills = {};
let selectedSkill;	
let checklistItems = {};
	
$:{
	if(Object.entries(skills)[0] && !selectedSkill) 
		selectedSkill = Object.entries(skills)[0][1];
	
	if(selectedSkill) 
		checklistItems = selectedSkill.checklistItems;
}														 

</script>
<div id="skills">
	{#each Object.entries(skills) as [key, skill]}
	<span for = {skill.id} id={skill.id} 
				class:selected="{selectedSkill.skillName == skill.skillName}">
		<label>
			<input type = "radio" name="skill" value={skill.skillName} id = {skill.id}
					 on:click="{()=> selectedSkill = skill }"
						 checked="{selectedSkill == skill }">
		{skill.skillName}</label>
	</span>
	{/each}
</div>
<CheckList items={checklistItems}/>

<style>
#skills {
  min-width:25%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.selected {
  background: khaki;
}
</style>