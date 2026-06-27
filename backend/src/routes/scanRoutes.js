const express = require('express')
const router = express.Router()
const {
  analyse,
  save,
  list,
  getById,
  remove,
  migrate,
  checkHash,
} = require('../controllers/scanController')
const { requireAuth } = require('../middleware/requireAuth')
const { analyseLimiter } = require('../middleware/rateLimiter')
const { validateAnalyseBody } = require('../middleware/validateBody')

router.post('/analyse', analyseLimiter, validateAnalyseBody, analyse)
router.post('/', requireAuth, save)
router.get('/', requireAuth, list)
router.get('/check/:hash', requireAuth, checkHash)
router.get('/:id', requireAuth, getById)
router.delete('/:id', requireAuth, remove)
router.post('/migrate', requireAuth, migrate)

module.exports = router
