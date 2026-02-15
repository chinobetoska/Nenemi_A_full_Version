async function cargarDestinos() {
    const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';
    const galeria = document.getElementById('caja-servidor');
    const mensaje = document.getElementById('estado-mensaje'); //nuevo

   try {
        const res = await fetch(url);
        const datos = await res.json();

        if (datos.length === 0) {
            mensaje.innerText = "Conectado, pero la base de datos está vacía.";
            galeria.innerHTML = '<p>Usa /api/seed para agregar contenido</p>';
            return;
        }

        mensaje.innerText = "✅ Datos cargados correctamente";
        galeria.innerHTML = ''; 

        datos.forEach(lugar => {
            const card = `
                <div class="card">
                    <img src="${lugar.foto}" alt="${lugar.nombre}">
                    <div class="card-body">
                        <h3>${lugar.nombre}</h3>
                        <p><strong>${lugar.estado}</strong></p>
                        <p>${lugar.descripcion}</p>
                    </div>
                </div>
            `;
            galeria.innerHTML += card;
        });

    } catch (err) {
        console.error("Error:", err);
        mensaje.innerText = "❌ Error al conectar con el servidor";
    }
}

// LLAMAR A LA FUNCIÓN UNA SOLA VEZ
cargarDestinos();