
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initSignupModal();
});
