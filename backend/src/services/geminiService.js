const { GoogleGenerativeAI } = require('@google/generative-ai')
const { buildAnalysisPrompt } = require('../utils/geminiPrompt')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function analyseIngredients(ingredients) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
  })

  const prompt = buildAnalysisPrompt(ingredients)
  const result = await model.generateContent(prompt)
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

module.exports = { analyseIngredients }
