const express = require('express')

const router = express.Router()

const protect =
  require('../middleware/authMiddleware')

const {
  sendMessage,
  getMessages
} = require('../controllers/contactController')

/* PUBLIC SEND MESSAGE */

router.post('/', sendMessage)

/* ADMIN GET MESSAGES */

router.get('/', protect, getMessages)

module.exports = router