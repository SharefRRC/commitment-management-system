import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcrAUidtpHqhfVf8fcoAG1-NcHbv01fy0",
  authDomain: "commitment-management-system.firebaseapp.com",
  projectId: "commitment-management-system"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

let idToken = "";
let currentUser = null;

let commitments = [];
let categories = [];
let reminders = [];

let analyticsSummary = null;
let analyticsCategories = [];
let analyticsDelays = [];

let editingCommitmentId = null;
let editingCategoryId = null;
let editingReminderId = null;

const authStatus = document.getElementById("authStatus");
const globalMessage = document.getElementById("globalMessage");
const analyticsStatus = document.getElementById("analyticsStatus");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const commitmentMode = document.getElementById("commitmentMode");
const categoryMode = document.getElementById("categoryMode");
const reminderMode = document.getElementById("reminderMode");

const commitmentTitle = document.getElementById("commitmentTitle");
const commitmentDescription = document.getElementById("commitmentDescription");
const commitmentDueDate = document.getElementById("commitmentDueDate");
const commitmentMustStartByDate = document.getElementById("commitmentMustStartByDate");
const commitmentEstimatedHours = document.getElementById("commitmentEstimatedHours");
const commitmentPriority = document.getElementById("commitmentPriority");
const commitmentStatus = document.getElementById("commitmentStatus");
const commitmentCategoryId = document.getElementById("commitmentCategoryId");

const categoryName = document.getElementById("categoryName");
const categoryColor = document.getElementById("categoryColor");

const reminderCommitmentId = document.getElementById("reminderCommitmentId");
const reminderDate = document.getElementById("reminderDate");
const reminderType = document.getElementById("reminderType");
const reminderDeliveryState = document.getElementById("reminderDeliveryState");

const commitmentsList = document.getElementById("commitmentsList");
const categoriesList = document.getElementById("categoriesList");
const remindersList = document.getElementById("remindersList");

const summaryStats = document.getElementById("summaryStats");
const categoryAnalyticsList = document.getElementById("categoryAnalyticsList");
const delayAnalyticsList = document.getElementById("delayAnalyticsList");

document.getElementById("loginBtn").addEventListener("click", handleLogin);
document.getElementById("demoLoginBtn").addEventListener("click", handleDemoLogin);
document.getElementById("logoutBtn").addEventListener("click", handleLogout);
document.getElementById("refreshAllBtn").addEventListener("click", refreshAll);
document.getElementById("loadAnalyticsBtn").addEventListener("click", loadAllAnalytics);

document.getElementById("saveCommitmentBtn").addEventListener("click", saveCommitment);
document.getElementById("cancelCommitmentBtn").addEventListener("click", cancelCommitmentEdit);

document.getElementById("saveCategoryBtn").addEventListener("click", saveCategory);
document.getElementById("cancelCategoryBtn").addEventListener("click", cancelCategoryEdit);

document.getElementById("saveReminderBtn").addEventListener("click", saveReminder);
document.getElementById("cancelReminderBtn").addEventListener("click", cancelReminderEdit);

document.getElementById("loadSummaryBtn").addEventListener("click", loadSummaryAnalytics);
document.getElementById("loadCategoryAnalyticsBtn").addEventListener("click", loadCategoryAnalytics);
document.getElementById("loadDelayAnalyticsBtn").addEventListener("click", loadDelayAnalytics);

onAuthStateChanged(firebaseAuth, async (user) => {
  if (user) {
    currentUser = user;
    idToken = await user.getIdToken();
    setAuthStatus(`Authenticated as ${user.email}`);
    setMessage("Login successful.");
    await refreshAll();
    await loadAllAnalytics();
  } else {
    currentUser = null;
    idToken = "";
    setAuthStatus("Not authenticated");
    setMessage("Please login.");
    setAnalyticsStatus("Analytics not loaded yet.");

    commitments = [];
    categories = [];
    reminders = [];
    analyticsSummary = null;
    analyticsCategories = [];
    analyticsDelays = [];

    renderAll();
    renderAnalytics();
  }
});

async function handleLogin() {
  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      setMessage("Enter email and password.");
      return;
    }

    await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    setMessage(`Login failed: ${error.message}`);
  }
}

async function handleDemoLogin() {
  try {
    emailInput.value = "demo@test.com";
    passwordInput.value = "Password123!";
    await signInWithEmailAndPassword(firebaseAuth, emailInput.value, passwordInput.value);
  } catch (error) {
    setMessage(`Demo login failed: ${error.message}`);
  }
}

