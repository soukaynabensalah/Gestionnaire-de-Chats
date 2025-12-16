// Variables globales
let catsData = [];
let currentCatId = null;

let currentPage = 1;
let itemsPerPage = 3;
let totalItems = 0;
let totalPages = 0;
let filteredCatsData = [];

// Éléments DOM
const catsContainer = document.getElementById('catsContainer');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const totalCatsElement = document.getElementById('totalCats');
const visibleCatsElement = document.getElementById('visibleCats');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const addCatBtn = document.getElementById('addCatBtn');

// Éléments de pagination
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const paginationInfo = document.getElementById('paginationInfo');
const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

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
    document.getElementById('paginationContainer').style.display = 'none';
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

        const data = await response.json();

        catsData = Array.isArray(data) ? data : (data.cats || []);
        filteredCatsData = [...catsData];

        applySearchFilter();
        updatePagination();

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
        document.getElementById('paginationContainer').style.display = 'none';
        return;
    }

    noResultsElement.style.display = 'none';
    document.getElementById('paginationContainer').style.display = 'flex';

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
    const filteredCount = catsData.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.tag.toLowerCase().includes(searchTerm) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm))
    ).length;

    visibleCatsElement.textContent = filteredCount;
}

// Gestion de la pagination
function updatePagination() {
    totalItems = filteredCatsData.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);

    // Ajuster la page courante si nécessaire
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1;
    }

    // Calculer les indices de début et fin
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    // Extraire les chats pour la page courante
    const currentPageCats = filteredCatsData.slice(startIndex, endIndex);

    // Afficher les chats
    displayCats(currentPageCats);

    // Mettre à jour l'interface de pagination
    updatePaginationUI();
}

function updatePaginationUI() {
    if (totalItems === 0) {
        paginationInfo.textContent = "Aucun chat";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    paginationInfo.textContent = `Page ${currentPage} sur ${totalPages} (${startIndex}-${endIndex} sur ${totalItems} chats)`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    updatePagination();
}

function changeItemsPerPage(value) {
    itemsPerPage = parseInt(value);
    currentPage = 1; // Retour à la première page
    updatePagination();
}

// Appliquer le filtre de recherche
function applySearchFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredCatsData = [...catsData];
    } else {
        filteredCatsData = catsData.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm) ||
            (cat.tag && cat.tag.toLowerCase().includes(searchTerm)) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm))
        );
    }

    currentPage = 1; // Retour à la première page après recherche
    updatePagination();
    updateStats();
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

// Événements de pagination
prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

itemsPerPageSelect.addEventListener('change', (e) => {
    changeItemsPerPage(e.target.value);
});

// Filtrer les chats selon la recherche
searchInput.addEventListener('input', () => {
    applySearchFilter();
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
        console.log('Pagination activée: ', itemsPerPage, 'chats par page');
    }, 1000);
});