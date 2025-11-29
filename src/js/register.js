async function registerUser(event) {
    event.preventDefault();
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    padron = document.getElementById("padron").value;
    console.log(firstName, lastName, email, password, padron);

    const response = await fetch('/signup/', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        user_id: padron,
    }),
    });
    console.log(response);
    if (response.ok) {
        const data = await response.json();
        alert("Registro exitoso 🎉 Ahora podés iniciar sesión.");
        console.log("Registration successful:", data);

        if (window.AppState) {
            AppState.logout();
        } else {
            localStorage.clear();
            window.location.href = "index.html";
        }

    } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        alert("Registration failed: " + errorData.message);
    }
}
