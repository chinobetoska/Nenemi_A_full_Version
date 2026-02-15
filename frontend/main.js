async function cargarDestinos() {
    // Asegúrate de usar TU link de Render
const url = 'https://nenemi-a-full-version.onrender.com/api/destinos';

fetch(url)
    .then(res => res.json()) // Aquí es donde fallaba antes porque recibía texto
    .then(datos => {
        console.log(datos);
        // Aquí va tu código para dibujar las tarjetas...
        const galeria = document.getElementById('caja-servidor');
        galeria.innerHTML = ''; // Quita el "Cargando..."
        
        datos.forEach(lugar => {
            galeria.innerHTML += `
                <div class="card">
                    <img src="${lugar.foto}" alt="${lugar.nombre}">
                    <h3>${lugar.nombre}</h3>
                    <p>${lugar.estado}</p>
                </div>
            `;
        });
    })
    .catch(err => console.error("Error cargando destinos:", err));
}
cargarDestinos();