// URL de tu API en Render
const urlDestinos = 'https://nenemi-a-full-version.onrender.com/api/destinos';

// 1. CARGAR DESTINOS DESDE EL SERVIDOR
async function obtenerDestinos() {
    const galeria = document.getElementById('galeria-destinos');
    
    try {
        const res = await fetch(urlDestinos);
        const datos = await res.json();

        if (datos.length === 0) {
            galeria.innerHTML = '<p class="user-modo-invitado">La base de datos está vacía.</p>';
            return;
        }

        galeria.innerHTML = ''; // Limpiamos el mensaje de "Cargando..."

        datos.forEach(lugar => {
            // Usamos las clases definidas en cards.css
            const card = `
                <article class="destino-card" id="card-${lugar._id}">
                    <img src="${lugar.foto}" alt="${lugar.nombre}">
                    <div class="destino-info">
                        <h3>${lugar.nombre}</h3>
                        <p><strong>${lugar.estado}</strong></p>
                        <p>${lugar.descripcion}</p>
                        <a href="#" class="btn-destino">Explorar</a>
                    </div>
                </article>
            `;
            galeria.innerHTML += card;
        });

    } catch (err) {
        console.error("Error al cargar destinos:", err);
        if(galeria) galeria.innerHTML = '<p class="alerta-error">Error al conectar con el servidor</p>';
    }
}

// 2. GESTIONAR ESTADO DE SESIÓN (NOMBRE Y BOTONES)
function gestionarEstadoSesion() {
    const nombreUsuario = localStorage.getItem('usuarioNombre');
    const userInfoDiv = document.getElementById('user-info-nav');
    const linkLogin = document.getElementById('link-login');
    const linkRegistro = document.getElementById('link-registro');
    const linkLogout = document.getElementById('link-logout');

    if (nombreUsuario && userInfoDiv) {
        // Usuario logueado: Mostramos nombre y botón de cerrar sesión
        userInfoDiv.innerHTML = `<p class="user-nombre-resaltado">¡Hola, ${nombreUsuario}!</p>`;
        
        if(linkLogin) linkLogin.classList.add('link-oculto');
        if(linkRegistro) linkRegistro.classList.add('link-oculto');
        if(linkLogout) linkLogout.classList.remove('link-oculto');
    } else if (userInfoDiv) {
        // Invitado: Mostramos modo invitado
        userInfoDiv.innerHTML = `<p class="user-modo-invitado">Modo Invitado</p>`;
        if(linkLogout) linkLogout.classList.add('link-oculto');
    }
}

// 3. CERRAR SESIÓN
function cerrarSesion() {
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioRol'); // Borramos también el rol
    alert("Sesión terminada. ¡Vuelve pronto!");
    window.location.href = "/index.html";
}

// 4. CARGA GLOBAL DE LA PÁGINA (COMPONENTES REUTILIZABLES)
async function cargarPagina() {
    // Determinar qué nav cargar
    const rol = localStorage.getItem('usuarioRol');
    const navUrl = (rol === 'admin') 
        ? '/reutilizables/nav_admin.html' 
        : '/reutilizables/nav_usuario.html';

    try {
        // Cargar Nav
        const navRes = await fetch(navUrl);
        const navHTML = await navRes.text();
        const navPlaceholder = document.getElementById('nav-placeholder');
        if(navPlaceholder) navPlaceholder.innerHTML = navHTML;

        // Cargar Footer
        const footerRes = await fetch('/reutilizables/footer.html');
        const footerHTML = await footerRes.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if(footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

        // Inicializar estados
        gestionarEstadoSesion();
        
        // Cargar destinos solo si estamos en el index (donde existe la galeria)
        if (document.getElementById('galeria-destinos')) {
            obtenerDestinos();
        }

    } catch (error) {
        console.error("Error al cargar componentes:", error);
    }
}

// Ejecutar todo al cargar la ventana
window.onload = cargarPagina;