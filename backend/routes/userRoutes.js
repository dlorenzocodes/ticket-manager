const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController')
const { protectPrivateRoute } = require('../middleware/authMiddleware');

router.post('/', registerUser)

router.post('/login', loginUser)

router.get('/me', protectPrivateRoute, getMe)

module.exports = router;