let main = document.getElementById("main");
let dialogEl = document.getElementById("c-character-detail");

let characters = "";

/*
##############
# FETCH DATA #
##############
*/
async function fetchAllCharacters() {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const characters = await response.json();
    return characters;
}
  
fetchAllCharacters().then(c => {
    characters = c.results;
    buildDOM();
});

async function fetchFilteredCharacters(name, status, specie, type, gender) {
    let concatString = ""

    if(name) {
        concatString += `name=${name}`
    }
    if(status) {
        concatString += `&status=${status}`
    }
    if(specie) {
        concatString += `&species=${specie}`
    }
    if(type) {
        concatString += `&type=${type}`
    }
    if(gender) {
        concatString += `&gender=${gender}`
    }

    const response = await fetch(`https://rickandmortyapi.com/api/character/?${concatString}`);
    const characters = await response.json();
    return characters;
}

/*
##########
# FILTER #
##########
*/
let elButtonFilter = document.getElementById("button-filter");

elButtonFilter.addEventListener("click", e => {
    e.preventDefault();

    let fName = document.getElementById("f-name").value;
    let fStatus = document.getElementById("f-status").value;
    let fSpecie = document.getElementById("f-specie").value;
    let fType = document.getElementById("f-type").value;
    let fGender = document.getElementById("f-gender").value;

    fetchFilteredCharacters(fName, fStatus, fSpecie, fType, fGender)
    .then(c => {
        characters = c.results;
        clearDOM();
        buildDOM();
    });
})


/*
###############
# BUILD CARDS #
###############
*/
// Clear DOM
function clearDOM() {
    main.innerHTML = "";
}

// Build cards
function buildDOM() {
    characters.forEach(c => {
        let cardEl = document.createElement("div");
        cardEl.className = "c-card"
    
        // Image
        let imgEl = document.createElement("img");
        imgEl.src = c.image;
    
        // Text container
        let textContainerEl = document.createElement("div");
        textContainerEl.className = "c-card__text-container"
    
        // Name
        let nameEl = document.createElement("h1");
        nameEl.className = "c-card__name";
        nameEl.textContent = c.name;
    
        // Gender
        let genderEl = document.createElement("p");
        genderEl.className = "c-card__gender";
        genderEl.innerHTML = `<b>Gender:</b> ${(c.gender == "unknown") ? "Unknown" : c.gender}`;
    
        // Status text
        let statusContainerEl = document.createElement("div");
        statusContainerEl.className ="c-card__status-container";
    
        let statusEl = document.createElement("p");
        statusEl.className = "c-card__status-text";
        statusEl.innerHTML = `<b>Status:</b> ${(c.status == "unknown") ? "Unknown" : c.status}`;
    
        let statusColorEl = document.createElement("div");
        statusColorEl.className = "c-card__status-color";
    
        // Status color
        switch (c.status) {
            case "Alive":
                statusColorEl.classList.add("c-card__status-color--alive");
                break;
    
            case "Dead":
                statusColorEl.classList.add("c-card__status-color--dead");
                break;
    
            case "unknown":
                statusColorEl.classList.add("c-card__status-color--unknown");
                break
        
            default:
                break;
        }
    
        // Set ID to card
        cardEl.id = c.id;
    
        // Create dialog onclick
        cardEl.onclick = () => {
            dialogEl.innerHTML =
            `
            <div class="c-character-detail__wrapper">
                <div class="c-character-detail__text-container">
                    <h2>${c.name}</h2>
                    <p><b>Status:</b> ${c.status == "unknown" ? "Unknown" : c.status}</p>
                    <p><b>Species:</b> ${c.species}</p>
                    <p><b>Type:</b> ${c.type ? c.type : "Unknown"}</p>
                    <p><b>Gender:</b> ${c.gender}</p>
                    <p><b>Origin:</b> ${c.origin.name == "unknown" ? "Unknown" : c.origin.name}</p>
                    <p><b>Location:</b> ${c.location.name == "unknown" ? "Unknown" : c.location.name}</p>
                </div>
                <img src="${c.image}" class="c-character-detail__image">
            </div>
            `;
            dialogEl.showModal();
        }
    
        // Build DOM
        statusContainerEl.appendChild(statusEl);
        statusContainerEl.appendChild(statusColorEl);
        
        textContainerEl.appendChild(nameEl);
        textContainerEl.appendChild(genderEl);
        textContainerEl.appendChild(statusContainerEl);
        
        cardEl.appendChild(imgEl);
        cardEl.appendChild(textContainerEl);
        
        main.appendChild(cardEl);
    
    })
    
    // On click outside of dialog, close
    function closeDialog(event) {
        if (!event.target.contains(dialogEl)) return;
        dialogEl.close();
    }
    
    document.addEventListener('click', closeDialog);
}