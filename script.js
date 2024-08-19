document.addEventListener("DOMContentLoaded", () => {
    const treeContainer = document.getElementById("tree");
    const personList = document.getElementById("personList");
    let selectedMember = null;
    let members = {}; // Dictionary to map member IDs to elements

    function createMember(firstName, lastName) {
        const member = document.createElement("div");
        member.classList.add("member");
        
        const memberId = `${firstName}-${lastName}-${Date.now()}`; // Unique ID
        member.dataset.id = memberId;

        const info = document.createElement("div");
        info.classList.add("info");

        const nameLabel = document.createElement("span");
        nameLabel.textContent = `${firstName} ${lastName}`;
        info.appendChild(nameLabel);

        member.appendChild(info);
        member.addEventListener("click", (event) => {
            event.stopPropagation();
            selectMember(member);
        });

        members[memberId] = member;
        updatePersonList();
        
        return member;
    }

    function addMember() {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const relationship = document.getElementById("relationship").value;

        if (!selectedMember && relationship !== "child") {
            alert("Please select a person first.");
            return;
        }

        const newMember = createMember(firstName, lastName);

        if (relationship === "child") {
            addChild(selectedMember, newMember);
        } else if (relationship === "sibling") {
            addSibling(selectedMember, newMember);
        } else if (relationship === "spouse") {
            addSpouse(selectedMember, newMember);
        }

        resetForm();
    }

    function resetForm() {
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("relationship").value = "child";
    }

    function selectMember(member) {
        if (selectedMember) {
            selectedMember.classList.remove("selected");
        }

        selectedMember = member;
        member.classList.add("selected");

        const memberId = member.dataset.id;
        const name = members[memberId].querySelector(".info span").textContent.split(" ");
        document.getElementById("editFirstName").value = name[0];
        document.getElementById("editLastName").value = name[1];
    }

    function updatePersonList() {
        personList.innerHTML = "";
        for (const id in members) {
            const member = members[id];
            const name = member.querySelector(".info span").textContent;

            const listItem = document.createElement("li");
            listItem.textContent = name;
            listItem.addEventListener("click", () => selectMember(member));

            personList.appendChild(listItem);
        }
    }

    function editMember() {
        if (!selectedMember) {
            alert("Please select a person first.");
            return;
        }

        const newFirstName = document.getElementById("editFirstName").value;
        const newLastName = document.getElementById("editLastName").value;

        const memberId = selectedMember.dataset.id;
        const nameLabel = members[memberId].querySelector(".info span");
        nameLabel.textContent = `${newFirstName} ${newLastName}`;

        resetForm();
        selectedMember.classList.remove("selected");
        selectedMember = null;
        updatePersonList();
    }

    function addChild(parent, child) {
        if (!parent) {
            treeContainer.appendChild(child);
        } else {
            let childContainer = parent.querySelector(".children");
            if (!childContainer) {
                childContainer = document.createElement("div");
                childContainer.classList.add("children");
                parent.appendChild(childContainer);
            }
            childContainer.appendChild(child);
        }
    }

    function addSibling(member, sibling) {
        const siblingContainer = member.parentNode;
        let siblingGroup = siblingContainer.querySelector(".sibling-container");
        if (!siblingGroup) {
            siblingGroup = document.createElement("div");
            siblingGroup.classList.add("sibling-container");
            siblingContainer.appendChild(siblingGroup);
        }
        siblingGroup.appendChild(sibling);
    }

    function addSpouse(member, spouse) {
        const spouseContainer = document.createElement("div");
        spouseContainer.classList.add("spouse-container");

        spouseContainer.appendChild(spouse);

        member.appendChild(spouseContainer);
    }

    // Event Listeners
    document.getElementById("addMemberButton").addEventListener("click", addMember);
    document.getElementById("editMemberButton").addEventListener("click", editMember);

    // Click anywhere to deselect
    document.addEventListener("click", () => {
        if (selectedMember) {
            selectedMember.classList.remove("selected");
            selectedMember = null;
        }
    });
});
