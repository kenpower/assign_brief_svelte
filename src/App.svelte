<script>
import AssignBrief from "./AssignBrief.svelte"
import { postBrief , getAssignBriefDataA} from './reviewSytemClient';
	
let promise = getAssignBriefDataA();

const log = e => {console.log(e); return e;}

</script>

{#await promise}
	<p>...waiting for data</p>
{:then theData}
	<AssignBrief 
		learners = {theData.learner_names} 
		reviewers = {theData.reviewer_names}
		skills = {theData.skillsHierarchy} 
		skillsTree = {theData.skillsTree} 
		/>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<div id="assign-brief-complete" style="display: none">Your brief has been assigned.  Refresh this page to assign a new brief.</div>

