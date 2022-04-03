<script>
    import CheckListSelector from "./Components/CheckListSelector.svelte";
    import TreeView from "./Components/TreeView.svelte";
    import InputWithChips from "./Components/InputWithChips.svelte";
    import { onMount } from 'svelte';

    export let learners = [];
    export let reviewers = [];
    export let skills = [];
    export let skillsTree = [];

    let data = {};
    let brief_title;
    let brief_link;
    let assignmentType;
    let selectedReviewers = [];
    let selectedLearners = [];
    let submissionDatetime
    let learnerNamesSorted = [];
    let reviewerNamesSorted = [];

    let exemplar_radio;
    let brief_radio;

    $: {
        learnerNamesSorted = learners.sort();
        reviewerNamesSorted = reviewers.sort();
    }

    function getChecked() {
        var listOfTriples = [];
        data = skills;

        Object.entries(data).forEach((area) =>
            Object.entries(area[1].skills).forEach((skill) =>
                Object.entries(skill[1].checklistItems).forEach(
                    (checklistItem) => {
                        console.log(checklistItem);
                        if (checklistItem[1].checked)
                            listOfTriples.push(
                                checklistItem[1].checklist_item_triple
                            );
                    }
                )
            )
        );

        return listOfTriples;
    }


onMount(()=>exemplar_radio.setCustomValidity("You need to select a exemplar or brief type"))


function submit() {
        console.log("press submit");
        
        let data = {};

        data.author_email = "";
        data.brief_title = brief_title;
        data.upload_url = brief_link;
        data.brief_type = assignmentType;
        data.learners = selectedLearners;
        data.reviewers = selectedReviewers;

        const selected_checklist_item_triples = getChecked();

        if (selected_checklist_item_triples.length == 0) {
            alert("You have to at least one skill selected!");
            return;
        }

        data.selected_checklist_item_triples = JSON.stringify(
            selected_checklist_item_triples
        );


        let datetime = new Date(submissionDatetime);
        let date = datetime.toLocaleDateString("en-GB");
        let time = datetime.toLocaleTimeString("en-GB");
        data.deadline_date = date;
        data.deadline_time = time;

        data.review_deadline_date = date;
        data.review_deadline_time = time;
        data.final_deadline_date = date;
        data.final_deadline_time = time;

        console.log(data);
    }

    const setRadioGroupAsValid = ()=>{
        exemplar_radio.setCustomValidity("");
        brief_radio.setCustomValidity("");
    }

    const firstDictItemKey = (dict) => Object.keys(dict)[0];

    const firstDictItem = (dict) => dict[firstDictItemKey(dict)];
</script>


<div>
    <div id="assign-brief" class="outer_shell">
        <form on:submit|preventDefault={submit}>


            <section id="assignment_type">
                <label for="submission-datetime">Asignment Type:</label>
                <div class="radios">
                    <label class="radio" for="exemplar">
                        <input
                            type="radio"
                            id="exemplar"
                            name="brief_type"
                            bind:group={assignmentType}
                            bind:this={exemplar_radio}
                            value="exemplar"
                            on:input={setRadioGroupAsValid}
                        />
                        Exemplar</label
                    >
                    <label class="radio" for="brief">
                        <input
                            type="radio"
                            id="brief"
                            name="brief_type"
                            bind:group={assignmentType}
                            bind:this={brief_radio}
                            value="brief"
                            on:input={setRadioGroupAsValid}
                        />
                        Brief</label
                    >
                </div>
            </section>


            <section id="title">
                <label for="brief-title">Brief Title:</label>
                <input
                    type="text"
                    id="brief-title"
                    size=50
                    bind:value={brief_title}
                    placeholder="Add a title for the brief"
                    required
                />
                <span class="validity" />
            </section>


            <section id="drive_link">
                <label for="attach-brief">Google Drive Link</label>
                <div>
                    <input class = "extra-wide-input"
                        type="text"
                        bind:value={brief_link}
                        name="attach-brief"
                        id="attach-brief"
                        size=50
                        required
                    />
                    <span class="validity" />
                    <div>
                        Add a link to a Google drive folder shared with
                        cleachtas@gmail.com, containing the brief.)
                    </div>
                </div>
            </section>


            <section id="learner">
                <label for="learner">Assign a learner:</label>
                <div class="input-with-chips">
                    <InputWithChips 
                        placeholder = "Add a learner"
                        validationMessage = "Please select at least one learner"
                        bind:selectedItems = {selectedLearners} 
                        data = {learnerNamesSorted} />
                </div>
            </section>


            <section id="reviewer">
                <label for="learner">Reviewers</label>
                <div class="input-with-chips">
                    <InputWithChips 
                        placeholder = "Add a reviewer"
                        validationMessage = "Please select at least one reviwer"
                        bind:selectedItems = {selectedReviewers} 
                        data = {reviewerNamesSorted} />
                </div>
            </section>


            <section id="deadline">
                <label for="submission-datetime">Submission deadline:</label>
                <input id="submission-datetime" 
                    type="datetime-local" 
                    bind:value = {submissionDatetime}
                    required/>
                <span class="validity" />
            </section>

            <section id="checklist">
                <label for="">Checklist items</label>
                <CheckListSelector {skills} />
            </section>


            <section id="checklist">
                <label for="">Checklist items</label>
                <TreeView
                    branch={skillsTree}
                    itemClass={""}
                    leafClass={""}
                    selectedClass={"blue"}
                    expandIfDecendantSelected={true}
                />
            </section>
            <input id="submit" type="submit" value="Submit" />
        </form>
    </div>
</div>

<style>
    section {
        padding-bottom: 20px;
        display: flex;
    }

    section > label {
        min-width: 20%;
        max-width: 20%;
    }

    :global(.input-with-chips) {
        display: flex;
    }

    :global(input:invalid + span:after) {
        font-size: 2rem;
        color: red;
        content: "✖";
        padding-left: 5px;
    }

     :global(input:valid + span:after) {
        font-size: 2rem;
        color: green;
        content: "✓";
        padding-left: 5px;
    }
    :global(.blue) {
        color: blue;
        font-weight: 700;
    }
</style>
