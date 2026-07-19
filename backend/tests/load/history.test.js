import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

// Replace this with a fresh token from your browser before running
const TOKEN =
  'eyJhbGciOiJFUzI1NiIsImtpZCI6IjY5MTE5ZmM5LTNlODQtNDQ1OS1iZDJhLWNjZWJhYTQ4NmQ0MyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3h4dGFicG10bm95amhwa213ZWxqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1NzA5NDY4Ny1lM2NkLTQ1MzMtOTA0Yi1jNjA0ZmFhYjVmNjEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg0NDkzODY4LCJpYXQiOjE3ODQ0OTAyNjgsImVtYWlsIjoiYWxhYmFvcmVvbHV3YUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIiwiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMWmZUeVl3aGlwYkFkeDlXVDdUVjIxMGlyU1BJUldTaC1qdEhGcjdkTG1VaTc4TXBpbT1zOTYtYyIsImVtYWlsIjoiYWxhYmFvcmVvbHV3YUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiT3Jlb2x1d2EgQWxhYmEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiT3Jlb2x1d2EgQWxhYmEiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMWmZUeVl3aGlwYkFkeDlXVDdUVjIxMGlyU1BJUldTaC1qdEhGcjdkTG1VaTc4TXBpbT1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTA2Mzk3Nzk1MTg5NTYzMTAwNjY1Iiwic3ViIjoiMTA2Mzk3Nzk1MTg5NTYzMTAwNjY1In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3ODQ0OTAyNjh9XSwic2Vzc2lvbl9pZCI6ImZmMDJlYTVkLWNhNzgtNDUwMS1iOWUzLTk0ZDdjY2JjOGM1MCIsImlzX2Fub255bW91cyI6ZmFsc2V9._s9Bsh7Ji59NsZDFrOFzxbMxksRGdhmplYTDG8DEgcxynIUk0-54O2CSlmzNmIopJriJSpQ1dlbzyFJN6ooBOA'

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.05'],
  },
}

export default function () {
  const res = http.get('http://localhost:3000/api/scans?page=1', {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'returns scans array': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.success === true && Array.isArray(body.data.scans)
      } catch {
        return false
      }
    },
    'response time under 1000ms': (r) => r.timings.duration < 1000,
  })

  errorRate.add(!success)
  sleep(0.5)
}
