// ==========================================
// TASKFLOW - TASK MANAGER
// ==========================================


// ==========================================
// STATE
// ==========================================

let tasks =
    JSON.parse(
        localStorage.getItem("myTasks")
    ) || [];

let currentFilter = "all";

let currentSearch = "";

let currentSort = "newest";

let editingTaskId = null;


// ==========================================
// DOM ELEMENTS
// ==========================================

const taskInput =
    document.getElementById("taskInput");

const addBtn =
    document.getElementById("addBtn");

const priorityInput =
    document.getElementById("priorityInput");

const categoryInput =
    document.getElementById("categoryInput");

const dateInput =
    document.getElementById("dateInput");

const searchInput =
    document.getElementById("searchInput");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const filters =
    document.querySelector(".filters");

const sortSelect =
    document.getElementById("sortSelect");

const totalCount =
    document.getElementById("totalCount");

const activeCount =
    document.getElementById("activeCount");

const completedCount =
    document.getElementById("completedCount");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const remainingText =
    document.getElementById("remainingText");

const clearCompleted =
    document.getElementById("clearCompleted");

const themeBtn =
    document.getElementById("themeBtn");


// ==========================================
// MODAL ELEMENTS
// ==========================================

const editModal =
    document.getElementById("editModal");

const editTaskInput =
    document.getElementById("editTaskInput");

const editPriority =
    document.getElementById("editPriority");

const editCategory =
    document.getElementById("editCategory");

const editDate =
    document.getElementById("editDate");

const saveEdit =
    document.getElementById("saveEdit");

const closeModal =
    document.getElementById("closeModal");


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "myTasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;

    }


    const task = {

        id: Date.now(),

        text: text,

        completed: false,

        priority:
            priorityInput.value,

        category:
            categoryInput.value,

        dueDate:
            dateInput.value,

        createdAt:
            Date.now()

    };


    tasks.push(task);

    saveTasks();


    taskInput.value = "";

    dateInput.value = "";

    taskInput.focus();


    displayTasks();

}


// ==========================================
// ADD BUTTON
// ==========================================

addBtn.addEventListener(
    "click",
    addTask
);


// ==========================================
// ENTER KEY TO ADD TASK
// ==========================================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ==========================================
// GET FILTERED TASKS
// ==========================================

function getFilteredTasks() {

    let result =
        [...tasks];


    // FILTER

    if (currentFilter === "active") {

        result =
            result.filter(
                function (task) {

                    return !task.completed;

                }
            );

    }


    if (currentFilter === "completed") {

        result =
            result.filter(
                function (task) {

                    return task.completed;

                }
            );

    }


    // SEARCH

    if (currentSearch !== "") {

        const search =
            currentSearch.toLowerCase();


        result =
            result.filter(
                function (task) {

                    return (

                        task.text
                            .toLowerCase()
                            .includes(search)

                        ||

                        task.category
                            .toLowerCase()
                            .includes(search)

                        ||

                        task.priority
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

    }


    // SORT

    if (currentSort === "newest") {

        result.sort(
            function (a, b) {

                return (
                    b.createdAt -
                    a.createdAt
                );

            }
        );

    }


    if (currentSort === "oldest") {

        result.sort(
            function (a, b) {

                return (
                    a.createdAt -
                    b.createdAt
                );

            }
        );

    }


    if (currentSort === "priority") {

        const priorityOrder = {

            high: 1,

            medium: 2,

            low: 3

        };


        result.sort(
            function (a, b) {

                return (
                    priorityOrder[a.priority] -
                    priorityOrder[b.priority]
                );

            }
        );

    }


    if (currentSort === "date") {

        result.sort(
            function (a, b) {

                if (!a.dueDate && !b.dueDate) {
                    return 0;
                }

                if (!a.dueDate) {
                    return 1;
                }

                if (!b.dueDate) {
                    return -1;
                }

                return a.dueDate.localeCompare(
                    b.dueDate
                );

            }
        );

    }


    return result;

}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    filteredTasks.forEach(
        function (task) {

            const li =
                document.createElement("li");


            li.className =
                "task";


            if (task.completed) {

                li.classList.add(
                    "completed"
                );

            }


            const dateText =
                task.dueDate
                    ? formatDate(task.dueDate)
                    : "No due date";


            li.innerHTML = `

                <button
                    class="check-btn"
                    data-action="toggle"
                    data-id="${task.id}"
                    type="button"
                    aria-label="${
                        task.completed
                            ? "Mark task as active"
                            : "Mark task as completed"
                    }"
                    title="${
                        task.completed
                            ? "Undo completion"
                            : "Complete task"
                    }">

                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }

                </button>


                <div class="task-info">

                    <div class="task-title">

                        ${escapeHTML(task.text)}

                    </div>


                    <div class="task-meta">

                        <span class="badge">

                            ${escapeHTML(
                                task.category
                            )}

                        </span>


                        <span
                            class="badge priority-${task.priority}">

                            ${capitalize(
                                task.priority
                            )}

                        </span>


                        <span class="badge">

                            ${dateText}

                        </span>

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        data-action="edit"
                        data-id="${task.id}"
                        type="button"
                        aria-label="Edit task: ${escapeHTML(task.text)}">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        data-action="delete"
                        data-id="${task.id}"
                        type="button"
                        aria-label="Delete task: ${escapeHTML(task.text)}">

                        Delete

                    </button>

                </div>

            `;


            taskList.appendChild(li);

        }
    );


    updateStatistics();

}


// ==========================================
// TASK BUTTON ACTIONS
// ==========================================

taskList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const id =
            Number(button.dataset.id);


        // TOGGLE COMPLETION

        if (action === "toggle") {

            const task =
                tasks.find(
                    function (item) {

                        return item.id === id;

                    }
                );


            if (task) {

                task.completed =
                    !task.completed;

            }

        }


        // EDIT

        else if (action === "edit") {

            openEditModal(id);

            return;

        }


        // DELETE

        else if (action === "delete") {

            const confirmed =
                confirm(
                    "Delete this task?"
                );


            if (!confirmed) {
                return;
            }


            tasks =
                tasks.filter(
                    function (task) {

                        return task.id !== id;

                    }
                );

        }


        saveTasks();

        displayTasks();

    }
);


