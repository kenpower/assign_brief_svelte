<script>
import AssignBrief from "./AssignBrief.svelte"
import { onMount } from 'svelte';
import { d } from './data.js'	
	
let app={};
let theData = {};
let loaded=false;
let skillsHierarchy;

let promise = Promise.resolve([]);

const log = e => {console.log(e); return e;}

app.baseUrl= window.location.protocol + "//"+ window.location.hostname + ":" + window.location.port + "/ReviewSystem";
if(window.location.hostname == "localhost")
{
    app.baseUrl = window.location.protocol + "//"+ window.location.hostname + ":" + window.location.port;
}
	
const getValidId= (s) => s.replace(/[^\w]/g,''); //remove whitespace

function createSkillsHierarchy(skills)
{
    var skillsHierarchy = {};
    skills.forEach(skillRow=>
    {
        var areaName = skillRow[0];
        var areaId = getValidId(areaName);

        var skillName = skillRow[1];
        var skillId = getValidId(skillName);
        var checklistItemDescription = skillRow[2];
        var checklistItemId = getValidId(checklistItemDescription);

        if (!(areaId in skillsHierarchy))
            skillsHierarchy[areaId] = {"areaName":areaName, "skills":{}};
        if (!(skillId in skillsHierarchy[areaId]["skills"]))
            skillsHierarchy[areaId]["skills"][skillId] = {"skillName":skillName, "checklistItems":{}};
        var checklistItem = {}

        checklistItem["checklist_item_description"] = checklistItemDescription;
        checklistItem["checklist_item_triple"] = skillRow;
        skillsHierarchy[areaId]["skills"][skillId]["checklistItems"][checklistItemId] = checklistItem;

    });
    return skillsHierarchy;
}

app.baseUrl="https://gamecore.itcarlow.ie/ReviewSystemDev"
	
onMount(async () => {
// CORS prevents calling real endpoint
// const res = await fetch(app.baseUrl+'get_assign_brief_data');
// 			.then(response => response.json())
// 			.then(data => {
// 				console.log(data);
// 				theData = data;
// 			})
// 			.catch(error => {
// 				console.log("An Error");
// 				console.log(error);
// 			});
	
	//fake data
	theData = JSON.parse(d)
	skillsHierarchy = createSkillsHierarchy(theData.skills_table)
});

//Todo use await promise to handle data fetch async
	// 	{#await promise}
	// 	<p>...waiting for data</p>
	// {:then theData}
	// 	<AssignBrief learners = {theData["learner_names"]}/>
	// {:catch error}
	// 	<p style="color: red">{error.message}</p>
	// {/await}
</script>
{#if skillsHierarchy}
<AssignBrief 
	learners = {theData.learner_names} 
	reviewers = {theData.reviewer_names}
	skills = {skillsHierarchy} />
{/if}

<div id="assign-brief-complete" style="display: none">Your brief has been assigned.  Refresh this page to assign a new brief.</div>

