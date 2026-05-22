const mongoose = require('mongoose');

const Destino = mongoose.model('Destino', new mongoose.Schema({
    nombre: { type: String, required: true },
    estado: { type: String, required: true },
    descripcion: { type: String, required: true },
    foto: { type: String, required: true }
}));

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
    rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
    fechaCreacion: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = { Destino, Usuario };
