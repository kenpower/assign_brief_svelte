<script>
import { onMount } from 'svelte';
import Chip, { Set, TrailingAction, Text } from "@smui/chips";

export let data = [];
export let selectedItems = [];
export let placeholder = "";
export let validationMessage = "invalid selection";

let inputElement;

const setValididtyMessage = (el, msg) => el && el.setCustomValidity(msg);

const checkValid = () => setValididtyMessage(inputElement, selectedItems.length > 0 ? "" : validationMessage);

const addItem = (item) => {
    console.log("add:", item)
    const inListAndNotChoosen = () =>
        data.indexOf(item) >= 0 && selectedItems.indexOf(item) == -1;

    if (inListAndNotChoosen())
        selectedItems = [...selectedItems, item];
        
    checkValid();

    inputElement.value="";
 }

 const removeItem = (item) => {
     selectedItems = selectedItems.filter(i => i !== item);
    checkValid();
 }

onMount(() => checkValid());

</script>


<div class="input-with-chips">
    <input
        type="text"
        placeholder={placeholder}
        list="item-list"
        bind:this={inputElement}
        on:change={(e) => addItem(e.target.value)}
    />
    <span></span>
    <datalist id="item-list">
        {#each data as item}
            <option>{item}</option>
        {/each}
    </datalist>
    <Set chips={selectedItems} let:chip input>
        <Chip {chip}  on:SMUIChip:removal={(e)=>removeItem(e.detail.chipId)}>
            <Text>{chip}</Text>
            <TrailingAction icon$class="material-icons"
                >cancel</TrailingAction
            >
        </Chip>
    </Set>
</div>