const todoForm = document.querySelector("form");
const unorderedList = document.querySelector(".taskList");
const finishedUnorderedList = document.querySelector(".completedTaskList")
const todoFormValue = document.querySelector("#formInput");
const emptyErrorPopup = document.querySelector("#emptyErrorPopup");
const duplicateErrorPopup = document.querySelector("#duplicateErrorPopup");
const errorPopups = document.querySelector(".errorPopups")
const completedTaskList = document.querySelector(".completedTaskList");
const taskList = document.querySelector(".taskList");
const completedTaskHeaderH2 = document.querySelector(".completedHeader h2");
const completedTaskHeaderHR = document.querySelector(".completedHeader hr");
const cancelButtonElement = document.querySelector(".cancelIcon")

function loadTasks () {
    let localTasks = localStorage.getItem("items");
    let finishedLocalTasks = localStorage.getItem("finishedItems");

    if (localTasks !== null) {
        localTasks = JSON.parse(localTasks);
        localTasks.forEach(function(item) {
            createDOM(item);
        })
    }
    if (finishedLocalTasks !== null){
        finishedLocalTasks = JSON.parse(finishedLocalTasks);
        finishedLocalTasks.forEach(function(item) {
            createFinishedDOM(item);
        })
    }
    checkUI();
}

//Creates a new list entry based off the text in the form
function onSubmit (e) {
    e.preventDefault();
    const newEntry = todoFormValue.value;
    if (newEntry === ""){
        emptyErrorPopup.style.display = "flex";
    } else if (checkRepeat(newEntry)){
        duplicateErrorPopup.style.display = "flex";
    } else {
        createDOM(newEntry);
        createLocalStorage(newEntry);
        todoFormValue.value = "";
    }
}

function checkRepeat(newTask) {
    todoElements = document.querySelectorAll("input");
    const taskArray = [];
    for (let element of todoElements) {
        taskArray.push(element.parentElement.textContent.toLowerCase());
    }
    return taskArray.includes(newTask.toLowerCase());
}


//Creates a entry in the DOM todo list with a 'X' button
function createDOM (formEntry){
    //Create a new list element
    const ulDiv = document.createElement("div");
    ulDiv.classList.add("checkboxDiv")
    const labelElement = document.createElement("label");
    labelElement.classList.add("checkboxLabel")
    const inputElement = document.createElement("input");
    const cancelButton = createCancelButton ();
    inputElement.type = "checkbox"
    inputElement.name = "checkbox"
    inputElement.classList.add("checkboxInput");
    labelElement.appendChild(inputElement); 
    //Create a new text node with the argument as the string, and appends it to the list element
    labelElement.appendChild(document.createTextNode(formEntry));
    //Puts the list element into the unordred list element in the HTML
    ulDiv.appendChild(cancelButton);
    ulDiv.appendChild(labelElement);
    unorderedList.appendChild(ulDiv);

}

function createFinishedDOM (formEntry){
    //Create a new list element
    const ulDiv = document.createElement("div");
    ulDiv.classList.add("checkboxDiv")
    const labelElement = document.createElement("label");
    labelElement.classList.add("checkboxLabel")
    const inputElement = document.createElement("input");
    const cancelButton = createCancelButton ();
    inputElement.type = "checkbox"
    inputElement.name = "checkbox"
    inputElement.checked = true;
    inputElement.classList.add("checkboxInput");
    labelElement.appendChild(inputElement);
    //Create a new text node with the argument as the string, and appends it to the list element
    labelElement.appendChild(document.createTextNode(formEntry));
    //Puts the list element into the unordred list element in the HTML
    ulDiv.appendChild(cancelButton);
    ulDiv.appendChild(labelElement);
    finishedUnorderedList.appendChild(ulDiv);
}

function createCancelButton () {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("cancelButton")
    buttonElement.type = "submit";
    const iconElement = document.createElement("i");
    iconElement.classList.add("material-icons")
    iconElement.classList.add("cancelIcon")
    const textElement = document.createTextNode("close");
    iconElement.appendChild(textElement);
    buttonElement.appendChild(iconElement);
    buttonElement.addEventListener('click', deleteTask);
    return buttonElement;
}

