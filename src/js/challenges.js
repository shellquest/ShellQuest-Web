document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let challengesData = [];
let currentChallengeId = null;

// Dom Elements
const elements = {
    loading: document.getElementById('loadingIndicator'),
    container: document.getElementById('challengesContainer'),
    list: document.getElementById('challengesList'),
    template: document.getElementById('rowTemplate'),
    userBtn: document.getElementById('userBtn'),
    userDropdown: document.getElementById('userDropdown'),
    logoutBtn: document.getElementById('logoutBtn'),
    settingsBtn: document.getElementById('settingsBtn'),

    // Modal
    modal: document.getElementById('challengeModal'),
    mTitle: document.getElementById('mTitle'),
    mTag: document.getElementById('mTag'),
    mDesc: document.getElementById('mDesc'),
    mFeedback: document.getElementById('modalFeedback'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnValidate: document.getElementById('btnValidate')
};

async function initApp() {
    setupEventListeners();
    await fetchChallenges();
}

function setupEventListeners() {
    // user menu dropdown
    elements.userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!elements.userBtn.contains(e.target) && !elements.userDropdown.contains(e.target)) {
            elements.userDropdown.classList.remove('show');
        }
    });

    elements.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("¿Cerrar sesión?")) window.location.href = "index.html";
    });

    elements.settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "settings.html";
    });

    // Modal
    elements.btnCloseModal.addEventListener('click', closeModal);
    elements.btnValidate.addEventListener('click', validateSolution);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });
}

async function fetchChallenges() {
    try {

        // Mock Data 
        challengesData = [
            { id: 1, title: "Hello Shell",
                tag: "LINUX", 
                completed: true, 
                desc: "Conéctate al servidor 1234"},
            {id: 2, title: "ls", tag: "LINUX", completed: false, desc: "Lista los archivos en el directorio /home/user/docs" },
        ];

        renderList();
        elements.loading.style.display = 'none';
        elements.container.style.display = 'block';

    } catch (error) {
        console.error("Error cargando desafíos:", error);
        elements.loading.textContent = "Error al cargar los datos.";
        elements.loading.style.color = "red";
    }
}

function renderList() {
    elements.list.innerHTML = '';
    
    challengesData.forEach(challenge => {

        const clone = elements.template.content.cloneNode(true);
        const row = clone.querySelector('.challenge-row');
        
        row.querySelector('.row-title').textContent = challenge.title;
        row.querySelector('.row-tag').textContent = challenge.tag;
        
        // Estado
        const statusDiv = row.querySelector('.row-status');
        if (challenge.completed) {
            row.classList.add('row-completed-bg');
            statusDiv.innerHTML = '<span class="status-badge status-completed">✔ Completado</span>';
        } else {
            statusDiv.innerHTML = '<span class="status-badge status-pending">Pendiente</span>';
        }

        row.addEventListener('click', () => openModal(challenge.id));

        elements.list.appendChild(clone);
    });
}

// Modal Functions

function openModal(id) {
    const challenge = challengesData.find(c => c.id === id);
    if (!challenge) return;

    currentChallengeId = id;

    elements.mTitle.textContent = challenge.title;
    elements.mTag.textContent = challenge.tag;
    elements.mDesc.textContent = challenge.desc;
    
    //feedback
    elements.mFeedback.style.display = 'none';
    elements.mFeedback.className = "feedback-msg";
    elements.btnValidate.style.display = 'inline-block';
    elements.modal.classList.add('active');
}

function closeModal() {
    elements.modal.classList.remove('active');
    currentChallengeId = null;
}

function showFeedback(msg, type) {
    elements.mFeedback.textContent = msg;
    elements.mFeedback.className = `feedback-msg ${type}`;
    elements.mFeedback.style.display = 'block';
}


async function validateSolution() {

    const originalText = elements.btnValidate.textContent;
    elements.btnValidate.textContent = "Verificando...";
    elements.btnValidate.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 600));

        const challenge = challengesData.find(c => c.id === currentChallengeId);

        //  Pedir al back que valide la solucion 

        if (true) {

            challenge.completed = true;
            showFeedback("🎉 ¡Correcto!", "success");
            renderList();
            
            // Cerrar modal tras breve espera
            setTimeout(() => {
                closeModal();
            }, 1500);

        } else {
            // ERROR
            showFeedback("❌ Inténtalo de nuevo.", "error");
        }

    } catch (err) {
        showFeedback("Error de conexión.", "error");
    } finally {
        elements.btnValidate.textContent = originalText;
        elements.btnValidate.disabled = false;
    }
}