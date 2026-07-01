const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export function get(path, token) {
  return request(path, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export function post(path, body, token) {
  return request(path, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(body),
  })
}

export function del(path, token) {
  return request(path, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}
