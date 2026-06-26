const express = require('express')
const router = express.Router()
const { getMe, deleteAccount } = require('../controllers/authController')
const { requireAuth } = require('../middleware/requireAuth')

router.get('/me', requireAuth, getMe)
router.delete('/me', requireAuth, deleteAccount)

module.exports = router