async function handleLogout() {
  try {
    await signOut(firebaseAuth);
    clearAllForms();
    setMessage("Logged out.");
  } catch (error) {
    setMessage(`Logout failed: ${error.message}`);
  }
}

function setAuthStatus(text) {
  authStatus.textContent = text;
}

function setMessage(text) {
  globalMessage.textContent = text;
}

function setAnalyticsStatus(text) {
  analyticsStatus.textContent = text;
}

function toIsoDate(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}

function toLocalInputValue(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      ...(options.headers || {})
    }
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

function normalizeData(result) {
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result)) return result;
  return [];
}

function normalizeObject(result) {
  if (result?.data && typeof result.data === "object" && !Array.isArray(result.data)) {
    return result.data;
  }

  if (result && typeof result === "object" && !Array.isArray(result)) {
    return result;
  }

  return null;
}

async function refreshAll() {
  try {
    if (!idToken) {
      setMessage("Login first.");
      return;
    }

    const [commitmentRes, categoryRes, reminderRes] = await Promise.all([
      api("/api/commitments"),
      api("/api/categories"),
      api("/api/reminders")
    ]);

    commitments = normalizeData(commitmentRes);
    categories = normalizeData(categoryRes);
    reminders = normalizeData(reminderRes);

    renderAll();
    setMessage("Loaded commitments, categories, and reminders.");
  } catch (error) {
    setMessage(`Refresh failed: ${error.message}`);
  }
}

async function loadAllAnalytics() {
  try {
    if (!idToken) {
      setAnalyticsStatus("Login first to load analytics.");
      return;
    }

    const [summaryRes, categoriesRes, delaysRes] = await Promise.all([
      api("/api/analytics/summary"),
      api("/api/analytics/categories"),
      api("/api/analytics/delays")
    ]);

    analyticsSummary = normalizeObject(summaryRes);
    analyticsCategories = normalizeData(categoriesRes);
    analyticsDelays = normalizeData(delaysRes);

    renderAnalytics();
    setAnalyticsStatus("Loaded summary, category analytics, and delay analytics.");
  } catch (error) {
    setAnalyticsStatus(`Analytics load failed: ${error.message}`);
  }
}

async function loadSummaryAnalytics() {
  try {
    if (!idToken) {
      setAnalyticsStatus("Login first to load summary analytics.");
      return;
    }

    const result = await api("/api/analytics/summary");
    analyticsSummary = normalizeObject(result);

    renderAnalytics();
    setAnalyticsStatus("Loaded summary analytics.");
  } catch (error) {
    setAnalyticsStatus(`Summary analytics failed: ${error.message}`);
  }
}

async function loadCategoryAnalytics() {
  try {
    if (!idToken) {
      setAnalyticsStatus("Login first to load category analytics.");
      return;
    }

    const result = await api("/api/analytics/categories");
    analyticsCategories = normalizeData(result);

    renderAnalytics();
    setAnalyticsStatus("Loaded category analytics.");
  } catch (error) {
    setAnalyticsStatus(`Category analytics failed: ${error.message}`);
  }
}

async function loadDelayAnalytics() {
  try {
    if (!idToken) {
      setAnalyticsStatus("Login first to load delay analytics.");
      return;
    }

    const result = await api("/api/analytics/delays");
    analyticsDelays = normalizeData(result);

    renderAnalytics();
    setAnalyticsStatus("Loaded delay analytics.");
  } catch (error) {
    setAnalyticsStatus(`Delay analytics failed: ${error.message}`);
  }
}

function renderAll() {
  renderCommitments();
  renderCategories();
  renderReminders();
}

function renderAnalytics() {
  renderSummaryAnalytics();
  renderCategoryAnalytics();
  renderDelayAnalytics();
}

function renderSummaryAnalytics() {
  if (!analyticsSummary) {
    summaryStats.innerHTML = `<div class="item"><p>No summary analytics loaded.</p></div>`;
    return;
  }

  const entries = Object.entries(analyticsSummary);

  summaryStats.innerHTML = entries.map(([key, value]) => `
    <div class="stat-box">
      <div class="stat-label">${escapeHtml(formatKey(key))}</div>
      <div class="stat-value">${escapeHtml(String(value ?? "N/A"))}</div>
    </div>
  `).join("");
}

