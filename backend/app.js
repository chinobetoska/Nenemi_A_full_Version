require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { Destino, Usuario } = require('./models');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Rate limiting — desactivado en entorno de tests
const authLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' }
    });

// ── Middleware de autenticación ─────────────────────────────

function verificarAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token requerido' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.rol !== 'admin') return res.status(403).json({ error: 'Sin permisos de administrador' });
        req.usuario = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// ── Rutas ──────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.send('Servidor de FullNenemi funcionando');
});

// Obtener lista de destinos (pública)
app.get('/api/destinos', async (req, res) => {
    try {
        const destinos = await Destino.find();
        res.json(destinos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// Crear destino (solo admin)
app.post('/api/destinos', verificarAdmin, async (req, res) => {
    try {
        const { nombre, estado, descripcion, foto } = req.body;
        if (!nombre || !estado || !descripcion || !foto) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const nuevoDestino = new Destino({ nombre, estado, descripcion, foto });
        await nuevoDestino.save();
        res.status(201).json({ mensaje: 'Destino guardado con éxito' });
    } catch (error) {
        res.status(400).json({ error: 'Error al guardar' });
    }
});

// Eliminar destino (solo admin)
app.delete('/api/destinos/:id', verificarAdmin, async (req, res) => {
    try {
        await Destino.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Destino eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo eliminar el destino' });
    }
});

// Registro de usuario
app.post('/api/registro', authLimiter, async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(400).json({ error: 'Este correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: '¡Cuenta creada exitosamente!' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Login de usuario
app.post('/api/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta temporal para promover el primer admin — ELIMINAR DESPUÉS DE USAR
app.post('/api/setup-admin', async (req, res) => {
    try {
        const { email, setupSecret } = req.body;
        if (!setupSecret || setupSecret !== process.env.SETUP_SECRET) {
            return res.status(403).json({ error: 'Clave incorrecta' });
        }
        const usuario = await Usuario.findOneAndUpdate(
            { email },
            { rol: 'admin' },
            { new: true }
        );
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: `${usuario.email} ahora es admin` });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = app;
