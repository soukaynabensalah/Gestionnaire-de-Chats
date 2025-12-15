// Variables globales
let catsData = [];
let currentCatId = null;

// Éléments DOM
const catsContainer = document.getElementById('catsContainer');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const totalCatsElement = document.getElementById('totalCats');
const visibleCatsElement = document.getElementById('visibleCats');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const addCatBtn = document.getElementById('addCatBtn');

// Modales
const addModal = document.getElementById('addModal');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const messageModal = document.getElementById('messageModal');

// Formulaires
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const quickUpdateBtn = document.getElementById('quickUpdateBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// URL de base de l'API (à adapter si nécessaire)
const API_BASE_URL = window.location.origin;

// Fonctions utilitaires
function showLoading() {
    loadingElement.classList.add('active');
    catsContainer.innerHTML = '';
    noResultsElement.style.display = 'none';
}

function hideLoading() {
    loadingElement.classList.remove('active');
}

function showMessage(title, message) {
    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = message;
    messageModal.classList.add('active');
}

function closeAllModals() {
    addModal.classList.remove('active');
    editModal.classList.remove('active');
    deleteModal.classList.remove('active');
    messageModal.classList.remove('active');
}

function openModal(modal) {
    closeAllModals();
    modal.classList.add('active');
}

// Récupérer tous les chats
async function fetchCats() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/cats`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        catsData = await response.json();
        displayCats(catsData);
        updateStats();
        
    } catch (error) {
        console.error('Erreur lors de la récupération des chats:', error);
        showMessage('Erreur', 'Impossible de charger les chats. Vérifiez la connexion au serveur.');
    } finally {
        hideLoading();
    }
}

// Afficher les chats dans le conteneur
function displayCats(cats) {
    if (cats.length === 0) {
        catsContainer.innerHTML = '';
        noResultsElement.style.display = 'block';
        return;
    }
    
    noResultsElement.style.display = 'none';
    
    const catsHTML = cats.map(cat => `
        <div class="cat-card" data-id="${cat.id}">
            <img src="${cat.img || 'catDefault.jpeg'}" 
                 alt="${cat.name}" class="cat-image">
            <div class="cat-details">
                <h3 class="cat-name">${cat.name}</h3>
                <span class="cat-tag">${cat.tag || 'Non spécifié'}</span>
                <p class="cat-description">${cat.description || 'Aucune description disponible.'}</p>
                <div class="cat-actions">
                    <button class="btn btn-primary edit-btn" data-id="${cat.id}">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-danger delete-btn" data-id="${cat.id}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    catsContainer.innerHTML = catsHTML;
    
    // Ajouter les événements aux boutons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catId = e.currentTarget.getAttribute('data-id');
            openEditModal(catId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catId = e.currentTarget.getAttribute('data-id');
            openDeleteModal(catId);
        });
    });
}

// Mettre à jour les statistiques
function updateStats() {
    totalCatsElement.textContent = catsData.length;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCats = catsData.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm) || 
        cat.tag.toLowerCase().includes(searchTerm) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm))
    );
    
    visibleCatsElement.textContent = filteredCats.length;
}

// Ouvrir la modal d'ajout
addCatBtn.addEventListener('click', () => {
    addForm.reset();
    openModal(addModal);
});

// Ouvrir la modal d'édition
async function openEditModal(catId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cats/${catId}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const cat = await response.json();
        
        if (cat.length > 0) {
            const catData = cat[0];
            currentCatId = catId;
            
            document.getElementById('editId').value = catId;
            document.getElementById('editName').value = catData.name;
            document.getElementById('editTag').value = catData.tag || '';
            document.getElementById('editDescription').value = catData.description || '';
            
            openModal(editModal);
        } else {
            showMessage('Erreur', 'Chat non trouvé.');
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération du chat:', error);
        showMessage('Erreur', 'Impossible de charger les données du chat.');
    }
}

// Ouvrir la modal de suppression
async function openDeleteModal(catId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cats/${catId}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const cat = await response.json();
        
        if (cat.length > 0) {
            const catData = cat[0];
            currentCatId = catId;
            
            document.getElementById('deleteCatName').textContent = catData.name;
            document.getElementById('deleteCatTag').textContent = catData.tag || 'Aucune étiquette';
            document.getElementById('deleteCatImage').src = catData.img || 'https://images.unsplash.com/photo-1514888286974-6d03bde4ba1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
            
            openModal(deleteModal);
        } else {
            showMessage('Erreur', 'Chat non trouvé.');
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération du chat:', error);
        showMessage('Erreur', 'Impossible de charger les données du chat.');
    }
}

// Ajouter un chat
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        tag: document.getElementById('tag').value,
        description: document.getElementById('description').value,
        img: document.getElementById('img').value || undefined
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/cats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Chat ajouté:', result);
        
        closeAllModals();
        showMessage('Succès', 'Le chat a été ajouté avec succès!');
        fetchCats();
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout du chat:', error);
        showMessage('Erreur', 'Impossible d\'ajouter le chat. Vérifiez la connexion au serveur.');
    }
});

// Modifier un chat (PUT - mise à jour complète)
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentCatId) return;
    
    const formData = {
        name: document.getElementById('editName').value,
        tag: document.getElementById('editTag').value,
        description: document.getElementById('editDescription').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/cats/${currentCatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Chat modifié:', result);
        
        closeAllModals();
        showMessage('Succès', 'Le chat a été modifié avec succès!');
        fetchCats();
        
    } catch (error) {
        console.error('Erreur lors de la modification du chat:', error);
        showMessage('Erreur', 'Impossible de modifier le chat. Vérifiez la connexion au serveur.');
    }
});

// Mettre à jour uniquement le nom (PATCH)
quickUpdateBtn.addEventListener('click', async () => {
    if (!currentCatId) return;
    
    const newName = document.getElementById('editName').value;
    
    if (!newName.trim()) {
        showMessage('Erreur', 'Le nom ne peut pas être vide.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/cats/${currentCatId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Nom modifié:', result);
        
        closeAllModals();
        showMessage('Succès', 'Le nom du chat a été modifié avec succès!');
        fetchCats();
        
    } catch (error) {
        console.error('Erreur lors de la modification du nom:', error);
        showMessage('Erreur', 'Impossible de modifier le nom du chat.');
    }
});

// Supprimer un chat
confirmDeleteBtn.addEventListener('click', async () => {
    if (!currentCatId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/cats/${currentCatId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Chat supprimé:', result);
        
        closeAllModals();
        showMessage('Succès', 'Le chat a été supprimé avec succès!');
        fetchCats();
        
    } catch (error) {
        console.error('Erreur lors de la suppression du chat:', error);
        showMessage('Erreur', 'Impossible de supprimer le chat.');
    }
});

// Filtrer les chats selon la recherche
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        displayCats(catsData);
    } else {
        const filteredCats = catsData.filter(cat => 
            cat.name.toLowerCase().includes(searchTerm) || 
            cat.tag.toLowerCase().includes(searchTerm) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm))
        );
        
        displayCats(filteredCats);
    }
    
    updateStats();
});

// Actualiser la liste
refreshBtn.addEventListener('click', fetchCats);

// Fermer les modales
document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

// Fermer la modal en cliquant à l'extérieur
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    fetchCats();
    
    // Message de bienvenue
    setTimeout(() => {
        console.log('Application frontend pour API de chats chargée!');
        console.log('URL de l\'API:', API_BASE_URL);
    }, 1000);
});