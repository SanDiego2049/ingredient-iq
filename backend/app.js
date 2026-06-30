require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { errorHandler } = require('./src/middleware/errorHandler')

const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'IngredientIQ API is running' })
})

app.use('/api', require('./src/routes/index'))

app.use(errorHandler)

module.exports = app
