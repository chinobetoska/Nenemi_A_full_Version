const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// conexion a MongoDB Atlas
const mongoURI = 'mongodb+srv://chinobetoskas:chinobetoska@fullnenemi-db.22t4lrz.mongodb.net/?appName=FullNenemi-DB';

mongoose.connect(mongoURI)
    .then(() => console.log(' ¡Conectado a MongoDB Atlas!'))
    .catch(err => console.error(' Error de conexion:', err));

// modelo de datos para destinos turisticos
const Destino = mongoose.model('Destino', {
    nombre: String,
    estado: String,
    descripcion: String,
    foto: String
});

//rutas

//ruta de prueba para verificar que el servidor funciona (bienbenida)
app.get('/', (req, res) => {
    res.send('Servidor de FullNenemi funcionando');
});

//ruta para obtener la lista de destinos turisticos (para el frontd)
app.get('/api/destinos', async (req, res) => {
    try {
        const destinos = await Destino.find();
        res.json(destinos); //envio la lista de destinos como respuesta en formato jso
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

// ruta pra crear datos (olo para pruebas)
app.get('/api/seed', async (req, res) => {
    try {
        const nuevo = new Destino({
            nombre: "Cascadas de Hierve el Agua",
            estado: "Oaxaca",
            descripcion: "Vistas increíbles y piscinas naturales.",
            foto: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400"
        });
        await nuevo.save();
        res.send("¡Destino guardado con éxito!");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

//ruta para recibir datos desde el frontend y guardarlos en la base de datos (para el formulario)
app.post('/api/destinos', async (req, res) => {
    try {
        const nuevoDestino = new Destino(req.body); // Recibe nombre, estado, descripcion, foto
        await nuevoDestino.save();
        res.status(201).json({ mensaje: "Destino guardado con éxito" });
    } catch (error) {
        res.status(400).json({ error: "Error al guardar" });
    }
});

//puerto de reicion de peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
});