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

    let learnerInput;
    let reviewerInput;
    
    const setValididtyMessage = (el, msg) => el && el.setCustomValidity(msg);

    const validateInput = (input, isValidPred, msg) => () =>  setValididtyMessage(input, isValidPred() ? "" : msg);

    const validateLearnerList = validateInput(learnerInput, () => (selected_learners.length >= 0),  "Please select at least one learner");
    const validateReviewerList = validateInput(reviewerInput, () => (selected_reviewers.length >= 0),  "Please select at least one reviewer");
    
    const inListAndNotChoosen = (name, mainList, choosenList) =>
        mainList.indexOf(name) >= 0 && choosenList.indexOf(name) == -1;
   
    const addLearner = (input, learner) => {
        if (
            inListAndNotChoosen(
                learner,
                learner_names_sorted,
                selected_learners
            )
        )
            selected_learners = [...selected_learners, learner];
        
        validateLearnerList();
        input.value="";

    };

    const removePerson = (removeAction, validator) => (name) =>{
        console.log("remove "+name);
        removeAction(name);
        validator();
    }

    const removeLearner = (learner) => removePerson(
        name => selected_learners = selected_learners.filter(l => l != name),
        validateLearnerList
        )(learner);

    const removeReviwer = (reviwer) => removePerson(
        name => selected_reviwers = selected_reviwers.filter(l => l != name),
        validatereviwerList
        )(reviwer);


    //todo : make addRevieer * learer a partial function also
    //handle brieftype validation like learnernsl;ist validation
    const addReviewer = (input, reviewer) => {
        if (
            inListAndNotChoosen(
                reviewer,
                reviewer_names_sorted,
                selected_reviewers
            )
        )
        selected_reviewers = [...selected_reviewers, reviewer];
        input.value="";
        validateReviewerList
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

function validateListNotEmpty(inputID, list, errorMessage) {
  const input = document.getElementById(inputID);

  input.setCustomValidity('');
  var valid = true
  if (list.length==0) {
      //console.log(inputID+" list too short")
      //console.dir(input)
      input.setCustomValidity(errorMessage);
      valid=false

  } 
  //console.log(inputID+" list too short")
  input.reportValidity();

  return valid;
}

var exemplar_radio = document.getElementById("exemplar");
//exemplar_radio.setCustomValidity("You need to select a exemplar or brief type");

function submit() {
        console.log("press submit");
        let data = {};

        data.author_email = "";
        data.brief_title = brief_title;
        data.upload_url = brief_link;

        
        var brief_radio = document.getElementById("brief");
        console.dir( brief_radio.validity);
        brief_radio.setCustomValidity("");
        if (!assignmentType) {
            brief_radio.setCustomValidity("You need to select a exemplar or brief type");
            brief_radio.reportValidity();
            return;
        }

        //learner_input = document.getElementById("learners")
        //if(!validateListNotEmpty("learners",selected_learners, 'Need at least one learner' )) return;

        //if(!validateListNotEmpty("reviewers",selected_learners, 'Need at least one reviewer' )) return;

        return;
        // if(selected_learners.length==0){
           
        //     document.getElementById("learners").setCustomValidity('You must select at least one learner');
        //     alert("You must select at least one learner");
        // }

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

    const setRadioGroupAsValid = (e)=>{
        console.dir(e.target);
        var groupName = e.target.name;
        var radios = document.getElementsByName( groupName );
        radios.forEach(r => r.setCustomValidity(""));
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
                    <input
                        type="text"
                        id="learners"
                        class="learner"
                        placeholder="Add a learner"
                        list="learner-list"
                        bind:this={learnerInput}
                        on:change={(e) => addLearner(e.target, e.target.value)}
                    />
                    <datalist id="learner-list">
                        {#each learner_names_sorted as learner}
                            <option>{learner}</option>
                        {/each}
                    </datalist>
                    <Set chips={selected_learners} let:chip input>
                        <Chip {chip}  on:SMUIChip:removal={(e)=>removeLearner(e.detail.chipId)}>
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
                        list="reviewer-list"
                         bind:this={reviewerInput}
                        on:change={(e) => addReviewer(e.target, e.target.value)}
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

    .input-with-chips {
        display: flex;
    }

    input:invalid + span:after {
        position: absolute;
        content: "✖";
        padding-left: 5px;
    }

    input:valid + span:after {
        position: absolute;
        content: "✓";
        padding-left: 5px;
    }
    :global(.blue) {
        color: blue;
        font-weight: 700;
    }
</style>
