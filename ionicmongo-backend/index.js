// index.js
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de IonicMongo funcionando');
});
app.use('/api', require('./routes/protected'));
app.use('/api/expenses', require('./routes/expenses'));

// Conectar a MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.error('Error MongoDB:', err));

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000);
});

module.exports = app;
