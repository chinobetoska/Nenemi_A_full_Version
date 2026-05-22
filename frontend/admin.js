// Guard de acceso: solo admins autenticados pueden usar este panel
const token = localStorage.getItem('usuarioToken');
const rol = localStorage.getItem('usuarioRol');
if (!token || rol !== 'admin') {
    window.location.href = '../index.html';
}

const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';

function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

async function cargarParaAdmin() {
    const listaAdmin = document.getElementById('lista-admin');
    try {
        const res = await fetch(url);
        const datos = await res.json();

        listaAdmin.innerHTML = '';
        datos.forEach(lugar => {
            listaAdmin.innerHTML += `<div class="destino-card" id="card-${escapeHTML(lugar._id)}">
                    <img src="${escapeHTML(lugar.foto)}" alt="${escapeHTML(lugar.nombre)}">
                    <div class="destino-info">
                        <h3>${escapeHTML(lugar.nombre)}</h3>
                        <p>${escapeHTML(lugar.estado)}</p>
                        <button onclick="eliminarDestino('${escapeHTML(lugar._id)}')" class="btn-eliminar">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        listaAdmin.innerHTML = '<p class="alerta-error">Error al cargar destinos.</p>';
    }
}

async function eliminarDestino(id) {
    if (confirm("¿Eliminar este destino?")) {
        try {
            await fetch(`${url}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('usuarioToken')}` }
            });
            cargarParaAdmin();
        } catch (err) {
            alert('Error al eliminar el destino.');
        }
    }
}

document.getElementById('form-destino').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoDato = {
        nombre: document.getElementById('nombre').value,
        estado: document.getElementById('estado').value,
        descripcion: document.getElementById('descripcion').value,
        foto: document.getElementById('foto').value
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('usuarioToken')}`
            },
            body: JSON.stringify(nuevoDato)
        });

        if (res.ok) {
            document.getElementById('mensaje').innerText = "Guardado con éxito";
            document.getElementById('form-destino').reset();
            cargarParaAdmin();
        } else if (res.status === 401 || res.status === 403) {
            alert('Sesión expirada o sin permisos. Inicia sesión de nuevo.');
            window.location.href = '../login_usuarios/login.html';
        } else {
            document.getElementById('mensaje').innerText = "Error al guardar el destino.";
        }
    } catch (err) {
        document.getElementById('mensaje').innerText = "Error de conexión con el servidor.";
    }
});

cargarParaAdmin();