function renderCategoryAnalytics() {
  if (!analyticsCategories.length) {
    categoryAnalyticsList.innerHTML = `<div class="item"><p>No category analytics loaded.</p></div>`;
    return;
  }

  categoryAnalyticsList.innerHTML = analyticsCategories.map((item) => `
    <div class="item">
      <h3>${escapeHtml(item.categoryName || item.name || "Category")}</h3>
      <p><span class="pill">Total: ${escapeHtml(String(item.total ?? item.count ?? 0))}</span></p>
      ${item.completed !== undefined ? `<p><strong>Completed:</strong> ${escapeHtml(String(item.completed))}</p>` : ""}
      ${item.overdue !== undefined ? `<p><strong>Overdue:</strong> ${escapeHtml(String(item.overdue))}</p>` : ""}
      ${item.lateStarts !== undefined ? `<p><strong>Late Starts:</strong> ${escapeHtml(String(item.lateStarts))}</p>` : ""}
      ${item.averageDelayDays !== undefined ? `<p><strong>Average Delay Days:</strong> ${escapeHtml(String(item.averageDelayDays))}</p>` : ""}
    </div>
  `).join("");
}

function renderDelayAnalytics() {
  if (!analyticsDelays.length) {
    delayAnalyticsList.innerHTML = `<div class="item"><p>No delay analytics loaded.</p></div>`;
    return;
  }

  delayAnalyticsList.innerHTML = analyticsDelays.map((item, index) => `
    <div class="item">
      <h3>${escapeHtml(item.title || item.categoryName || `Delay Item ${index + 1}`)}</h3>
      ${item.commitmentId ? `<p><strong>Commitment ID:</strong> ${escapeHtml(item.commitmentId)}</p>` : ""}
      ${item.categoryId ? `<p><strong>Category ID:</strong> ${escapeHtml(item.categoryId)}</p>` : ""}
      ${item.delayDays !== undefined ? `<p><strong>Delay Days:</strong> ${escapeHtml(String(item.delayDays))}</p>` : ""}
      ${item.lateStarts !== undefined ? `<p><strong>Late Starts:</strong> ${escapeHtml(String(item.lateStarts))}</p>` : ""}
      ${item.overdueCount !== undefined ? `<p><strong>Overdue Count:</strong> ${escapeHtml(String(item.overdueCount))}</p>` : ""}
      ${item.averageDelayDays !== undefined ? `<p><strong>Average Delay Days:</strong> ${escapeHtml(String(item.averageDelayDays))}</p>` : ""}
    </div>
  `).join("");
}

/* ---------------- Commitments ---------------- */

function getCommitmentPayload() {
  return {
    title: commitmentTitle.value.trim(),
    description: commitmentDescription.value.trim(),
    dueDate: toIsoDate(commitmentDueDate.value),
    mustStartByDate: toIsoDate(commitmentMustStartByDate.value),
    estimatedHours: Number(commitmentEstimatedHours.value),
    priority: commitmentPriority.value,
    status: commitmentStatus.value,
    categoryId: commitmentCategoryId.value.trim() || null
  };
}

function clearCommitmentForm() {
  commitmentTitle.value = "";
  commitmentDescription.value = "";
  commitmentDueDate.value = "";
  commitmentMustStartByDate.value = "";
  commitmentEstimatedHours.value = "2";
  commitmentPriority.value = "medium";
  commitmentStatus.value = "pending";
  commitmentCategoryId.value = "";
}

function cancelCommitmentEdit() {
  editingCommitmentId = null;
  commitmentMode.textContent = "Mode: Create";
  clearCommitmentForm();
}

function validateCommitment(payload) {
  if (!payload.title) return "Commitment title is required.";
  if (!payload.dueDate) return "Commitment due date is required.";
  if (!payload.mustStartByDate) return "Commitment must-start-by date is required.";
  if (!payload.estimatedHours || payload.estimatedHours < 1) return "Estimated hours must be at least 1.";
  return null;
}

