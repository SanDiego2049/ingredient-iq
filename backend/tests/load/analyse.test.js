import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Counter } from 'k6/metrics'

const errorRate = new Rate('errors')
const rateLimitHits = new Counter('rate_limit_hits')
const aiUnavailable = new Counter('ai_unavailable')

export const options = {
  stages: [
    // Smoke test: 2 VUs for 30 seconds
    { duration: '30s', target: 2 },
    // Load test: ramp to 5 VUs over 30 seconds, hold for 60 seconds
    { duration: '30s', target: 5 },
    { duration: '60s', target: 5 },
    // Stress test: ramp to 10 VUs over 30 seconds, hold for 60 seconds
    { duration: '30s', target: 10 },
    { duration: '60s', target: 10 },
    // Recovery: ramp back down
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.8'],
    http_req_duration: ['p(99)<5000'],
  },
}

export default function () {
  const res = http.post(
    'http://localhost:3000/api/scans/analyse',
    JSON.stringify({
      ingredients: 'Sugar, Salt, Water, Citric Acid, Sodium Benzoate',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (res.status === 429) {
    rateLimitHits.add(1)
  }

  if (res.status === 503) {
    aiUnavailable.add(1)
  }

  check(res, {
    'status is 200 or 429 or 503': (r) =>
      r.status === 200 || r.status === 429 || r.status === 503,
    'no unhandled 500 errors': (r) => r.status !== 500,
  })

  errorRate.add(res.status === 500)
  sleep(0.2)
}
