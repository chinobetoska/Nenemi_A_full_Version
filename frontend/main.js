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
                <div class="card" id="card-${lugar._id}">
            <img src="${lugar.foto}" alt="${lugar.nombre}">
            <div class="card-body">
                <h3>${lugar.nombre}</h3>
                <p><strong>${lugar.estado}</strong></p>
                <p>${lugar.descripcion}</p>
                <button onclick="eliminarDestino('${lugar._id}')" 
                        style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Eliminar
                </button>
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

async function eliminarDestino(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este destino?")) {
        try {
            const res = await fetch(`https://nenemi-a-full-version.onrender.com/api/destinos/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Si el servidor lo borró, quitamos la tarjeta de la pantalla
                document.getElementById(`card-${id}`).remove();
                alert("Destino eliminado");
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    }
}