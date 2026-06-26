const { fail } = require('../utils/responseHelpers')

function validateAnalyseBody(req, res, next) {
  const { ingredients } = req.body

  if (!ingredients || typeof ingredients !== 'string') {
    return fail(res, 'ingredients must be a non-empty string', 400)
  }

  if (ingredients.trim().length < 3) {
    return fail(res, 'ingredients text is too short', 400)
  }

  next()
}

module.exports = { validateAnalyseBody }
