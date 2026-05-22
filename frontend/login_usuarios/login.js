const urlLogin = 'https://nenemi-a-full-version.onrender.com/api/login';

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const mensajeP = document.getElementById('mensaje-login');

    mensajeP.classList.remove('alerta-exito', 'alerta-error');

    try {
        mensajeP.innerText = "⏳ Verificando...";

        const res = await fetch(urlLogin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            mensajeP.innerText = "✅ ¡Bienvenido!";
            mensajeP.classList.add('alerta-exito');

            // El servidor decide el rol — no el cliente
            localStorage.setItem('usuarioToken', data.token);
            localStorage.setItem('usuarioNombre', data.nombre);
            localStorage.setItem('usuarioRol', data.rol);

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1500);

        } else {
            mensajeP.innerText = "❌ " + data.error;
            mensajeP.classList.add('alerta-error');
        }
    } catch (error) {
        mensajeP.innerText = "❌ Error al conectar con el servidor";
        mensajeP.classList.add('alerta-error');
    }
});
