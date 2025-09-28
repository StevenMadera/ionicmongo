// routes/protected.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/profile', auth, (req, res) => {
  res.json({ message: 'Ruta protegida OK', user: req.user });
});

module.exports = router;
