const todoForm = document.querySelector("#divTodoForm");
const todoList = document.querySelector("#ulTodoList");
const CompletedTodoList = document.querySelector("#ulCompletedTodoList")
const input = document.querySelector("#inputTodo");
const emptyErrorPopup = document.querySelector("#divEmptyErrorPopup");
const duplicateErrorPopup = document.querySelector("#divDuplicateErrorPopup");
const errorPopups = document.querySelector("#divErrorPopups")
const completedTodoList = document.querySelector("#ulCompletedTodoList");
const completedTitleH2 = document.querySelector("#divCompletedTitle h2");
const completedTitleHr = document.querySelector("#divCompletedTitle hr");

//Loads the todo entries in local storage when first loading the website
function loadTodos () {
    let localTodos = localStorage.getItem("items");
    let finishedlocalTodos = localStorage.getItem("finishedItems");

    if (localTodos !== null) {
        localTodos = JSON.parse(localTodos);
        localTodos.forEach(function(item) {
            createDOM(item);
        })
    }
    if (finishedlocalTodos !== null){
        finishedlocalTodos = JSON.parse(finishedlocalTodos);
        finishedlocalTodos.forEach(function(item) {
            createFinishedDOM(item);
        })
    }
    checkUI();
}

//Creates a new todo based off the text in the form
function onSubmit (e) {
    e.preventDefault();
    const newTodo = input.value;
    if (newTodo === ""){
        emptyErrorPopup.style.display = "flex";
    } else if (checkRepeat(newTodo)){
        duplicateErrorPopup.style.display = "flex";
    } else {
        createDOM(newTodo);
        createLocalStorage(newTodo);
        input.value = "";
    }
}

//Creates a new checkbox todo entry in the DOM with a 'X' button
function createDOM (formEntry){
    const divElement = document.createElement("div");
    divElement.classList.add("divTodoCheckbox")
    const labelElement = document.createElement("label");
    labelElement.classList.add("labelTodoCheckbox")
    const inputElement = document.createElement("input");
    const cancelButton = createCancelButton ();
    inputElement.type = "checkbox"
    inputElement.name = "checkbox"
    inputElement.classList.add("inputTodoCheckbox");
    labelElement.appendChild(inputElement); 
    labelElement.appendChild(document.createTextNode(formEntry));
    divElement.appendChild(cancelButton);
    divElement.appendChild(labelElement);
    todoList.appendChild(divElement);

}

//Creates a new completed checkbox todo entry in the DOM with a "X" button
function createFinishedDOM (formEntry){
    const divElement = document.createElement("div");
    divElement.classList.add("divTodoCheckbox")
    const labelElement = document.createElement("label");
    labelElement.classList.add("labelTodoCheckbox")
    const inputElement = document.createElement("input");
    const cancelButton = createCancelButton ();
    inputElement.type = "checkbox"
    inputElement.name = "checkbox"
    inputElement.checked = true;
    inputElement.classList.add("inputTodoCheckbox");
    labelElement.appendChild(inputElement);
    labelElement.appendChild(document.createTextNode(formEntry));
    divElement.appendChild(cancelButton);
    divElement.appendChild(labelElement);
    CompletedTodoList.appendChild(divElement);
}

//Creates/updates an array of todo list items in local storage
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

//Creates local storage for the finished todo items
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

//Creates a cancle button with an "X" icon
function createCancelButton () {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("buttonCancel")
    buttonElement.type = "submit";
    const iconElement = document.createElement("i");
    iconElement.classList.add("material-icons")
    iconElement.classList.add("iconCancel")
    const textElement = document.createTextNode("close");
    iconElement.appendChild(textElement);
    buttonElement.appendChild(iconElement);
    buttonElement.addEventListener('click', deleteTask);
    return buttonElement;
}

//Upon being checked, moves the checkbox element from the uncompleted to the completed sections
function checkboxSwitch () {
    let todoElements;
    todoElements = document.querySelectorAll("input");
    for (let element of todoElements) {
        if (element.checked === true && element.parentElement.parentElement.parentElement.id === "ulTodoList") {
           completedTodoList.appendChild(element.parentElement.parentElement);
            
            const todoElementText = element.parentElement.textContent.split(-5);
            createFinishedLocalStorage(todoElementText);

            const localArray = JSON.parse(localStorage.getItem("items"));
            const index = localArray.indexOf(todoElementText);
            localArray.splice(index, 1);
            localStorage.setItem("items", JSON.stringify(localArray))
        } else  {
            if (element.checked === false && element.parentElement.parentElement.parentElement.id === "ulCompletedTodoList") {
                const todoElementText = element.parentElement.textContent.split(-5);
                todoList.appendChild(element.parentElement.parentElement);

                createLocalStorage(todoElementText);

                const localArray = JSON.parse(localStorage.getItem("finishedItems"));
                const index = localArray.indexOf(todoElementText);
                localArray.splice(index, 1);
                localStorage.setItem("finishedItems", JSON.stringify(localArray));                
            }
        }
    }
}

//Removes a todo list element from local storage 
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

//Removes the task from the list, and local storage, and removes its event listner for the delete button
function deleteTask(e) {
    e.target.parentElement.parentElement.removeEventListener('click', deleteTask);
    e.target.parentElement.parentElement.remove();
    removeLocalStorage(e);

}

//Checks if the input a user is trying to submit already exisits in the list, and if so 
//makes the duplicate error popup appear
function checkRepeat(newTask) {
    todoElements = document.querySelectorAll("input");
    const taskArray = [];
    for (let element of todoElements) {
        taskArray.push(element.parentElement.textContent.toLowerCase());
    }
    return taskArray.includes(newTask.toLowerCase());
}


//Re-hides the error popups
function reverseError () {
    if (emptyErrorPopup.style.display === "flex") {
        emptyErrorPopup.style.display = "none";
    } 
    if (duplicateErrorPopup.style.display === "flex") {
        duplicateErrorPopup.style.display = "none";
    }
}


//Hides the completeted todo list title when there are no completed tasks
function hideDisplay() {
    if (completedTodoList.childNodes.length === 0) {
        completedTitleH2.style.display = "none";
        completedTitleHr.style.display = "none";
    } else {
        completedTitleH2.style.display = "flex";
        completedTitleHr.style.display = "flex";
    }
}

//checks if the UI needs updating
function checkUI () {
    checkboxSwitch();
    hideDisplay();
}

todoForm.addEventListener('submit', onSubmit);
todoForm.addEventListener('click', reverseError);
document.body.addEventListener('click', checkUI);
document.body.addEventListener('click', checkboxSwitch);
document.addEventListener('DOMContentLoaded', loadTodos);
