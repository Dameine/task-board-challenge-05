// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

  // Generate a timestamp for the current time
  const timestamp = new Date().getTime();

  //generates a random number bet 0 and 100
  const randomNum = Math.floor(Math.random() * 100);
  return `task-${timestamp}-${randomNum}`;

}

// Todo: create a function to create a task card
function createTaskCard(task) {

  //create a new div element for the card
  const taskCard = document.createElement("div");

  //add class to task card to style in CSS
  taskCard.classList.add("task-card", "draggable");
  taskCard.setAttribute('data-task-id', task.taskId);

  //content for card
  taskCard.innerHTML = `
  <h3>${task.task}</h3>
  <p>${task.taskDescription}</p>
  <section>${task.date}</section>
  <div class="task-button-container">
    <button id="delete">Delete</button>
  </div>
  `;

  $("#todo-cards").append(taskCard);

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => createTaskCard(task));
  $(".draggable").draggable({
    revert: "invalid",
    stack: ".draggable",
  });
}
// Todo: create a function to handle adding a new task
function handleAddTask(event) {

  //variables are GETTING value of user input
  const task = $("#tasks").val();
  const date = $("#datepicker").val();
  const taskDescription = $("#task-description").val();

  //unique ID
  const taskId = generateTaskId();

  //Values from user input put into object list for one variable
  const taskObj = {
    taskId,
    task,
    date,
    taskDescription,
  }


  //saves user input to local storage
  storeTask(taskObj);

  //invoking task card
  createTaskCard(taskObj);

}

function storeTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

  // Retrieve the task card element to be deleted
  const taskCardToDelete = $(this).closest(".task-card");

  // Retrieve the task ID of the task card to be deleted
  const taskId = taskCardToDelete.data("taskId");

  // Remove the task card from the DOM
  taskCardToDelete.remove();

  // Retrieve tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Filter out the deleted task from the tasks array
  const updatedTasks = tasks.filter(task => task.taskId !== taskId);

  // Update the tasks in localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  // Retrieve the dropped task card element
  const droppedTaskCard = ui.draggable;

  // Retrieve the ID of the new status lane
  const newStatus = $(this).attr("id");

  // Move the dropped task card to the new status lane
  $(this).append(droppedTaskCard);

  const columnWidth = $(this).width();
  const cardWidth = droppedTaskCard.outerWidth();
  const newPosition = (columnWidth - cardWidth) / 2;
  droppedTaskCard.css({ left: newPosition });

  // Update the status of the dropped task (assuming there's a data attribute containing the task ID)
  const taskId = droppedTaskCard.data("task-id");

  if (taskId) {
    updateTaskStatus(taskId, newStatus);
  } else {
    console.error("Task ID not found!");
  }
}

function updateTaskStatus(taskId, newStatus) {
  // Retrieve tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Find the task with the given ID
  const taskToUpdate = tasks.find(task => task.taskId === taskId);

  if (taskToUpdate) {
    // Update the status of the task
    taskToUpdate.status = newStatus;

    // Save the updated tasks array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Task status updated successfully!");
    console.log("Updated tasks array:", tasks);
  } else {
    console.error("Task not found in tasks array!");
    console.log("Task ID:", taskId);
    console.log("Tasks array:", tasks);
  }
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  const addButton = $("#add");
  addButton.on("click", function () {
    handleAddTask();
  })

  renderTaskList();

  //delete button
  $(document).on("click", "#delete", handleDeleteTask);

  //make card droppable
  $(".droppable").droppable({
    accept: ".draggable",
    drop: handleDrop
  })

});

//date picker
$(function () {
  $("#datepicker").datepicker();
});
