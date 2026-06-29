const { GoogleGenerativeAI } = require('@google/generative-ai')
const { buildAnalysisPrompt } = require('../utils/geminiPrompt')

let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function _setClientForTesting(fakeClient) {
  genAI = fakeClient
}

async function analyseIngredients(ingredients) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
  })

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
    const parsed = JSON.parse(cleaned)
    return parsed
  } catch {
    console.error('Raw Gemini response:', text)
    throw new Error('Gemini returned invalid JSON')
  }
}

module.exports = { analyseIngredients, _setClientForTesting }
