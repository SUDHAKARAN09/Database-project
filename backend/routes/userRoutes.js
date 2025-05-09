// userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, getUser } = require('../controllers/userController');

// Route for user registration
router.post('/register', registerUser);

// Route to retrieve user details by user_id
router.get('/:user_id', getUser);

module.exports = router;