async function saveCommitment() {
  try {
    if (!idToken) return setMessage("Login first.");

    const payload = getCommitmentPayload();
    const error = validateCommitment(payload);
    if (error) return setMessage(error);

    if (editingCommitmentId) {
      await api(`/api/commitments/${editingCommitmentId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setMessage("Commitment updated.");
    } else {
      await api("/api/commitments", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setMessage("Commitment created.");
    }

    cancelCommitmentEdit();
    await refreshAll();
    await loadAllAnalytics();
  } catch (error) {
    setMessage(`Commitment save failed: ${error.message}`);
  }
}

function startCommitmentEdit(id) {
  const item = commitments.find((x) => x.id === id);
  if (!item) return setMessage("Commitment not found.");

  editingCommitmentId = id;
  commitmentMode.textContent = `Mode: Edit (${id})`;

  commitmentTitle.value = item.title || "";
  commitmentDescription.value = item.description || "";
  commitmentDueDate.value = toLocalInputValue(item.dueDate);
  commitmentMustStartByDate.value = toLocalInputValue(item.mustStartByDate);
  commitmentEstimatedHours.value = item.estimatedHours ?? 1;
  commitmentPriority.value = item.priority || "medium";
  commitmentStatus.value = item.status || "pending";
  commitmentCategoryId.value = item.categoryId || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteCommitment(id) {
  try {
    if (!confirm("Delete this commitment?")) return;
    await api(`/api/commitments/${id}`, { method: "DELETE" });
    if (editingCommitmentId === id) cancelCommitmentEdit();
    setMessage("Commitment deleted.");
    await refreshAll();
    await loadAllAnalytics();
  } catch (error) {
    setMessage(`Commitment delete failed: ${error.message}`);
  }
}

function renderCommitments() {
  if (!commitments.length) {
    commitmentsList.innerHTML = `<div class="item"><p>No commitments found.</p></div>`;
    return;
  }

  commitmentsList.innerHTML = commitments.map((item) => `
    <div class="item">
      <h3>${escapeHtml(item.title || "Untitled")}</h3>
      <p>${escapeHtml(item.description || "No description")}</p>
      <p>
        <span class="pill">Priority: ${escapeHtml(item.priority || "n/a")}</span>
        <span class="pill">Status: ${escapeHtml(item.status || "n/a")}</span>
      </p>
      <p><strong>Due:</strong> ${formatDate(item.dueDate)}</p>
      <p><strong>Must Start By:</strong> ${formatDate(item.mustStartByDate)}</p>
      <p><strong>Hours:</strong> ${escapeHtml(String(item.estimatedHours ?? ""))}</p>
      <p><strong>Category ID:</strong> ${escapeHtml(item.categoryId || "None")}</p>
      <p class="small">ID: ${escapeHtml(item.id || "")}</p>
      <div class="btn-row">
        <button class="warning" data-edit-commitment="${item.id}">Edit</button>
        <button class="danger" data-delete-commitment="${item.id}">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-commitment]").forEach((btn) => {
    btn.addEventListener("click", () => startCommitmentEdit(btn.dataset.editCommitment));
  });

  document.querySelectorAll("[data-delete-commitment]").forEach((btn) => {
    btn.addEventListener("click", () => deleteCommitment(btn.dataset.deleteCommitment));
  });
}

/* ---------------- Categories ---------------- */

function getCategoryPayload() {
  return {
    name: categoryName.value.trim(),
    color: categoryColor.value.trim() || ""
  };
}

function clearCategoryForm() {
  categoryName.value = "";
  categoryColor.value = "";
}

function cancelCategoryEdit() {
  editingCategoryId = null;
  categoryMode.textContent = "Mode: Create";
  clearCategoryForm();
}

function validateCategory(payload) {
  if (!payload.name) return "Category name is required.";
  return null;
}

async function saveCategory() {
  try {
    if (!idToken) return setMessage("Login first.");

    const payload = getCategoryPayload();
    const error = validateCategory(payload);
    if (error) return setMessage(error);

    if (editingCategoryId) {
      await api(`/api/categories/${editingCategoryId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setMessage("Category updated.");
    } else {
      await api("/api/categories", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setMessage("Category created.");
    }

    cancelCategoryEdit();
    await refreshAll();
    await loadAllAnalytics();
  } catch (error) {
    setMessage(`Category save failed: ${error.message}`);
  }
}

function startCategoryEdit(id) {
  const item = categories.find((x) => x.id === id);
  if (!item) return setMessage("Category not found.");

  editingCategoryId = id;
  categoryMode.textContent = `Mode: Edit (${id})`;

  categoryName.value = item.name || "";
  categoryColor.value = item.color || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteCategory(id) {
  try {
    if (!confirm("Delete this category?")) return;
    await api(`/api/categories/${id}`, { method: "DELETE" });
    if (editingCategoryId === id) cancelCategoryEdit();
    setMessage("Category deleted.");
    await refreshAll();
    await loadAllAnalytics();
  } catch (error) {
    setMessage(`Category delete failed: ${error.message}`);
  }
}

function renderCategories() {
  if (!categories.length) {
    categoriesList.innerHTML = `<div class="item"><p>No categories found.</p></div>`;
    return;
  }

  categoriesList.innerHTML = categories.map((item) => `
    <div class="item">
      <h3>${escapeHtml(item.name || "Unnamed")}</h3>
      <p><span class="pill">Color: ${escapeHtml(item.color || "none")}</span></p>
      <p class="small">ID: ${escapeHtml(item.id || "")}</p>
      <div class="btn-row">
        <button class="warning" data-edit-category="${item.id}">Edit</button>
        <button class="danger" data-delete-category="${item.id}">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-category]").forEach((btn) => {
    btn.addEventListener("click", () => startCategoryEdit(btn.dataset.editCategory));
  });

  document.querySelectorAll("[data-delete-category]").forEach((btn) => {
    btn.addEventListener("click", () => deleteCategory(btn.dataset.deleteCategory));
  });
}

