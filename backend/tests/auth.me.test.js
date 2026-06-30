import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createClient } from '@supabase/supabase-js'
import app from '../app.js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)
const supabasePublic = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

const testEmail = `vitest-${Date.now()}@example.com`
const testPassword = 'testpassword123'

let accessToken
let userId

beforeAll(async () => {
  const { data: createData, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    })
  if (createError) throw createError
  userId = createData.user.id

  const { data: signInData, error: signInError } =
    await supabasePublic.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })
  if (signInError) throw signInError
  accessToken = signInData.session.access_token
})

afterAll(async () => {
  if (userId) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
  }
})

describe('GET /api/auth/me', () => {
  it('returns the profile for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe(userId)
  })

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
