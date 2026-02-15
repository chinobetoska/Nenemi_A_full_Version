const urlLogin = 'https://nenemi-a-full-version.onrender.com/api/login';

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const mensajeP = document.getElementById('mensaje-login');

    // Limpiamos clases previas para que no se mezclen colores
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
            mensajeP.classList.add('alerta-exito'); // Estilo desde CSS
            
            // Guardamos datos en el navegador
            localStorage.setItem('usuarioNombre', data.nombre);
            
            // LÓGICA DE ROLES: 
            // Si el correo es el tuyo, eres admin. Si no, eres usuario.
            if (email === 'admin@nenemi.com') { // Cambia esto por tu correo real
                localStorage.setItem('usuarioRol', 'admin');
            } else {
                localStorage.setItem('usuarioRol', 'usuario');
            }
            
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1500);

        } else {
            mensajeP.innerText = "❌ " + data.error;
            mensajeP.classList.add('alerta-error'); // Estilo desde CSS
        }
    } catch (error) {
        mensajeP.innerText = "❌ Error al conectar con el servidor";
        mensajeP.classList.add('alerta-error');
    }
});