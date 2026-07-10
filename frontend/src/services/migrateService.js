import { post } from './api'

export function migrateGuestScans(scans, token) {
  return post('/api/scans/migrate', { scans }, token)
}
