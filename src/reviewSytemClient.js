import { d } from "./data.js";

app = {};

app.baseUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port +
  "/ReviewSystem";
if (window.location.hostname == "localhost") {
  app.baseUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;
}

export const postBrief = (brief_data) => {
  console.log(brief_data);
  return;

  fetch(app.baseUrl + "/assign_brief", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brief_data),
  }).then((response) => {
    if (!response.ok) {
      app.r = response;
      response.text().then((t) => alert(t));

      console.log(response);
    } else {
      //TODO: load success page/component
      // document.getElementById("assign-brief").style.display = "none";
      // document.getElementById("assign-brief-complete").style.display =
      //   "block";
    }
    console.log(brief_data);
  });
};

export const getAssignBriefData = () => {
  // CORS prevents calling real endpoint
  fetch(app.baseUrl + "get_assign_brief_data")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      theData = data;
    })
    .catch((error) => {
      console.log("An Error");
      console.log(error);
    });

  //fake data
  theData = JSON.parse(d);
};

const getBriefData = async () => {
  const response = await fetch(app.baseUrl + "get_assign_brief_data");

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();

  return data;
};

export const getAssignBriefDataA = async () => {
  // CORS prevents calling real endpoint
  //data = await getBriefData();

  const p = await new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve("Success!"); // Yay! Everything went well!
    }, 500);
  });

  console.log(p);

  const data = JSON.parse(d);
  data.skillsHierarchy = createSkillsHierarchy(data.skills_table);
  data.skillsTree = createSkillsTree(data.skills_table);
  //fake data
  console.log(data);

  return data;
};

const getValidId = (s) => s.replace(/[^\w]/g, ""); //remove whitespace

function createSkillsHierarchy(skills) {
  var skillsHierarchy = {};
  skills.forEach((skillRow) => {
    var areaName = skillRow[0];
    var areaId = getValidId(areaName);

    var skillName = skillRow[1];
    var skillId = getValidId(skillName);
    var checklistItemDescription = skillRow[2];
    var checklistItemId = getValidId(checklistItemDescription);

    if (!(areaId in skillsHierarchy))
      skillsHierarchy[areaId] = { areaName: areaName, skills: {} };
    if (!(skillId in skillsHierarchy[areaId]["skills"]))
      skillsHierarchy[areaId]["skills"][skillId] = {
        skillName: skillName,
        checklistItems: {},
      };
    var checklistItem = {};

    checklistItem["checklist_item_description"] = checklistItemDescription;
    checklistItem["checklist_item_triple"] = skillRow;
    skillsHierarchy[areaId]["skills"][skillId]["checklistItems"][
      checklistItemId
    ] = checklistItem;
  });
  return skillsHierarchy;
}

function createSkillsTree(skills) {
  var skillsTree = {
    text: "areas",
    items: [],
  };
  skills.forEach((skillRow) => {
    var areaName = skillRow[0];
    var areaId = getValidId(areaName);

    var skillName = skillRow[1];
    var skillId = getValidId(skillName);

    var checklistItemDescription = skillRow[2];
    var checklistItemId = getValidId(checklistItemDescription);

    var areaNode = skillsTree.items.find((item) => item.id == areaId);
    if (!areaNode) {
      areaNode = {
        id: areaId,
        text: areaName,
        items: [],
      };
      skillsTree.items.push(areaNode);
    }
    var skillNode = areaNode.items.find((item) => item.id == skillId);
    if (!skillNode) {
      skillNode = {
        id: skillId,
        text: skillName,
        items: [],
      };
      areaNode.items.push(skillNode);
    }
    var checklistItemNode = skillNode.items.find(
      (item) => item.id == checklistItemId
    );
    if (!checklistItemNode) {
      checklistItemNode = {
        id: checklistItemId,
        text: checklistItemDescription,
      };
      skillNode.items.push(checklistItemNode);
    }
  });
  return skillsTree;
}
