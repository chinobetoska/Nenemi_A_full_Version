async function cargarDestinos() {
    const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';
    const galeria = document.getElementById('caja-servidor');

    try {
        const res = await fetch(url);
        const datos = await res.json();

        // IMPORTANTE: Limpiamos la caja una sola vez antes del bucle
        galeria.innerHTML = ''; 

        datos.forEach(lugar => {
            // Creamos el HTML de la tarjeta
            const card = `
                <div class="card">
                    <img src="${lugar.foto}" alt="${lugar.nombre}">
                    <div class="info">
                        <h3>${lugar.nombre}</h3>
                        <p><strong>${lugar.estado}</strong></p>
                        <p>${lugar.descripcion}</p>
                    </div>
                </div>
            `;
            galeria.innerHTML += card;
        });

    } catch (err) {
        console.error("Error cargando destinos:", err);
        galeria.innerHTML = '<p>Error al cargar los datos</p>';
    }
}

// LLAMAR A LA FUNCIÓN UNA SOLA VEZ
cargarDestinos();