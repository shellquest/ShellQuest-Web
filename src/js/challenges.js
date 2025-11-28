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
    sshCommand: document.getElementById('sshCommandDisplay'),
};

async function initApp() {
    AppState.checkAuth();
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
        if(confirm("¿Cerrar sesión?"))AppState.logout();
        
    });

    elements.settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "settings.html";
    });

    // Modal
    elements.btnCloseModal.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });
}

async function fetchChallenges() {
    try {
        const userId = AppState.getUser().legajo;
        const GET_USER_CHALLENGES = `http://127.0.0.1:8000/users/${userId}/challenges/`;


        //     example of json data from backend
        // "challenge_id": 1,
        // "name": "Hello World",
        // "tag": "busybox",
        // "description": "Conéctate al servidor usando el comando ssh y ejecuta 'echo Hello World' para completar este desafío.",
        // "passed": null

            // Mock Data 
    //     const mockData = [
    //     {
    //         challenge_id: 3,
    //         name: "List Files",
    //         tag: "LINUX",
    //         description: "Lista los archivos en el directorio /home/user/docs usando 'ls'.",
    //         passed: true
    //     },
    //     {
    //         challenge_id: 4,
    //         name: "Show File Content",
    //         tag: "LINUX",
    //         description: "Muestra el contenido del archivo /home/user/docs/file.txt usando 'cat'.",
    //         passed: false
    //     }
    // ];

        const response = await fetch(GET_USER_CHALLENGES);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        backendData = await response.json();
        challengesData = [...backendData, ...mockData];
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
        
        row.querySelector('.row-title').textContent = challenge.name;
        row.querySelector('.row-tag').textContent = challenge.tag;

        const statusDiv = row.querySelector('.row-status');
        if (challenge.passed == true) {
            row.classList.add('row-completed-bg');
            statusDiv.innerHTML = '<span class="status-badge status-completed">✔ Completado</span>';
        } else if (challenge.passed == null){
            statusDiv.innerHTML = '<span class="status-badge status-pending">Sin intentos</span>';
        } else {
            row.classList.add('row-rejected-bg');
            statusDiv.innerHTML = '<span class="status-badge status-incomplete">✘ Rechazado</span>';
        }

        row.addEventListener('click', () => openModal(challenge.challenge_id));

        elements.list.appendChild(clone);
    });
}

// Modal Functions

function openModal(id) {
    const challenge = challengesData.find(c => c.challenge_id == id);
    if (!challenge) return;

    currentChallengeId = id;

    elements.mTitle.textContent = challenge.name;
    elements.mTag.textContent = challenge.tag;
    elements.mDesc.textContent = challenge.description;
    const clientIp = window.location.hostname;
    elements.sshCommand.textContent = `ssh -i <ruta de la llave privada> -p 22 shellquest@${clientIp} ${challenge.tag}`;
    //feedback
    elements.mFeedback.style.display = 'none';
    elements.mFeedback.className = "feedback-msg";
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


