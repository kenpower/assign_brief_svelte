<script>
	import { createEventDispatcher } from "svelte";
	import SVGIcon from "./SVGIcon.svelte";
	
	export let branch;
	export let level=0;
	export let itemClass;
	export let leafClass;
	export let selectedClass;
	export let expandIfDecendantSelected = true;
	export let showRoot = false;
	
	let selectedDecendents = new Set();
	let thisItemClasses;

	
	const dispatch = createEventDispatcher();
	const log = (m) =>{
		console.log("can contract",  canContract())
		console.log("expanded",  branch.expanded)
		console.log("selected",  branch.selected)
		console.log("leaf",  isLeaf())
		console.log("branch.expanded",branch.expanded);
	}
	
	$: { 	
		thisItemClasses =  "itemBox "		
					+ itemClass 
					+ (isLeaf() ? ' ' + leafClass : '')
					+ (branch.selected ? ' ' + selectedClass : '');
	}
	
  function toggle() {
		if (isLeaf())
			if(branch.selected == true)
				deselect();
			else
				select();

		if(branch.expanded){
			if(canContract())
    		branch.expanded = false;
		}
		else
			branch.expanded = true;
}
	
	const findSelectedChildren = (items) => {
		let s = new Set()
		if(items)
			items.forEach(i => {
				if(i.selected) s.add(i);
				if(i.items) s=new Set([...s, ...findSelectedChildren(i.items)])
			})
		return s
	}
	
 	const canContract = (i) => selectedDecendents.size == 0 || !expandIfDecendantSelected;
		
//  	const expandIcon = () => 
// 				branch.items
// 				? (branch.expanded ? ChevronDownIcon : ChevronRightIcon)
// 				: SpacerIcon;
	
	 $: expandIcon = () => 
				branch.items
				? (branch.expanded ? "chevron-down" : "chevron-right")
				: "blank";
	
	const isLeaf = () => !branch.items
	
	const select = _ => {
			console.log("selected", branch);
			branch.selected = true;	
			dispatch("itemToggled", branch);
	}
	
	const deselect = _ => {
			console.log("deselected", branch);
			branch.selected = false;	
			dispatch("itemToggled", branch);
	}
	
	const decendentToggled = e => 
	{
		console.log("decendentToggled", level)
		selectedDecendents = findSelectedChildren(branch.items);
		dispatch("itemToggled", e.detail);
	}
	
	const shouldShowRoot = ()  => showRoot || level > 0;
	
	if(branch.selected)
		select();
	
	selectedDecendents = findSelectedChildren(branch.items);
	
	if(selectedDecendents.size) 
		branch.expanded = true;
	
</script>
	{#if shouldShowRoot()}
  <div class={thisItemClasses}  on:click={toggle} >
				<SVGIcon name={expandIcon()}/> {branch.text} {level}
	</div>
	{/if}
	<div class:sub-group = "{shouldShowRoot()}">
	{#if !isLeaf() && branch.expanded}
		{#each branch.items as item}
			<svelte:self {...$$props} 
				branch={item}  
				level={level+1} 
				on:itemToggled={decendentToggled} />
		{/each}
	{/if}
</div>

<style>
.sub-group{
    margin-left: 1rem;		
}
	
.no-root{
    margin-left: 0rem;		
}
	
	.itemBox{
		cursor: pointer;
		display: flex;
	}
		.itemBox:hover{
		background-color: bisque;
	}
	
	.tree_icon{
		width: 1.5em;
    height: 1.5em;
		}
</style>