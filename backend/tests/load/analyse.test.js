import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Counter } from 'k6/metrics'

const errorRate = new Rate('errors')
const rateLimitHits = new Counter('rate_limit_hits')
const aiUnavailable = new Counter('ai_unavailable')

export const options = {
  vus: 5,
  duration: '60s',
  thresholds: {
    errors: ['rate<0.8'],
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
