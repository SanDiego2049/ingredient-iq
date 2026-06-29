import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { _setClientForTesting } = require('../src/services/geminiService.js')

_setClientForTesting({
  getGenerativeModel: () => ({
    generateContent: vi
      .fn()
      .mockRejectedValue(
        new Error(
          '[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent: [503 Service Unavailable] This model is currently experiencing high demand.'
        )
      ),
  }),
})

describe('POST /api/scans/analyse, Gemini unavailable', () => {
  it('returns a clean 503 with a friendly message instead of the raw SDK error', async () => {
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
