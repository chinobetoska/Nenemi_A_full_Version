const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';
//const url = 'http://localhost:3000/api/destinos'; // URL del backend para desarrollo local (solo usar si el backend se ejecuta localmente)

async function cargarParaAdmin() {// Carga los destinos para el panel de administracion
    const listaAdmin = document.getElementById('lista-admin');
    const res = await fetch(url);
    // Se obtiene la lista de destinos desde el backend
    const datos = await res.json();

    listaAdmin.innerHTML = '';
    datos.forEach(lugar => {
        // Se recorre cada destino y se agrega a la lista del panel de administracion
        listaAdmin.innerHTML += `<div class="destino-card" id="card-${lugar._id}">
                <img src="${lugar.foto}" alt="${lugar.nombre}">
                <div class="destino-info">
                    <h3>${lugar.nombre}</h3>
                    <p>${lugar.estado}</p>
                    <button onclick="eliminarDestino('${lugar._id}')" class="btn-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    });
}
// funcion para eliminar un destino
async function eliminarDestino(id) {
    // Se muestra una confirmacion antes de eliminar el destino
    if (confirm("¿Eliminar este destino?")) {
        await fetch(`${url}/${id}`, { method: 'DELETE' });
        cargarParaAdmin();
    }
}

// Logica del formulario
document.getElementById('form-destino').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoDato = {
        // Se obtiene la informacion del formulario para crear un nuevo destino
        nombre: document.getElementById('nombre').value,
        estado: document.getElementById('estado').value,
        descripcion: document.getElementById('descripcion').value,
        foto: document.getElementById('foto').value
    };
// Se envia el nuevo destino al backend para ser guardado
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoDato)
    });

    if(res.ok) {// Si la respuesta es correcta, se muestra un mensaje de exito, se resetea el formulario y se recarga la lista de destinos
        document.getElementById('mensaje').innerText = "Guardado con éxito";
        document.getElementById('form-destino').reset();
        cargarParaAdmin();
    }
});

cargarParaAdmin();