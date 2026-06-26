const rateLimit = require('express-rate-limit')

const analyseLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many requests, please try again in a minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = { analyseLimiter }
