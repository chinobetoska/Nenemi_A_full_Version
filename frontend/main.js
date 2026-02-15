async function cargarDestinos() {
    // URL del endpoint en Render
    const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';
    // Elementos del DOM para mostrar resultados
    const galeria = document.getElementById('caja-servidor');
    // Elemento para mostrar mensajes de estado
    const mensaje = document.getElementById('estado-mensaje'); 

   try {
        const res = await fetch(url);
        const datos = await res.json();

        if (datos.length === 0) {
            // Si no hay datos, muestra un mensaje específico
            mensaje.innerText = "Conectado, pero la base de datos esta vacía.";
            galeria.innerHTML = '<p>Usa /api/seed para agregar contenido</p>';
            return;
        }

        mensaje.innerText = "Datos cargados correctamente";
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
        mensaje.innerText = "Error al conectar con el servidor";
    }
}

//le lama a la funcion para no hacer que se repita cada vez que se recarga la pagina
cargarDestinos();