function createLocalStorage (formEntry) {
    if (localStorage.getItem("items") !== null) {
        let items = JSON.parse(localStorage.getItem("items"));
        items.push(formEntry);
        const updatedItems = JSON.stringify(items)
        localStorage.setItem("items", updatedItems);
    } else {
        let items  = [];
        items.push(formEntry);
        localStorage.setItem("items", JSON.stringify(items));

    }
}

function removeLocalStorage (e) {
    if (e.currentTarget.parentElement.childNodes[1].childNodes[0].checked === false) {
        let items = JSON.parse(localStorage.getItem("items"));
        const todoEntry = e.currentTarget.parentElement.childNodes[1].childNodes[1].textContent.split(-5);
        const todoEntryIndex = items.indexOf(todoEntry);
        items.splice(todoEntryIndex, 1);
        const updatedItems = JSON.stringify(items)
        localStorage.setItem("items", updatedItems);
    } else {
        let items = JSON.parse(localStorage.getItem("finishedItems"));
        const todoEntry = e.currentTarget.parentElement.childNodes[1].childNodes[1].textContent.split(-5);
        const todoEntryIndex = items.indexOf(todoEntry);
        items.splice(todoEntryIndex, 1);
        const updatedItems = JSON.stringify(items)
        localStorage.setItem("finishedItems", updatedItems);
    }
}

function reverseError () {
    if (emptyErrorPopup.style.display === "flex") {
        emptyErrorPopup.style.display = "none";
    } 
    if (duplicateErrorPopup.style.display === "flex") {
        duplicateErrorPopup.style.display = "none";
    }
}

function createFinishedLocalStorage (formEntry) {
    if (localStorage.getItem("finishedItems") !== null) {
        let items = JSON.parse(localStorage.getItem("finishedItems"));
        items.push(formEntry);
        const updatedItems = JSON.stringify(items)
        localStorage.setItem("finishedItems", updatedItems);
    } else {
        let items  = [];
        items.push(formEntry);
        localStorage.setItem("finishedItems", JSON.stringify(items));

    }
}

function checkboxSwitch () {
    let todoElements;
    todoElements = document.querySelectorAll("input");
    for (let element of todoElements) {
        if (element.checked === true && element.parentElement.parentElement.parentElement.className === "taskList") {
           completedTaskList.appendChild(element.parentElement.parentElement);
            
            const todoElementText = element.parentElement.textContent.split(-5);
            createFinishedLocalStorage(todoElementText);

            const localArray = JSON.parse(localStorage.getItem("items"));
            const index = localArray.indexOf(todoElementText);
            localArray.splice(index, 1);
            localStorage.setItem("items", JSON.stringify(localArray))
        } else  {
            if (element.checked === false && element.parentElement.parentElement.parentElement.className === "completedTaskList") {
                const todoElementText = element.parentElement.textContent.split(-5);
                taskList.appendChild(element.parentElement.parentElement);

                createLocalStorage(todoElementText);

                const localArray = JSON.parse(localStorage.getItem("finishedItems"));
                const index = localArray.indexOf(todoElementText);
                localArray.splice(index, 1);
                localStorage.setItem("finishedItems", JSON.stringify(localArray));                
            }
        }
    }
}

function deleteTask(e) {
        e.target.parentElement.parentElement.removeEventListener('click', deleteTask);
        e.target.parentElement.parentElement.remove();
        removeLocalStorage(e);

}

function hideDisplay() {
    if (completedTaskList.childNodes.length === 0) {
        completedTaskHeaderH2.style.display = "none";
        completedTaskHeaderHR.style.display = "none";
    } else {
        completedTaskHeaderH2.style.display = "flex";
        completedTaskHeaderHR.style.display = "flex";
    }
}

function checkUI () {
    checkboxSwitch();
    hideDisplay();
}

todoForm.addEventListener('submit', onSubmit);
todoForm.addEventListener('click', reverseError);
document.body.addEventListener('click', checkUI);
document.body.addEventListener('click', checkboxSwitch);
document.addEventListener('DOMContentLoaded', loadTasks);
