const { supabase } = require('../services/supabaseService')
const { fail } = require('../utils/responseHelpers')

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return fail(res, 'Unauthorised', 401)
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return fail(res, 'Invalid or expired token', 401)
  }

  req.user = data.user
  next()
}

module.exports = { requireAuth }
