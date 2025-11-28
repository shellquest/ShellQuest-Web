async function login(event) {
    event.preventDefault();
    const padron = document.getElementById("padron").value;
    const password = document.getElementById("password").value;
    const LOGIN_URL = "http://127.0.0.1:8000/login/";
    const response = await fetch(LOGIN_URL, {
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
        const data = await response.json();
        console.log("Login successful:", data);

        if (window.AppState) {
            AppState.login(data); 
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

