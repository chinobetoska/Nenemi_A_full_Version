const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Puerto dinámico: Usa el que asigne Render o el 3000 por defecto
const PORT = process.env.PORT || 3000;

// Ruta principal para verificar que el servidor vive
app.get('/', (req, res) => {
    res.send('Servidor de FullNenemi funcionando correctamente');
});

// Ruta para obtener los destinos
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

// ¡IMPORTANTE! Esto es lo que hace que el servidor arranque
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});