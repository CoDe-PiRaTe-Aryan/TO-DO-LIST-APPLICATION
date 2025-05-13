// Fetching DOM Elements
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const markImportant = document.getElementById('markImportant');
const taskList = document.getElementById('taskList');
const importantList = document.getElementById('importantList');
const pendingList = document.getElementById('pendingList');
const notificationsList = document.getElementById('notificationsList');
const userDisplay = document.getElementById('userDisplay');

// Calendar setup
const calendarContainer = document.getElementById('calendarContainer');

// Chart.js setup for progress graph
const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Tasks Completed',
      data: [0, 0, 0, 0, 0, 0, 0], // Default data
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

// Task Array for managing tasks
let tasks = [];

// Initial Login User Display
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('todoUser');
  if (user) {
    userDisplay.innerText = user;
  } else {
    window.location.href = 'index.html';
  }

  loadTasks();
  generateCalendar();
});

// Add Task
function addTask() {
  const task = taskInput.value.trim();
  const date = taskDate.value;
  const important = markImportant.checked;

  if (task && date) {
    const newTask = {
      task,
      date,
      important,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskDate.value = '';
    markImportant.checked = false;
  }
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';
  importantList.innerHTML = '';
  pendingList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      ${task.task} - ${task.date}
      <span class="task-status ${task.completed ? 'tick' : 'cross'}">
        ${task.completed ? '✓' : '✗'}
      </span>
      <button onclick="deleteTask(${index})">Delete</button>
      <button onclick="toggleTaskStatus(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
      <button onclick="markImportantTask(${index})">${task.important ? 'Unmark Important' : 'Mark Important'}</button>
    `;

    if (task.important) {
      importantList.appendChild(taskItem);
    } else if (task.completed) {
      taskItem.classList.add('completed');
      taskList.appendChild(taskItem);
    } else {
      pendingList.appendChild(taskItem);
    }
  });

  updateProgressGraph();
}

// Toggle Task Status (Complete/Undo)
function toggleTaskStatus(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Mark Task as Important
function markImportantTask(index) {
  tasks[index].important = !tasks[index].important;
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Save Tasks to Local Storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}

// Generate Calendar (Basic version)
function generateCalendar() {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  calendarContainer.innerHTML = ''; // Clear previous calendar

  // Generate calendar days
  for (let i = 1; i <= daysInMonth; i++) {
    const dayBox = document.createElement('div');
    dayBox.innerText = i;
    dayBox.classList.add('calendar-day');
    calendarContainer.appendChild(dayBox);
  }
}

// Update Weekly Progress Chart
function updateProgressGraph() {
  const tasksCompletedPerDay = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach(task => {
    const taskDate = new Date(task.date);
    const dayOfWeek = taskDate.getDay(); // 0 - Sunday, 6 - Saturday

    if (task.completed) {
      tasksCompletedPerDay[dayOfWeek]++;
    }
  });

  // Update chart data
  progressChart.data.datasets[0].data = tasksCompletedPerDay;
  progressChart.update();
}

// Logout Function
function logout() {
  localStorage.removeItem('todoUser');
  window.location.href = 'index.html';
}

// Notifications
function showNotification(message) {
  const notificationItem = document.createElement('li');
  notificationItem.innerText = message;
  notificationsList.appendChild(notificationItem);
}

// Mock notifications
setInterval(() => {
  showNotification('Reminder: Complete your task!');
}, 30000); // Show a reminder every 30 seconds (for demo purposes)
