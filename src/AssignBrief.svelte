<script>
    import CheckListSelector from "./Components/CheckListSelector.svelte";
    import TreeView from "./Components/TreeView.svelte";
    import Chip, { Set, TrailingAction, Text } from "@smui/chips";
    //import { learner_names, reviewer_names } from './SkillsStore.js';
    //import { skillsTable} from './SkillsStore.js';
    export let learners = [];
    export let reviewers = [];
    export let skills = [];
    export let skillsTree = [];

    let data = {};
    let brief_title;
    let brief_link;
    let assignmentType;
    let selected_reviewers = [];
    let selected_learners = [];

    let learner_names_sorted = [];
    let reviewer_names_sorted = [];

    $: {
        learner_names_sorted = learners.sort();
        reviewer_names_sorted = reviewers.sort();
    }

    const inListAndNotChoosen = (name, mainList, choosenList) =>
        mainList.indexOf(name) >= 0 && choosenList.indexOf(name) == -1;

    const addLearner = (learner) => {
        if (
            inListAndNotChoosen(
                learner,
                learner_names_sorted,
                selected_learners
            )
        )
            selected_learners = [...selected_learners, learner];
    };

    const addReviewer = (reviewer) => {
        if (
            inListAndNotChoosen(
                reviewer,
                reviewer_names_sorted,
                selected_reviewers
            )
        )
            selected_reviewers = [...selected_reviewers, reviewer];
    };

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

    function submit() {
        console.log("press submit");
        let data = {};

        data.author_email = "";
        data.brief_title = brief_title;
        data.upload_url = brief_link;

        if (!assignmentType) {
            alert("You need to select a exemplar or brief type");
            return;
        }

        data.brief_type = assignmentType;
        data.learners = selected_learners;
        data.reviewers = selected_reviewers;

        const selected_checklist_item_triples = getChecked();

        if (selected_checklist_item_triples.length == 0) {
            alert("You have to at least one skill selected!");
            return;
        }

        data.selected_checklist_item_triples = JSON.stringify(
            selected_checklist_item_triples
        );

        var submissionDatetime = document.getElementById(
            "submission-datetime"
        ).value;
        if (submissionDatetime == "") {
            alert("You haven't set a submission date!");
            return;
        }
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
        //      fetch(app.baseUrl + '/assign_brief',
        //          {method:'POST',
        //              headers:{'Content-Type': 'application/json'},
        //              body: JSON.stringify(data)})
        //             .then(response => {
        //                 if (!response.ok) {
        //                     app.r = response;
        //                     response.text().then(t=>alert(t));
        //                     //alert(response);
        //                     console.log(response);

        //                 }
        //                 else
        //                 {
        //                     document.getElementById("assign-brief").style.display = "none";
        //                     document.getElementById("assign-brief-complete").style.display = "block";

        //                 }
        //                console.log(data);
        //             })
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
                            value="exemplar"
                        />
                        Exemplar</label
                    >

                    <label class="radio" for="brief">
                        <input
                            type="radio"
                            id="brief"
                            name="brief_type"
                            bind:group={assignmentType}
                            value="brief"
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
                    class="brief_title"
                    bind:value={brief_title}
                    placeholder="Add a title for the brief"
                    required
                />
            </section>
            <section id="drive_link">
                <label for="attach-brief">Google Drive Link</label>
                <div>
                    <input
                        style="width:100%"
                        type="text"
                        bind:value={brief_link}
                        name="attach-brief"
                        id="attach-brief"
                        required
                    />
                    <div>
                        Add a link to a Google drive folder shared with
                        cleachtas@gmail.com, containing the brief.)
                    </div>
                </div>
            </section>
            <section id="learner">
                <label for="learner">Assign a learner:</label>
                <div class="input-with-chips">
                    <input
                        type="text"
                        id="learners"
                        class="learner"
                        placeholder="Add a learner"
                        required
                        list="learner-list"
                        on:change={(e) => addLearner(e.target.value)}
                    />
                    <datalist id="learner-list">
                        {#each learner_names_sorted as learner}
                            <option>{learner}</option>
                        {/each}
                    </datalist>
                    <Set chips={selected_learners} let:chip input>
                        <Chip {chip}>
                            <Text>{chip}</Text>
                            <TrailingAction icon$class="material-icons"
                                >cancel</TrailingAction
                            >
                        </Chip>
                    </Set>
                </div>
            </section>
            <section id="reviewer">
                <label for="learner">Reviewers</label>
                <div class="input-with-chips">
                    <input
                        type="text"
                        id="reviewers"
                        class="reviewer"
                        placeholder="Add a reviewer"
                        required
                        list="reviewer-list"
                        on:change={(e) => addReviewer(e.target.value)}
                    />
                    <datalist id="reviewer-list">
                        {#each reviewer_names_sorted as reviewer}
                            <option>{reviewer}</option>
                        {/each}
                    </datalist>
                    <Set chips={selected_reviewers} let:chip input>
                        <Chip {chip}>
                            <Text>{chip}</Text>
                            <TrailingAction icon$class="material-icons"
                                >cancel</TrailingAction
                            >
                        </Chip>
                    </Set>
                </div>
            </section>

            <section id="deadline">
                <label for="submission-datetime">Submission deadline:</label>
                <input id="submission-datetime" type="datetime-local" />
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
            <input id="submit" type="button" value="Submit" />
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

    section > input,
    section > div {
        flex-grow: 1;
    }

    .input-with-chips {
        display: flex;
    }

    :global(.blue) {
        color: blue;
        font-weight: 700;
    }
</style>
