const STORAGE_KEY = "smart-task-manager-tasks";

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Get all tasks from localStorage
export function getTasks() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save tasks to localStorage
export function saveTasks(tasks) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Add a new task
export function addTask(task) {
  const tasks = getTasks();
  const newTask = {
    id: generateId(),
    title: task.title,
    description: task.description || "",
    deadline: task.deadline,
    priority: task.priority || "medium",
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

// Update a task
export function updateTask(id, updates) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
}

// Delete a task
export function deleteTask(id) {
  const tasks = getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  saveTasks(filtered);
  return filtered;
}

// Get a single task by ID
export function getTaskById(id) {
  const tasks = getTasks();
  return tasks.find((t) => t.id === id) || null;
}

// Calculate days until deadline
export function getDaysUntilDeadline(deadline) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diff = dl - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Get deadline color class based on days remaining
export function getDeadlineColor(deadline) {
  const days = getDaysUntilDeadline(deadline);
  if (days <= 1) return "deadline-red";
  if (days <= 3) return "deadline-yellow";
  return "deadline-green";
}

// Get deadline color name (for badges/text)
export function getDeadlineColorName(deadline) {
  const days = getDaysUntilDeadline(deadline);
  if (days <= 1) return "red";
  if (days <= 3) return "yellow";
  return "green";
}

// Priority weight for sorting (higher = more urgent)
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

// Sort tasks by deadline (nearest first), then by priority (highest first)
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const deadlineDiff = new Date(a.deadline) - new Date(b.deadline);
    if (deadlineDiff !== 0) return deadlineDiff;
    return (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
  });
}

// Filter tasks by search query
export function searchTasks(tasks, query) {
  if (!query.trim()) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  );
}

// Filter tasks by priority
export function filterByPriority(tasks, priority) {
  if (!priority || priority === "all") return tasks;
  return tasks.filter((t) => t.priority === priority);
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format date for input[type="date"]
export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
