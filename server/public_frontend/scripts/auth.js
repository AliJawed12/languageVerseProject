/**
 * auth.js
 * LanguageVerse Auth
 * Handles login, register, logout — same dropdown pattern as flashback
 */

// ─── Auth State ───────────────────────────────────────────────────────────────

let authPanelOpen = false;
let currentUser   = null;

// ─── Init ─────────────────────────────────────────────────────────────────────

async function initAuth() {
  injectAuthButton();
  injectAuthPanel();
  await checkAuthOnLoad();
}

// ─── Inject Button into Header (same as flashback) ────────────────────────────

function injectAuthButton() {
  const header = document.querySelector('.header');
  if (!header) return;

  header.style.display        = 'flex';
  header.style.alignItems     = 'center';
  header.style.justifyContent = 'space-between';

  // Create a right-side button group if it doesn't exist yet
  let btnGroup = document.getElementById('header-btn-group');
  if (!btnGroup) {
    btnGroup = document.createElement('div');
    btnGroup.id = 'header-btn-group';
    btnGroup.style.display    = 'flex';
    btnGroup.style.alignItems = 'center';
    btnGroup.style.gap        = '0.75rem';
    btnGroup.style.marginLeft = 'auto';
    header.appendChild(btnGroup);
  }

  const btn = document.createElement('button');
  btn.id          = 'auth-header-btn';
  btn.className   = 'auth-header-btn';
  btn.textContent = '👤 Login';
  btn.addEventListener('click', toggleAuthPanel);
  btnGroup.appendChild(btn);
}

// ─── Inject Panel (same pattern as flashback panel) ───────────────────────────

function injectAuthPanel() {
  const panel = document.createElement('div');
  panel.id        = 'auth-panel';
  panel.className = 'auth-panel auth-panel--hidden';

  panel.innerHTML = `
    <div class="auth-panel-inner">
      

      <!-- Logged OUT view -->
      <div id="auth-logged-out">
        <div class="auth-header-content">
          <div class="auth-icon">👤</div>
          <h2 class="auth-title">Welcome to LanguageVerse</h2>
          <p class="auth-subtitle">Log in or create an account to track your progress.</p>
        </div>

        <!-- Tab Toggle -->
        <div class="auth-tabs">
          <button class="auth-tab auth-tab--active" id="tab-login" onclick="switchTab('login')">Log In</button>
          <button class="auth-tab" id="tab-register" onclick="switchTab('register')">Register</button>
        </div>

        <!-- Login Form -->
        <div id="auth-form-login" class="auth-form">
          <input type="email"    id="login-email"    class="auth-input" placeholder="Email address" />
          <input type="password" id="login-password" class="auth-input" placeholder="Password" />
          <button class="auth-submit-btn" onclick="handleLogin()">Log In</button>
          <p id="login-error" class="auth-error"></p>
        </div>

        <!-- Register Form (hidden by default) -->
        <div id="auth-form-register" class="auth-form" style="display:none;">
          <input type="email"    id="register-email"    class="auth-input" placeholder="Email address" />
          <input type="password" id="register-password" class="auth-input" placeholder="Password" />
          <button class="auth-submit-btn" onclick="handleRegister()">Create Account</button>
          <p id="register-error" class="auth-error"></p>
        </div>
      </div>

      <!-- Logged IN view (hidden by default) -->
      <div id="auth-logged-in" style="display:none;">
        <div class="auth-header-content">
          <div class="auth-icon">✅</div>
          <h2 class="auth-title">You're logged in!</h2>
          <p class="auth-subtitle" id="auth-user-email"></p>
        </div>
        <button class="auth-logout-btn" onclick="handleLogout()">Log Out</button>
      </div>

    </div>
  `;

  // Insert right after the header, same as flashback panel
  const header = document.querySelector('.header');
  header.insertAdjacentElement('afterend', panel);

  
}

// ─── Panel Open / Close ───────────────────────────────────────────────────────

function toggleAuthPanel() {
  authPanelOpen ? closeAuthPanel() : openAuthPanel();
}

function openAuthPanel() {
  // Close flashback panel if it's open
  if (typeof closeFlashbackPanel === 'function' && flashbackOpen) {
    closeFlashbackPanel();
  }

  authPanelOpen = true;
  const panel = document.getElementById('auth-panel');
  panel.classList.remove('auth-panel--hidden');
  panel.classList.add('auth-panel--visible');
  clearErrors();
}

function closeAuthPanel() {
  authPanelOpen = false;
  const panel = document.getElementById('auth-panel');
  panel.classList.remove('auth-panel--visible');
  panel.classList.add('auth-panel--hidden');
}

// ─── Tab Switching ────────────────────────────────────────────────────────────

function switchTab(tab) {
  const loginForm    = document.getElementById('auth-form-login');
  const registerForm = document.getElementById('auth-form-register');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');

  clearErrors();

  if (tab === 'login') {
    loginForm.style.display    = '';
    registerForm.style.display = 'none';
    tabLogin.classList.add('auth-tab--active');
    tabRegister.classList.remove('auth-tab--active');
  } else {
    loginForm.style.display    = 'none';
    registerForm.style.display = '';
    tabRegister.classList.add('auth-tab--active');
    tabLogin.classList.remove('auth-tab--active');
  }
}

// ─── Auth Actions ─────────────────────────────────────────────────────────────

async function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showError('login-error', 'Please fill in both fields.');
    return;
  }

  const res  = await fetch('/server/auth/login', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    currentUser = data;
    updateHeaderButton(data.email);
    showLoggedInView(data.email);
    closeAuthPanel();
  } else {
    showError('login-error', data.error);
  }
}

async function handleRegister() {
  const email    = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  if (!email || !password) {
    showError('register-error', 'Please fill in both fields.');
    return;
  }

  const res  = await fetch('/server/auth/register', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    // Auto login right after registering
    document.getElementById('login-email').value    = email;
    document.getElementById('login-password').value = password;
    switchTab('login');
    await handleLogin();
  } else {
    showError('register-error', data.error);
  }
}

async function handleLogout() {
  await fetch('/server/auth/logout', { method: 'POST' });
  currentUser = null;
  updateHeaderButton('👤 Login');
  showLoggedOutView();
  closeAuthPanel();
}

// ─── Check Auth on Page Load ──────────────────────────────────────────────────

async function checkAuthOnLoad() {
  const res = await fetch('/server/auth/me');
  if (res.ok) {
    const data = await res.json();
    currentUser = data;
    updateHeaderButton(data.email);
    // Don't open the panel — just update the button silently
    // The logged-in view will show if they click the button
    updatePanelToLoggedIn(data.email);
  }
  // If 401, do nothing — panel stays in logged out state by default
}

// ─── UI State Helpers ─────────────────────────────────────────────────────────

function updateHeaderButton(label) {
  const btn = document.getElementById('auth-header-btn');
  if (!btn) return;
  // Show a short version of email or the default label
  btn.textContent = label.includes('@') ? '✅ ' + label.split('@')[0] : label;
}

function showLoggedInView(email) {
  document.getElementById('auth-logged-out').style.display = 'none';
  document.getElementById('auth-logged-in').style.display  = '';
  document.getElementById('auth-user-email').textContent   = email;
}

function showLoggedOutView() {
  document.getElementById('auth-logged-out').style.display = '';
  document.getElementById('auth-logged-in').style.display  = 'none';
}

function updatePanelToLoggedIn(email) {
  // Silently update the panel state without opening it
  showLoggedInView(email);
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  ['login-error', 'register-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}