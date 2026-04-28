function loadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log("Imagen cargada:", e.target.result); // debug
            document.getElementById('profileImage').src = e.target.result;
            document.getElementById('profileImage').style.display = 'block';
            document.getElementById('defaultAvatar').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}