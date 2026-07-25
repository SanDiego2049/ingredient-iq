import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

// Replace this with a fresh token from your browser before running
const TOKEN = __ENV.K6_TOKEN || ''

export const options = {
  stages: [
    // Smoke test: 2 VUs for 30 seconds
    { duration: '30s', target: 2 },
    // Load test: ramp to 15 VUs over 30 seconds, hold for 60 seconds
    { duration: '30s', target: 15 },
    { duration: '60s', target: 15 },
    // Stress test: ramp to 50 VUs over 30 seconds, hold for 60 seconds
    { duration: '30s', target: 50 },
    { duration: '60s', target: 50 },
    // Recovery: ramp back down
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.05'],
  },
}

export default function () {
  const res = http.get(
    'https://ingredient-iq-m8lv.onrender.com/api/scans?page=1',
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  )

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
