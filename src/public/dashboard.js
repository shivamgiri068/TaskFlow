// dashboard.js - TaskFlow Dashboard Client

let allTasks = []; // Cache to hold fetched tasks
const token = localStorage.getItem("token");
const username = localStorage.getItem("username") || "User";

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Check authorization
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  // Display username
  document.getElementById("username-display").textContent = username;

  // Fetch initial task list
  fetchTasks();
});

// Show dynamic toast notifications
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  // Icon/Symbol based on type
  const icon = type === "success" ? "✓" : "⚠";
  
  toast.innerHTML = `
    <span class="toast-icon" style="font-weight: bold; font-size: 1.1rem; color: ${type === 'success' ? 'var(--accent-done)' : 'var(--accent-todo)'}">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Fetch all tasks from Server
async function fetchTasks() {
  try {
    const response = await fetch("/api/tasks", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 401) {
      handleLogout();
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    allTasks = await response.json();
    renderDashboard(allTasks);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Compute statistics and render cards & grid
function renderDashboard(tasksList) {
  // Update stats
  const total = tasksList.length;
  const todo = tasksList.filter(t => t.status === "todo").length;
  const inProgress = tasksList.filter(t => t.status === "in-progress").length;
  const done = tasksList.filter(t => t.status === "done").length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-todo").textContent = todo;
  document.getElementById("stat-inprogress").textContent = inProgress;
  document.getElementById("stat-done").textContent = done;

  // Filter tasks based on current UI inputs
  filterTasks();
}

// Handle real-time client side filters (search + status + priority)
function filterTasks() {
  const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const statusFilter = document.getElementById("filter-status").value;
  const priorityFilter = document.getElementById("filter-priority").value;

  let filtered = allTasks;

  // Filter by Search Query
  if (searchQuery) {
    filtered = filtered.filter(t => t.title.toLowerCase().includes(searchQuery));
  }

  // Filter by Status
  if (statusFilter !== "all") {
    filtered = filtered.filter(t => t.status === statusFilter);
  }

  // Filter by Priority
  if (priorityFilter !== "all") {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }

  const grid = document.getElementById("tasks-grid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p style="font-size: 1.5rem; margin-bottom: 8px;">No tasks found! 📝</p>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Click "+ Add Task" to create a new task or adjust your filters.
        </p>
      </div>
    `;
    return;
  }

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card animate-fade-in";
    
    // Format Date
    let dateStr = "No due date";
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      dateStr = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }

    card.innerHTML = `
      <div>
        <div class="task-header">
          <h4 class="task-title">${escapeHTML(task.title)}</h4>
        </div>
        <p class="task-description">${escapeHTML(task.description || "No description provided.")}</p>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="task-meta">
          <span class="badge badge-priority-${task.priority}">${task.priority}</span>
          <span class="badge badge-status-${task.status.replace('-', '')}">${task.status}</span>
        </div>
        
        <div class="task-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${dateStr}</span>
        </div>
        
        <div class="task-actions">
          <button class="btn-icon btn-edit" onclick="openEditModal('${task._id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          
          <button class="btn-icon btn-delete" onclick="handleDeleteTask('${task._id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Modal actions
function openAddModal() {
  document.getElementById("modal-title").textContent = "Add New Task";
  document.getElementById("task-id").value = "";
  document.getElementById("task-form").reset();
  
  // Set default due date to today + 3 days as standard placeholder helper
  const dateInput = document.getElementById("task-due-date");
  const today = new Date();
  today.setDate(today.getDate() + 3);
  dateInput.value = today.toISOString().split("T")[0];

  document.getElementById("task-modal").classList.add("active");
}

function openEditModal(taskId) {
  const task = allTasks.find(t => t._id === taskId);
  if (!task) return;

  document.getElementById("modal-title").textContent = "Edit Task";
  document.getElementById("task-id").value = task._id;
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description || "";
  document.getElementById("task-status").value = task.status;
  document.getElementById("task-priority").value = task.priority;

  if (task.dueDate) {
    document.getElementById("task-due-date").value = task.dueDate.split("T")[0];
  } else {
    document.getElementById("task-due-date").value = "";
  }

  document.getElementById("task-modal").classList.add("active");
}

function closeModal() {
  document.getElementById("task-modal").classList.remove("active");
}

// Save or Update task
async function saveTask(event) {
  event.preventDefault();

  const id = document.getElementById("task-id").value;
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const status = document.getElementById("task-status").value;
  const priority = document.getElementById("task-priority").value;
  const dueDate = document.getElementById("task-due-date").value;

  if (!title) {
    showToast("Title is required", "error");
    return;
  }

  const payload = { title, description, status, priority, dueDate: dueDate || null };

  const isEditing = !!id;
  const url = isEditing ? `/api/tasks/${id}` : "/api/tasks";
  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Failed to save task");
    }

    closeModal();
    showToast(isEditing ? "Task updated successfully!" : "Task created successfully!");
    
    // Refresh the dashboard data
    fetchTasks();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Delete Task
async function handleDeleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Failed to delete task");
    }

    showToast("Task deleted successfully");
    fetchTasks();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Handle Logout
function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

// Escape HTML utility to prevent XSS injection
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
