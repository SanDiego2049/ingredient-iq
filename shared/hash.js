function normaliseIngredients(rawText) {
  return rawText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function hashIngredients(rawText) {
  const normalised = normaliseIngredients(rawText)
  const encoded = new TextEncoder().encode(normalised)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
