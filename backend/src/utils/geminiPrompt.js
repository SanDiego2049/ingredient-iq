function buildAnalysisPrompt(ingredients) {
  return `
You are a food safety expert. Analyse the following list of ingredients and return a JSON response only — no markdown, no explanation, just raw JSON.

Ingredients:
${ingredients}

Return this exact JSON structure:
{
  "verdict": "SAFE" | "UNSAFE" | "CAUTION",
  "summary": "A single plain-language sentence verdict.",
  "concerns": [
    {
      "ingredient": "string",
      "reason": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "positives": [
    {
      "ingredient": "string",
      "benefit": "string"
    }
  ],
  "disclaimer": "This analysis is for informational purposes only and is not a substitute for professional medical or dietary advice."
}

Rules:
- SAFE: No significantly harmful ingredients detected.
- UNSAFE: One or more ingredients are widely considered harmful.
- CAUTION: Ingredients are not universally harmful but may affect specific groups.
- Only include ingredients in concerns if they are genuinely worth flagging.
- Only include ingredients in positives if they have a clear benefit.
- Always include the disclaimer exactly as shown above.
`
}

module.exports = { buildAnalysisPrompt }
