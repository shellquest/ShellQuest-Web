const AppState = {
    KEY: 'shellquest_session',

    login: (userData) => {
        localStorage.setItem(AppState.KEY, JSON.stringify(userData));
    },

    getUser: () => {
        const data = localStorage.getItem(AppState.KEY);
        return data ? JSON.parse(data) : null;
    },

    isAuthenticated: () => {
        return !!AppState.getUser();
    },

    logout: () => {
        localStorage.removeItem(AppState.KEY);
        window.location.href = '../public/index.html';
    },

    checkAuth: () => {
        if (!AppState.isAuthenticated()) {
            alert("Debes iniciar sesión primero.");
            window.location.href = 'index.html';
        }
    },
};

window.AppState = AppState;
document.addEventListener('DOMContentLoaded', () => {
    const user = AppState.getUser();
    const header = document.querySelector('.dropdown-header');
    
    if (user && header) {
        header.textContent = user.user_id || user.id || "Usuario"; 
    }
});