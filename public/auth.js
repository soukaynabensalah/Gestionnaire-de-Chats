
// Gestion de la modal d'inscription (injectée dynamiquement)
function initSignupModal() {
    // 1. Injecter le HTML de la modal d'inscription si elle n'existe pas
    if (!document.getElementById('signupModal')) {
        const signupModalHTML = `
        <div id="signupModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-user-plus"></i> Inscription</h2>
                    <button class="close-btn close-signup-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="signupForm">
                        <div class="form-group">
                            <label for="signupName"><i class="fas fa-user"></i> Nom complet</label>
                            <input type="text" id="signupName" required placeholder="Entrez votre nom">
                        </div>
                        <div class="form-group">
                            <label for="signupEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="signupEmail" required placeholder="Entrez votre email">
                        </div>
                        <div class="form-group">
                            <label for="signupPwd"><i class="fas fa-lock"></i> Mot de passe</label>
                            <input type="password" id="signupPwd" required placeholder="Choisissez un mot de passe">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> S'inscrire
                            </button>
                            <button type="button" class="btn btn-secondary close-signup-modal">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', signupModalHTML);
    }

    // 2. Injecter le HTML de la modal de message (feedback) si elle n'existe pas
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

    // Éléments de la modal de message
    const authMessageModal = document.getElementById('authMessageModal');
    const authMessageTitle = document.getElementById('authMessageTitle');
    const authMessageText = document.getElementById('authMessageText');
    const closeAuthMessageBtns = document.querySelectorAll('.close-auth-message');

    // Fonction pour afficher un message
    function showAuthMessage(title, message, isError = false) {
        authMessageTitle.textContent = title;
        authMessageText.textContent = message;

        // Optionnel : changer la couleur du titre en cas d'erreur
        if (isError) {
            authMessageTitle.style.color = 'var(--danger-color)';
        } else {
            authMessageTitle.style.color = ''; // Reset (utilisera le style CSS par défaut ou un style spécifique)
        }

        authMessageModal.classList.add('active');
    }

    // Fermeture de la modal de message
    closeAuthMessageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authMessageModal.classList.remove('active');
        });
    });

    // Ouvrir la modal d'inscription
    signupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            signupModal.classList.add('active');
        });
    });

    // Fermer la modal d'inscription
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            signupModal.classList.remove('active');
        });
    });

    // Gérer la soumission du formulaire
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
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('Utilisateur inscrit:', result);

            signupModal.classList.remove('active');
            showAuthMessage('Succès', 'Compte créé avec succès ! Bienvenue.');
            signupForm.reset();

        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            showAuthMessage('Erreur', 'Impossible de créer le compte. Veuillez réessayer.', true);
        }
    });

    // Fermer les modales en cliquant à l'extérieur (géré globalement par script.js s'il est présent, 
    // mais on ajoute une sécurité ici pour authMessageModal et signupModal si script.js n'est pas là)
    window.addEventListener('click', (e) => {
        if (e.target === authMessageModal) {
            authMessageModal.classList.remove('active');
        }
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });
}

// Gestion de la modal de connexion (login)
function initLoginModal() {
    // 1. Injecter le HTML de la modal de login si elle n'existe pas
    if (!document.getElementById('loginModal')) {
        const loginModalHTML = `
        <div id="loginModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-sign-in-alt"></i> Connexion</h2>
                    <button class="close-btn close-login-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="loginEmail" required placeholder="Entrez votre email">
                        </div>
                        <div class="form-group">
                            <label for="loginPwd"><i class="fas fa-lock"></i> Mot de passe</label>
                            <input type="password" id="loginPwd" required placeholder="Entrez votre mot de passe">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Se connecter
                            </button>
                            <button type="button" class="btn btn-secondary close-login-modal">
                                Annuler
                            </button>
                        </div>
                        <div class="form-footer">
                            <p>Pas encore de compte ? <a href="#" class="btn-signup">S'inscrire</a></p>
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

    // Éléments de la modal de message (déjà créée par initSignupModal)
    const authMessageModal = document.getElementById('authMessageModal');
    const authMessageTitle = document.getElementById('authMessageTitle');
    const authMessageText = document.getElementById('authMessageText');

    // Fonction pour afficher un message (réutilisée)
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

    // Ouvrir la modal de login
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            loginModal.classList.add('active');
        });
    });

    // Fermer la modal de login
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    });

    // Gérer la soumission du formulaire de login
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
                throw new Error(result.error || 'Erreur de connexion');
            }

            console.log('Utilisateur connecté:', result);

            // Stocker les infos utilisateur dans localStorage
            localStorage.setItem('user', JSON.stringify(result.user));

            loginModal.classList.remove('active');
            showAuthMessage('Succès', `Bienvenue ${result.user.name} ! Connexion réussie.`);
            loginForm.reset();

            // Optionnel : rediriger vers une page après connexion
            setTimeout(() => {
                window.location.href = 'cats.html';
            }, 1500);

        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            showAuthMessage('Erreur', error.message || 'Impossible de se connecter. Veuillez réessayer.', true);
        }
    });

    // Fermer la modal en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initSignupModal();
    initLoginModal();
});
