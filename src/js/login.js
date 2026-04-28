async function login(event) {
    event.preventDefault();
    const padron = document.getElementById("padron").value;
    const password = document.getElementById("password").value;
    const response = await fetch('/login/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: padron,
            password: password,
        }),
    });
    console.log(response);

    if (response.ok) {
        const authData = await response.json();
        console.log("Login successful:", authData);
        const userId = authData.user_id; 
        let fullUserData = authData;
        if (userId) {
            try {
                // Consulta al endpoint de detalles del usuario
                const userDetailResponse = await fetch(`/users/${userId}`);
                if (userDetailResponse.ok) {
                    fullUserData = await userDetailResponse.json();
                    console.log("Datos de usuario completos fetched:", fullUserData);
                } else {
                    console.warn("Login OK, pero no se pudo cargar el detalle del usuario.");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
        if (window.AppState) {
            AppState.login(fullUserData);
        } else {
            console.error("Error: AppState no está cargado");
        }

        alert("Inicio de sesión exitoso 🎉");
        window.location.href = "challenges.html";
    } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert("Login failed: " + errorData.message);
    }
}

function goToRegister() {
    window.location.href = "register.html";
}
