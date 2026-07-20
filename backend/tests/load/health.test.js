import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  vus: 50,
  duration: '30s',
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
    'response time under 200ms': (r) => r.timings.duration < 200,
  })

  errorRate.add(!success)
  sleep(0.5)
}
