const urlRegistro = 'https://nenemi-a-full-version.onrender.com/api/registro';

document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const mensajeP = document.getElementById('mensaje-registro');
    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    mensajeP.classList.remove('alerta-exito', 'alerta-error');

    if (password.length < 8) {
        mensajeP.innerText = "La contraseña debe tener al menos 8 caracteres";
        mensajeP.classList.add('alerta-error');
        return;
    }

    if (password !== passwordConfirm) {
        mensajeP.innerText = "Las contraseñas no coinciden";
        mensajeP.classList.add('alerta-error');
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
            mensajeP.classList.add('alerta-exito');
            document.getElementById('form-registro').reset();

            setTimeout(() => {
                window.location.href = "../login_usuarios/login.html";
            }, 2000);

        } else {
            mensajeP.innerText = "❌ " + data.error;
            mensajeP.classList.add('alerta-error');
        }
    } catch (error) {
        mensajeP.innerText = "❌ Error de conexión con el servidor";
        mensajeP.classList.add('alerta-error');
    }
});
