
// Signup modal management (dynamically injected)
function initSignupModal() {
    // 1. Inject signup modal HTML if it doesn't exist
    if (!document.getElementById('signupModal')) {
        const signupModalHTML = `
        <div id="signupModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-user-plus"></i> Sign Up</h2>
                    <button class="close-btn close-signup-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="signupForm">
                        <div class="form-group">
                            <label for="signupName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="signupName" required placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="signupEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="signupEmail" required placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="signupPwd"><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="signupPwd" required placeholder="Choose a password">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Sign Up
                            </button>
                            <button type="button" class="btn btn-secondary close-signup-modal">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', signupModalHTML);
    }

    // 2. Inject message modal HTML (feedback) if it doesn't exist
    if (!document.getElementById('authMessageModal')) {
        const messageModalHTML = `
        <div id="authMessageModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="authMessageTitle"></h2>
                    <button class="close-btn close-auth-message">&times;</button>
                </div>
                <div class="modal-body">
                    <p id="authMessageText"></p>
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary close-auth-message">OK</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', messageModalHTML);
    }

    const signupModal = document.getElementById('signupModal');
    const signupForm = document.getElementById('signupForm');
    const signupBtns = document.querySelectorAll('.btn-signup');
    const closeBtns = document.querySelectorAll('.close-signup-modal');

    // Message modal elements
    const authMessageModal = document.getElementById('authMessageModal');
    const authMessageTitle = document.getElementById('authMessageTitle');
    const authMessageText = document.getElementById('authMessageText');
    const closeAuthMessageBtns = document.querySelectorAll('.close-auth-message');

    // Function to display a message
    function showAuthMessage(title, message, isError = false) {
        authMessageTitle.textContent = title;
        authMessageText.textContent = message;

        // Optional: change title color in case of error
        if (isError) {
            authMessageTitle.style.color = 'var(--danger-color)';
        } else {
            authMessageTitle.style.color = ''; // Reset (will use default CSS style)
        }

        authMessageModal.classList.add('active');
    }

    // Close message modal
    closeAuthMessageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authMessageModal.classList.remove('active');
        });
    });

    // Open signup modal
    signupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            signupModal.classList.add('active');
        });
    });

    // Close signup modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            signupModal.classList.remove('active');
        });
    });

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const pwd = document.getElementById('signupPwd').value;
        const API_BASE_URL = window.location.origin;

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, pwd })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result = await response.json();
            console.log('User registered:', result);

            signupModal.classList.remove('active');
            showAuthMessage('Success', 'Account created successfully! Welcome.');
            signupForm.reset();

        } catch (error) {
            console.error('Registration error:', error);
            showAuthMessage('Error', 'Unable to create account. Please try again.', true);
        }
    });

    // Close modals by clicking outside (handled globally by script.js if present,
    // but we add a safety here for authMessageModal and signupModal if script.js is not there)
    window.addEventListener('click', (e) => {
        if (e.target === authMessageModal) {
            authMessageModal.classList.remove('active');
        }
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });
}

// Login modal management
function initLoginModal() {
    // 1. Inject login modal HTML if it doesn't exist
    if (!document.getElementById('loginModal')) {
        const loginModalHTML = `
        <div id="loginModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
                    <button class="close-btn close-login-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="loginEmail" required placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="loginPwd"><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="loginPwd" required placeholder="Enter your password">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Sign In
                            </button>
                            <button type="button" class="btn btn-secondary close-login-modal">
                                Cancel
                            </button>
                        </div>
                        <div class="form-footer">
                            <p>Don't have an account yet? <a href="#" class="btn-signup">Sign up</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loginModalHTML);
    }

    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginBtns = document.querySelectorAll('.btn-signin');
    const closeBtns = document.querySelectorAll('.close-login-modal');

    // Message modal elements (already created by initSignupModal)
    const authMessageModal = document.getElementById('authMessageModal');
    const authMessageTitle = document.getElementById('authMessageTitle');
    const authMessageText = document.getElementById('authMessageText');

    // Function to display a message (reused)
    function showAuthMessage(title, message, isError = false) {
        if (!authMessageModal) return;

        authMessageTitle.textContent = title;
        authMessageText.textContent = message;

        if (isError) {
            authMessageTitle.style.color = 'var(--danger-color)';
        } else {
            authMessageTitle.style.color = '';
        }

        authMessageModal.classList.add('active');
    }

    // Open login modal
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            loginModal.classList.add('active');
        });
    });

    // Close login modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const pwd = document.getElementById('loginPwd').value;
        const API_BASE_URL = window.location.origin;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pwd })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Connection error');
            }

            console.log('User logged in:', result);

            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));

            loginModal.classList.remove('active');
            showAuthMessage('Success', `Welcome ${result.user.name}! Login successful.`);
            loginForm.reset();

            // Optional: redirect to a page after login
            setTimeout(() => {
                window.location.href = 'cats.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            showAuthMessage('Error', error.message || 'Unable to connect. Please try again.', true);
        }
    });

    // Close modal by clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSignupModal();
    initLoginModal();
});