/* ---------------- Reminders ---------------- */

function getReminderPayload() {
  return {
    commitmentId: reminderCommitmentId.value.trim(),
    reminderDate: toIsoDate(reminderDate.value),
    type: reminderType.value,
    deliveryState: reminderDeliveryState.value
  };
}

function clearReminderForm() {
  reminderCommitmentId.value = "";
  reminderDate.value = "";
  reminderType.value = "system";
  reminderDeliveryState.value = "pending";
}

function cancelReminderEdit() {
  editingReminderId = null;
  reminderMode.textContent = "Mode: Create";
  clearReminderForm();
}

function validateReminder(payload) {
  if (!payload.commitmentId) return "Reminder commitmentId is required.";
  if (!payload.reminderDate) return "Reminder date is required.";
  return null;
}

async function saveReminder() {
  try {
    if (!idToken) return setMessage("Login first.");

    const payload = getReminderPayload();
    const error = validateReminder(payload);
    if (error) return setMessage(error);

    if (editingReminderId) {
      await api(`/api/reminders/${editingReminderId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setMessage("Reminder updated.");
    } else {
      await api("/api/reminders", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setMessage("Reminder created.");
    }

    cancelReminderEdit();
    await refreshAll();
    await loadAllAnalytics();
  } catch (error) {
    setMessage(`Reminder save failed: ${error.message}`);
  }
}

function startReminderEdit(id) {
  const item = reminders.find((x) => x.id === id);
  if (!item) return setMessage("Reminder not found.");

  editingReminderId = id;
  reminderMode.textContent = `Mode: Edit (${id})`;

  reminderCommitmentId.value = item.commitmentId || "";
  reminderDate.value = toLocalInputValue(item.reminderDate);
  reminderType.value = item.type || "system";
  reminderDeliveryState.value = item.deliveryState || "pending";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteReminder(id) {
  try {
    if (!confirm("Delete this reminder?")) return;
    await api(`/api/reminders/${id}`, { method: "DELETE" });
    if (editingReminderId === id) cancelReminderEdit();
    setMessage("Reminder deleted.");
    await refreshAll();
    await loadAllAnalytics();
  } catch (error) {
    setMessage(`Reminder delete failed: ${error.message}`);
  }
}

function renderReminders() {
  if (!reminders.length) {
    remindersList.innerHTML = `<div class="item"><p>No reminders found.</p></div>`;
    return;
  }

  remindersList.innerHTML = reminders.map((item) => `
    <div class="item">
      <h3>Reminder</h3>
      <p><span class="pill">Type: ${escapeHtml(item.type || "n/a")}</span></p>
      <p><span class="pill">State: ${escapeHtml(item.deliveryState || "n/a")}</span></p>
      <p><strong>Commitment ID:</strong> ${escapeHtml(item.commitmentId || "")}</p>
      <p><strong>Reminder Date:</strong> ${formatDate(item.reminderDate)}</p>
      <p class="small">ID: ${escapeHtml(item.id || "")}</p>
      <div class="btn-row">
        <button class="warning" data-edit-reminder="${item.id}">Edit</button>
        <button class="danger" data-delete-reminder="${item.id}">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-reminder]").forEach((btn) => {
    btn.addEventListener("click", () => startReminderEdit(btn.dataset.editReminder));
  });

  document.querySelectorAll("[data-delete-reminder]").forEach((btn) => {
    btn.addEventListener("click", () => deleteReminder(btn.dataset.deleteReminder));
  });
}

/* ---------------- Shared ---------------- */

function clearAllForms() {
  cancelCommitmentEdit();
  cancelCategoryEdit();
  cancelReminderEdit();
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatKey(value) {
  return String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}