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
app.get('/api/seed', async (req, res) => {
    try {
        const nuevo = new Destino({
            nombre: "Cascadas de Hierve el Agua",
            estado: "Oaxaca",
            descripcion: "Vistas increíbles y piscinas naturales.",
            foto: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400"
        });
        await nuevo.save();
        res.send("¡Primer destino guardado en la nube!");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// 4. CONFIGURACIÓN DEL PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});