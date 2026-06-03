const express = require('express')

const router = express.Router()

const protect =
  require('../middleware/authMiddleware')

const {
  sendMessage,
  getMessages,
  deleteMessage,
  markMessageRead
} = require('../controllers/contactController')

/* PUBLIC SEND MESSAGE */

router.post('/', sendMessage)

/* ADMIN GET MESSAGES */

router.get('/', protect, getMessages)

/* ADMIN DELETE MESSAGE */

router.delete('/:id', protect, deleteMessage)

/* ADMIN MARK MESSAGE READ */

router.put('/:id/read', protect, markMessageRead)

module.exports = router