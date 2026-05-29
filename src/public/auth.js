// auth.js - TaskFlow Authentication Client

document.addEventListener("DOMContentLoaded", () => {
  // If already logged in, redirect to dashboard
  if (localStorage.getItem("token")) {
    window.location.href = "dashboard.html";
  }
});

// Switch between Login and Register tabs
function switchTab(tab) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const errorBox = document.getElementById("error-message");
  const successBox = document.getElementById("success-message");

  // Reset messages
  errorBox.style.display = "none";
  errorBox.textContent = "";
  successBox.style.display = "none";
  successBox.textContent = "";

  if (tab === "login") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    document.title = "Login | TaskFlow";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    tabLogin.classList.remove("active");
    tabRegister.classList.add("active");
    document.title = "Register | TaskFlow";
  }
}

// Show error message
function showError(message) {
  const errorBox = document.getElementById("error-message");
  const successBox = document.getElementById("success-message");
  
  successBox.style.display = "none";
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

// Show success message
function showSuccess(message) {
  const errorBox = document.getElementById("error-message");
  const successBox = document.getElementById("success-message");
  
  errorBox.style.display = "none";
  successBox.textContent = message;
  successBox.style.display = "block";
}

// Set button loading state
function setSubmitting(btnId, isSubmitting, text) {
  const btn = document.getElementById(btnId);
  if (isSubmitting) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> <span>${text}...</span>`;
  } else {
    btn.disabled = false;
    btn.innerHTML = `<span>${text}</span>`;
  }
}

// Handle Login Form Submission
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  
  if (!email || !password) {
    showError("Please fill in all fields");
    return;
  }
  
  setSubmitting("btn-login-submit", true, "Signing In");
  
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || "Authentication failed");
    }
    
    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username || "User");
    
    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    showError(err.message);
  } finally {
    setSubmitting("btn-login-submit", false, "Sign In");
  }
}

// Handle Register Form Submission
async function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  
  if (!email || !password) {
    showError("Email and Password are required");
    return;
  }
  
  setSubmitting("btn-register-submit", true, "Creating Account");
  
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || "Registration failed");
    }
    
    // Registration success: switch to login
    switchTab("login");
    showSuccess(data.msg || "Account created! Please log in.");
    
    // Pre-fill the login email field
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = "";
    document.getElementById("login-password").focus();
  } catch (err) {
    showError(err.message);
  } finally {
    setSubmitting("btn-register-submit", false, "Create Account");
  }
}