// ==========================================
// OPEN EDIT MODAL
// ==========================================

function openEditModal(id) {

    const task =
        tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {
        return;
    }


    editingTaskId =
        id;


    editTaskInput.value =
        task.text;

    editPriority.value =
        task.priority;

    editCategory.value =
        task.category;

    editDate.value =
        task.dueDate;


    editModal.classList.add(
        "show"
    );


    editTaskInput.focus();

}


// ==========================================
// SAVE EDIT
// ==========================================

saveEdit.addEventListener(
    "click",
    function () {

        const task =
            tasks.find(
                function (item) {

                    return (
                        item.id ===
                        editingTaskId
                    );

                }
            );


        if (!task) {
            return;
        }


        const text =
            editTaskInput.value.trim();


        if (text === "") {

            alert(
                "Task name cannot be empty."
            );

            editTaskInput.focus();

            return;

        }


        task.text =
            text;

        task.priority =
            editPriority.value;

        task.category =
            editCategory.value;

        task.dueDate =
            editDate.value;


        saveTasks();

        closeEditModal();

        displayTasks();

    }
);


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener(
    "click",
    closeEditModal
);


editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingTaskId = null;

}


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            editModal.classList.contains("show")
        ) {

            closeEditModal();

        }

    }
);


// ==========================================
// FILTER BUTTONS
// ==========================================

filters.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".filter-btn"
            );


        if (!button) {
            return;
        }


        currentFilter =
            button.dataset.filter;


        document
            .querySelectorAll(".filter-btn")
            .forEach(
                function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


        button.classList.add(
            "active"
        );


        displayTasks();

    }
);


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function (event) {

        currentSearch =
            event.target.value.trim();


        displayTasks();

    }
);


// ==========================================
// SORT
// ==========================================

sortSelect.addEventListener(
    "change",
    function (event) {

        currentSort =
            event.target.value;


        displayTasks();

    }
);


// ==========================================
// CLEAR COMPLETED
// ==========================================

clearCompleted.addEventListener(
    "click",
    function () {

        const completedTasks =
            tasks.filter(
                function (task) {

                    return task.completed;

                }
            );


        if (completedTasks.length === 0) {

            alert(
                "There are no completed tasks."
            );

            return;

        }


        const confirmed =
            confirm(
                "Clear all completed tasks?"
            );


        if (!confirmed) {
            return;
        }


        tasks =
            tasks.filter(
                function (task) {

                    return !task.completed;

                }
            );


        saveTasks();

        displayTasks();

    }
);


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const active =
        total - completed;


    totalCount.textContent =
        total;

    activeCount.textContent =
        active;

    completedCount.textContent =
        completed;


    let progress = 0;


    if (total > 0) {

        progress =
            Math.round(
                (completed / total) *
                100
            );

    }


    progressFill.style.width =
        progress + "%";


    progressText.textContent =
        progress + "%";


    if (active === 1) {

        remainingText.textContent =
            "1 remaining";

    } else {

        remainingText.textContent =
            active + " remaining";

    }


    const progressBar =
        document.querySelector(
            ".progress-bar"
        );


    progressBar.setAttribute(
        "aria-valuenow",
        progress
    );

}


// ==========================================
// THEME
// ==========================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        if (darkMode) {

            themeBtn.textContent =
                "☀";

            themeBtn.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeBtn.setAttribute(
                "title",
                "Switch to light mode"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "☾";

            themeBtn.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeBtn.setAttribute(
                "title",
                "Switch to dark mode"
            );

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


// ==========================================
// LOAD SAVED THEME
// ==========================================

if (
    localStorage.getItem("theme") ===
    "dark"
) {

    document.body.classList.add(
        "dark"
    );


    themeBtn.textContent =
        "☀";


    themeBtn.setAttribute(
        "aria-label",
        "Switch to light mode"
    );


    themeBtn.setAttribute(
        "title",
        "Switch to light mode"
    );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    const parts =
        date.split("-");


    if (parts.length !== 3) {

        return date;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


// ==========================================
// CAPITALIZE
// ==========================================

function capitalize(value) {

    if (!value) {

        return "";

    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

displayTasks();