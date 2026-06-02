const express = require('express')
const { signup, login, logout } = require('../controllers/auth.controller')
const authenticate = require('../middleware/authenticate')

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

// router.post('/logout', authenticate, logout)

module.exports = router