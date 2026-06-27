const { supabase } = require('../services/supabaseService')
const { success, fail } = require('../utils/responseHelpers')

async function getMe(req, res) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single()

  if (error) {
    return fail(res, 'Profile not found', 404)
  }

  return success(res, data)
}

async function deleteAccount(req, res, next) {
  try {
    // Delete all scans first
    const { error: scansError } = await supabase
      .from('scans')
      .delete()
      .eq('user_id', req.user.id)

    if (scansError) {
      return fail(res, 'Failed to delete scan history', 500)
    }

    // Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', req.user.id)

    if (profileError) {
      return fail(res, 'Failed to delete profile', 500)
    }

    // Delete auth user using admin API
    const { error: authError } = await supabase.auth.admin.deleteUser(
      req.user.id
    )

    if (authError) {
      return fail(res, 'Failed to delete account', 500)
    }

    return success(res, { message: 'Account deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMe, deleteAccount }
