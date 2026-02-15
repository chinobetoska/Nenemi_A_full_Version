const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. CONEXIÓN A LA BASE DE DATOS
// REEMPLAZA LOS DATOS CON LOS TUYOS
const mongoURI = 'mongodb+srv://chinobetoskas:chinobetoska@fullnenemi-db.22t4lrz.mongodb.net/?appName=FullNenemi-DB';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ ¡Conectado a MongoDB Atlas!'))
    .catch(err => console.error('❌ Error de conexión:', err));

// 2. MODELO DE DATOS
const Destino = mongoose.model('Destino', {
    nombre: String,
    estado: String,
    descripcion: String,
    foto: String
});

// 3. RUTAS
// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Servidor de FullNenemi con MongoDB funcionando');
});

// Ruta para obtener destinos de la BD
app.get('/api/destinos', async (req, res) => {
    try {
        const destinos = await Destino.find();
        res.json(destinos);
    } catch (error) {
        res.status(500).json({ error: "No se pudieron obtener los datos" });
    }
});

// 4. CONFIGURACIÓN DEL PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});