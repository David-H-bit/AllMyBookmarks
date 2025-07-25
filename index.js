const body = document.querySelector("body");
const hero = document.querySelector("hero");
const bookmarksContainer = document.querySelector(".bookmarks-container")
const lightBtn = document.querySelector(".lightbtn");
const darkBtn = document.querySelector(".darkbtn");
const addBookmark = document.querySelector(".addBookmark")
const bookmarkModal = document.querySelector(".bookmarkModal");
const editBookmarkModal = document.querySelector(".editBookmarkModal");
const closeBookmarkModalBtn = document.getElementById("closeBookmarkModalBtn");
const addBookmarkModalBtn = document.getElementById("addBookmarkModalBtn");
const saveButton = document.getElementById("saveEditedBookmark");
const closeEditedBookmark = document.getElementById("closeEditedBookmark");
const searchInput = document.querySelector("[data-search]");

let currentlyEditingTitle = null;
let currentlyEditingUrl = null;
let currentlyEditingDesc = null;
let currentlyEditingLogo = null;
let bookmarks = loadFromLocalStorage();

function saveToLocalStorage(){
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
}

function loadFromLocalStorage(){
    const data = localStorage.getItem("bookmarks");
    return data ? JSON.parse(data) : [];
}

function toggleModes(activeBtn, inactiveBtn, className = "activated-btn"){
    if(activeBtn.classList.contains(className)) return;
    else{
        activeBtn.classList.add(className);
        inactiveBtn.classList.remove(className);
    }
}

addBookmark.addEventListener("click", ()=>{
    bookmarkModal.classList.toggle("hidden");
})

lightBtn.addEventListener("click", ()=>{
    toggleModes(lightBtn, darkBtn);
    document.documentElement.setAttribute("data-theme", "light");
})

darkBtn.addEventListener("click", ()=>{
    toggleModes(darkBtn, lightBtn);
    document.documentElement.setAttribute("data-theme", "dark");
})

closeBookmarkModalBtn.addEventListener("click", ()=>{
    bookmarkModal.classList.toggle("hidden");
})

addBookmarkModalBtn.addEventListener("click", () => {
    bookmarkModal.classList.toggle("hidden");

    const titleValue = document.querySelector("#title").value.trim();
    const url = document.querySelector('#url').value.trim();
    const description = document.querySelector('#desc').value.trim();

    if (titleValue.length < 3) {
        window.alert("Title cannot be shorter than 3 characters");
        return;
    }

    if (!url.startsWith("https://")) {
        window.alert("Not a valid url (should start with https://)");
        return;
    }

    let domain;
    try {
        domain = new URL(url).hostname;
    } catch (e) {
        window.alert("Invalid URL format");
        return;
    }

    // Create bookmark object, save it, and render
    const newBookmark = { title: titleValue, url, description };
    bookmarks.push(newBookmark);
    saveToLocalStorage();
    renderBookmark(newBookmark);

    // Clear input fields
    document.querySelector("#title").value = "";
    document.querySelector("#url").value = "";
    document.querySelector("#desc").value = "";
});

closeEditedBookmark.addEventListener("click", () => {
    editBookmarkModal.classList.toggle("hidden");
})

saveButton.addEventListener("click", ()=>{
    const editTitleInput = document.getElementById('editTitle').value.trim();
    const editUrlInput = document.getElementById('editUrl').value.trim();
    const editDescInput = document.getElementById('editDesc').value.trim();

    try {
        const domain = new URL(editUrlInput).hostname;
        currentlyEditingLogo.src = `https://logo.clearbit.com/${domain}`;
    } catch (e) {
        alert("Invalid URL. Could not update logo.");
    }


    if (editTitleInput.length < 3) {
        alert("Title must be at least 3 characters");
        return;
    }

    if (!editUrlInput.startsWith("https://")) {
        alert("URL must start with https://");
        return;
    }

    if (currentlyEditingTitle && currentlyEditingUrl && currentlyEditingDesc) {
        currentlyEditingTitle.textContent = editTitleInput;
        currentlyEditingUrl.textContent = editUrlInput;
        currentlyEditingUrl.href = editUrlInput;
        currentlyEditingDesc.textContent = editDescInput;
    }

    editBookmarkModal.classList.toggle("hidden");
})

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    document.querySelectorAll(".bookmarkCard").forEach((card) => {
        const name = card.querySelector(".bookmarkTitle")?.textContent.toLowerCase();
        const isVisible = name.includes(value);
        card.style.display = isVisible ? "flex" : "none";
    })
})

function renderBookmark(bookmark) {
    const { title, url, description } = bookmark;
    const domain = new URL(url).hostname;

    const bookmarkCard = document.createElement("div");
    bookmarkCard.classList.add("bookmarkCard");

    const logoImg = document.createElement("img");
    logoImg.src = `https://logo.clearbit.com/${domain}`;
    logoImg.alt = "favicon";
    logoImg.width = 40;
    logoImg.height = 40;

    const bookmarkTitle = document.createElement("h1");
    bookmarkTitle.classList.add("bookmarkTitle");
    bookmarkTitle.textContent = title;

    const bookmarkUrl = document.createElement("a");
    bookmarkUrl.classList.add("bookmarkUrl");
    bookmarkUrl.textContent = url;
    bookmarkUrl.href = url;
    bookmarkUrl.target = "_blank";

    const bookmarkDescription = document.createElement("p");
    bookmarkDescription.classList.add("bookmarkDescription");
    bookmarkDescription.textContent = description;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
        editBookmarkModal.classList.toggle("hidden");

        const editTitle = document.getElementById('editTitle');
        const editUrl = document.getElementById('editUrl');
        const editDesc = document.getElementById('editDesc');

        currentlyEditingTitle = bookmarkTitle;
        currentlyEditingUrl = bookmarkUrl;
        currentlyEditingDesc = bookmarkDescription;
        currentlyEditingLogo = logoImg;

        editTitle.value = bookmarkTitle.textContent;
        editUrl.value = bookmarkUrl.textContent;
        editDesc.value = bookmarkDescription.textContent;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this bookmark?")) {
            bookmarkCard.remove();
            bookmarks = bookmarks.filter(b => !(b.title === title && b.url === url));
            saveToLocalStorage();
        }
    });

    buttonContainer.append(editBtn, deleteBtn);
    bookmarkCard.append(logoImg, bookmarkTitle, bookmarkUrl, bookmarkDescription, buttonContainer);
    bookmarksContainer.append(bookmarkCard);
}

bookmarks.forEach(renderBookmark);

