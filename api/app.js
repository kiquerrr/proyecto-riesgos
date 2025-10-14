require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Importar routers
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const tasasRouter = require('./routes/tasas');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Montar rutas
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/tasas', tasasRouter);

app.get('/', (req, res) => {
    res.send('API de Riesgos App en funcionamiento.');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = app;
