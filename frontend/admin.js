const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';

async function cargarParaAdmin() {
    const listaAdmin = document.getElementById('lista-admin');
    const res = await fetch(url);
    const datos = await res.json();

    listaAdmin.innerHTML = '';
    datos.forEach(lugar => {
        // Todo el diseño viene de las clases CSS en cards.css y buttons.css
        listaAdmin.innerHTML += `
            <div class="destino-card" id="card-${lugar._id}">
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

async function eliminarDestino(id) {
    if (confirm("¿Eliminar este destino?")) {
        await fetch(`${url}/${id}`, { method: 'DELETE' });
        cargarParaAdmin();
    }
}

// Lógica del formulario
document.getElementById('form-destino').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoDato = {
        nombre: document.getElementById('nombre').value,
        estado: document.getElementById('estado').value,
        descripcion: document.getElementById('descripcion').value,
        foto: document.getElementById('foto').value
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoDato)
    });

    if(res.ok) {
        document.getElementById('mensaje').innerText = "Guardado con éxito";
        document.getElementById('form-destino').reset();
        cargarParaAdmin();
    }
});

cargarParaAdmin();