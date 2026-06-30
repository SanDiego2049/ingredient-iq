const { buildAnalysisPrompt } = require('../utils/aiPrompt')

// Groq adapter (active by default)
function createGroqAdapter() {
  const Groq = require('groq-sdk')
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  return async function groqAdapter(ingredients) {
    const prompt = buildAnalysisPrompt(ingredients)

    let completion
    try {
      completion = await client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      })
    } catch (err) {
      if (err.status === 503 || (err.message && err.message.includes('503'))) {
        const friendlyError = new Error(
          'The AI analysis service is temporarily busy. Please try again in a moment.'
        )
        friendlyError.statusCode = 503
        friendlyError.isOperational = true
        throw friendlyError
      }
      throw err
    }

    const text = completion.choices[0].message.content
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    try {
      return JSON.parse(cleaned)
    } catch {
      console.error('Raw Groq response:', text)
      throw new Error('AI provider returned invalid JSON')
    }
  }
}

// Gemini adapter (retained, inactive and swapped back via AI_PROVIDER=gemini)
function createGeminiAdapter() {
  const { GoogleGenerativeAI } = require('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  return async function geminiAdapter(ingredients) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const prompt = buildAnalysisPrompt(ingredients)

    let result
    try {
      result = await model.generateContent(prompt)
    } catch (err) {
      if (err.message && err.message.includes('503')) {
        const friendlyError = new Error(
          'The AI analysis service is temporarily busy. Please try again in a moment.'
        )
        friendlyError.statusCode = 503
        friendlyError.isOperational = true
        throw friendlyError
      }
      throw err
    }

    const text = result.response.text()
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    try {
      return JSON.parse(cleaned)
    } catch {
      console.error('Raw Gemini response:', text)
      throw new Error('AI provider returned invalid JSON')
    }
  }
}

// Provider selection
const adapters = {
  groq: createGroqAdapter,
  gemini: createGeminiAdapter,
}

// Lazily initialised so env vars are read at call time, not at require time.
// This also lets _setAdapterForTesting replace it cleanly before any test runs.
let currentAdapter = null

function getAdapter() {
  if (currentAdapter) return currentAdapter
  const providerName = (process.env.AI_PROVIDER || 'groq').toLowerCase()
  const factory = adapters[providerName] || adapters.groq
  currentAdapter = factory()
  return currentAdapter
}

// Public API
async function analyseIngredients(ingredients) {
  return getAdapter()(ingredients)
}

// Test-only seam: replaces the active adapter with a fake async function.
// Required because Vitest cannot intercept CommonJS require() calls directly.
function _setAdapterForTesting(fakeAdapter) {
  currentAdapter = fakeAdapter
}

module.exports = { analyseIngredients, _setAdapterForTesting }
