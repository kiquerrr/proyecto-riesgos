const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;

// Configurar CORS para permitir peticiones desde cualquier origen (*)
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.use('/admin', adminRoutes);

// Manejador de ruta principal (simple saludo)
app.get('/', (req, res) => {
    res.send('API de Riesgos App: En linea');
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log("Servidor escuchando en http://localhost:" + PORT);
});
