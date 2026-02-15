async function cargarDestinos() {
    const res = await fetch('https://nenemi-a-full-version.onrender.com/api/seed');
    const datos = await res.json();
    
    const contenedor = document.getElementById('caja-servidor');
    contenedor.innerHTML = '<div class="galeria"></div>';
    const galeria = contenedor.querySelector('.galeria');

    datos.forEach(lugar => {
        galeria.innerHTML += `
            <div class="card">
                <img src="${lugar.foto}">
                <div class="card-body">
                    <h3>${lugar.nombre}</h3>
                    <p><strong>${lugar.estado}</strong></p>
                    <p>${lugar.descripcion}</p>
                </div>
            </div>
        `;
    });
}
cargarDestinos();