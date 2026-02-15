const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simulamos una base de datos de destinos turísticos
const destinos = [
    { 
        id: 1, 
        nombre: "Playa del Carmen", 
        info: "Ideal para buceo y vida nocturna.", 
        precio: "$1500 MXN",
        foto: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=300"
    },
    { 
        id: 2, 
        nombre: "Chichén Itzá", 
        info: "Una de las maravillas del mundo moderno.", 
        precio: "$800 MXN",
        foto: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300"
    }
];

// Nueva ruta para obtener los destinos
app.get('/api/destinos', (req, res) => {
    const destinos = [
        { 
            id: 1, 
            nombre: "Cascadas de Hierve el Agua", 
            estado: "Oaxaca",
            descripcion: "Cascadas petrificadas con vistas increíbles.",
            foto: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400"
        },
        { 
            id: 2, 
            nombre: "Cenote Dos Ojos", 
            estado: "Quintana Roo",
            descripcion: "Un sistema de cuevas inundadas para buceo.",
            foto: "https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?w=400"
        }
    ];
    res.json(destinos);
});