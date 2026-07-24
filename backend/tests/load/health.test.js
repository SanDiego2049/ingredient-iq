import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    // Smoke test: 2 VUs for 30 seconds
    { duration: '30s', target: 2 },
    // Load test: ramp to 30 VUs over 30 seconds, hold for 60 seconds
    { duration: '30s', target: 30 },
    { duration: '60s', target: 30 },
    // Stress test: ramp to 150 VUs over 30 seconds, hold for 60 seconds
    { duration: '30s', target: 150 },
    { duration: '60s', target: 150 },
    // Recovery: ramp back down
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.01'],
  },
}

export default function () {
  const res = http.get('http://localhost:3000/api/health')

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has status ok': (r) => {
      try {
        return JSON.parse(r.body).status === 'ok'
      } catch {
        return false
      }
    },
  })

  errorRate.add(!success)
  sleep(0.5)
}