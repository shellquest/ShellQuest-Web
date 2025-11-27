document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Dom Elements
const elements = {
    listBody: document.getElementById('sshKeyListBody'),
    loading: document.getElementById('loadingIndicator'),
    template: document.getElementById('keyRowTemplate'),
    modal: document.getElementById('addKeyModal'),
    btnOpen: document.getElementById('btnAddKey'),
    btnCancel: document.getElementById('btnCancel'),
    form: document.getElementById('addKeyForm'),
    feedback: document.getElementById('modalFeedback'),
    userBtn: document.getElementById('userBtn'),
    userDropdown: document.getElementById('userDropdown'),
    logoutBtn: document.getElementById('logoutBtn'),
    settingsBtn: document.getElementById('settingsBtn')
};

const API_URL = '/api/ssh-keys';

async function initApp() {
    setupEventListeners();
    await fetchKeys();
}

async function fetchKeys() {
    elements.loading.style.display = 'block';
    elements.listBody.innerHTML = '';

    try {
        
        await new Promise(r => setTimeout(r, 600));
        
        const keys = [
            { key_type: "ssh-rsa", key: "ssh-rsa s", created_at: "2025-10-12" },
            { key_type: "ssh-ed25519", key: "ssh-sada", created_at: "2025-11-05" }
        ];

        renderKeys(keys);
    } catch (error) {
        console.error(error);
        elements.listBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red; padding:20px;">Error al cargar claves.</td></tr>';
    } finally {
        elements.loading.style.display = 'none';
    }
}

function renderKeys(keys) {
    if (keys.length === 0) {
        elements.listBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#6b7280; padding:30px;">No tienes claves configuradas.</td></tr>';
        return;
    }

    keys.forEach(k => {
        const clone = elements.template.content.cloneNode(true);
        
        // Tipo
        clone.querySelector('.badge-type').textContent = k.key_type;
        
        const codeEl = clone.querySelector('.key-preview');
        codeEl.textContent = k.key;
        codeEl.title = k.key; 

        clone.querySelector('.date-cell').textContent = k.created_at;

        elements.listBody.appendChild(clone);
    });
}

function setupEventListeners() {
    // menu dropdown
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

    // SSH Key Modal
    elements.btnOpen.addEventListener('click', () => {
        elements.modal.classList.add('active');
        elements.form.reset();
        hideFeedback();
    });
    elements.btnCancel.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });

    elements.form.addEventListener('submit', handleSave);
}

function closeModal() {
    elements.modal.classList.remove('active');
}

async function handleSave(e) {
    e.preventDefault();
    
    const type = document.getElementById('keyType').value;
    const content = document.getElementById('keyContent').value.trim();

    if(!content) {
        showFeedback("Por favor completa todos los campos", "error");
        return;
    }

    const btnSave = document.getElementById('btnSave');
    const originalText = btnSave.textContent;
    btnSave.textContent = "Guardando...";
    btnSave.disabled = true;

    try {
        // Simular POST al backend
        console.log("Enviando a API:", { key_type: type, key: content });
        
        await new Promise(r => setTimeout(r, 800)); // Delay red
        
        // Éxito
        showFeedback("Clave agregada correctamente", "success");
        setTimeout(() => {
            closeModal();
            fetchKeys(); // Recargar tabla
        }, 1000);

    } catch (err) {
        showFeedback("Error al guardar la clave", "error");
    } finally {
        btnSave.textContent = originalText;
        btnSave.disabled = false;
    }
}

function showFeedback(msg, type) {
    elements.feedback.textContent = msg;
    elements.feedback.className = `feedback-msg ${type}`;
    elements.feedback.style.display = 'block';
}

function hideFeedback() {
    elements.feedback.style.display = 'none';
}