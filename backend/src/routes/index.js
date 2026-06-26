const express = require('express')
const router = express.Router()

router.use('/auth', require('./authRoutes'))
router.use('/scans', require('./scanRoutes'))

module.exports = router
