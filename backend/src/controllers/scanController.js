const { supabase } = require('../services/supabaseService')
const { analyseIngredients } = require('../services/geminiService')
const { success, fail } = require('../utils/responseHelpers')

async function analyse(req, res, next) {
  try {
    const { ingredients } = req.body
    const result = await analyseIngredients(ingredients)
    return success(res, result)
  } catch (err) {
    next(err)
  }
}

async function save(req, res) {
  const {
    product_name,
    raw_ingredients,
    ingredient_hash,
    verdict,
    summary,
    analysis_json,
    scanned_at,
  } = req.body

  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: req.user.id,
      product_name: product_name || 'Unnamed Product',
      raw_ingredients,
      ingredient_hash,
      verdict,
      summary,
      analysis_json,
      scanned_at: scanned_at || new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return fail(res, 'Failed to save scan', 500)
  }

  return success(res, data, 201)
}

async function list(req, res) {
  const { verdict, search, page = 1 } = req.query
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('scans')
    .select('*', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order('scanned_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (verdict) {
    query = query.eq('verdict', verdict.toUpperCase())
  }

  if (search) {
    query = query.or(
      `product_name.ilike.%${search}%,raw_ingredients.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query

  if (error) {
    return fail(res, 'Failed to fetch scans', 500)
  }

  return success(res, { scans: data, total: count, page: Number(page), limit })
}

async function getById(req, res) {
  const { id } = req.params

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single()

  if (error || !data) {
    return fail(res, 'Scan not found', 404)
  }

  return success(res, data)
}

async function remove(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return fail(res, 'Failed to delete scan', 500)
  }

  return success(res, { message: 'Scan deleted' })
}

async function migrate(req, res) {
  const { scans } = req.body

  if (!Array.isArray(scans) || scans.length === 0) {
    return success(res, { migrated: 0 })
  }

  const toInsert = scans.map((scan) => ({
    user_id: req.user.id,
    product_name: scan.product_name || 'Unnamed Product',
    raw_ingredients: scan.raw_ingredients,
    ingredient_hash: scan.ingredient_hash,
    verdict: scan.verdict,
    summary: scan.summary,
    analysis_json: scan.analysis_json,
    scanned_at: scan.scanned_at || new Date().toISOString(),
  }))

  const { data, error } = await supabase
    .from('scans')
    .upsert(toInsert, { onConflict: 'ingredient_hash' })
    .select()

  if (error) {
    return fail(res, 'Migration failed', 500)
  }

  return success(res, { migrated: data.length })
}

async function checkHash(req, res) {
  const { hash } = req.params

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('ingredient_hash', hash)
    .eq('user_id', req.user.id)
    .single()

  if (error || !data) {
    return success(res, { exists: false, scan: null })
  }

  return success(res, { exists: true, scan: data })
}

module.exports = { analyse, save, list, getById, remove, migrate, checkHash }
