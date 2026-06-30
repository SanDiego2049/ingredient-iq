import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { _setAdapterForTesting } = require('../src/services/aiService.js')

_setAdapterForTesting(async () => {
  const err = new Error(
    'The AI analysis service is temporarily busy. Please try again in a moment.'
  )
  err.statusCode = 503
  err.isOperational = true
  throw err
})

describe('POST /api/scans/analyse, AI provider unavailable', () => {
  it('returns a clean 503 with a friendly message instead of a raw SDK error', async () => {
    const res = await request(app)
      .post('/api/scans/analyse')
      .send({ ingredients: 'Sugar, Salt, Water' })

    expect(res.status).toBe(503)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBe(
      'The AI analysis service is temporarily busy. Please try again in a moment.'
    )
  })
})
