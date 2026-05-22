const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('¡Conectado a MongoDB Atlas!'))
    .catch(err => console.error('Error de conexion:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
