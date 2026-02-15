const urlRegistro = 'https://nenemi-a-full-version.onrender.com/api/registro';

document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const mensajeP = document.getElementById('mensaje-registro');
    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    // VALIDACIONES FRONTEND
    if (password.length < 8) {
        mensajeP.innerText = "La contrasena debe tener al menos 8 caracteres";
        mensajeP.style.color = "#ff4d4d";
        return;
    }

    try {
        mensajeP.innerText = "Procesando registro...";
        
        const res = await fetch(urlRegistro, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            mensajeP.innerText = "✅ " + data.mensaje;
            mensajeP.style.color = "#4E8B61";
            document.getElementById('form-registro').reset();
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = "../login_usuarios/login.html";
            }, 2000);
            
        } else {
            mensajeP.innerText = "❌ " + data.error;
            mensajeP.style.color = "#ff4d4d";
        }
    } catch (error) {
        mensajeP.innerText = "Error de conexión con el servidor";
    }
});