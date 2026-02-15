const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');

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

//modelo de datos para usuarios (para el sistema de autenticacion)
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { 
        type: String, 
        required: [true, 'El email es obligatorio'], 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    fechaCreacion: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

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

//ruta para eliminar un destino por su id (para el admin)
app.delete('/api/destinos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Destino.findByIdAndDelete(id);
        res.json({ mensaje: "Destino eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo eliminar el destino" });
    }
});

app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        //verificar si el usuario ya existe
        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(400).json({ error: "Este correo ya está registrado" });
        }

        //encriptar la contraseña (Hashing)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //guardar usuario con la clave secreta
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordHash
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "¡Cuenta creada exitosamente!" });
//respuesta de exito
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//puerto de reicion de peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
});