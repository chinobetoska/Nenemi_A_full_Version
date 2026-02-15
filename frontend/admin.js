const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';

async function cargarParaAdmin() {
    const listaAdmin = document.getElementById('lista-admin');
    const res = await fetch(url);
    const datos = await res.json();

    listaAdmin.innerHTML = '';
    datos.forEach(lugar => {
        listaAdmin.innerHTML += `
            <div style="border-bottom: 1px solid #ccc; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${lugar.nombre}</strong> - ${lugar.estado}
                </div>
                <button onclick="eliminarDestino('${lugar._id}')" style="background: red; color: white; border: none; padding: 5px; cursor: pointer;">
                    Eliminar
                </button>
            </div>
        `;
    });
}

async function eliminarDestino(id) {
    if (confirm("¿Seguro que quieres borrar este destino?")) {
        await fetch(`${url}/${id}`, { method: 'DELETE' });
        cargarParaAdmin(); // Recargamos la lista para ver que ya no está
    }
}

cargarParaAdmin();