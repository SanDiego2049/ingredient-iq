import { get, post, del, patch } from './api'

export function analyseIngredients(ingredients) {
  return post('/api/scans/analyse', { ingredients })
}

export function saveScan(scanData, token) {
  return post('/api/scans', scanData, token)
}

export function getHistory(token, params = {}) {
  const query = new URLSearchParams(params).toString()
  return get(`/api/scans${query ? `?${query}` : ''}`, token)
}

export function getScanById(id, token) {
  return get(`/api/scans/${id}`, token)
}

export function deleteScan(id, token) {
  return del(`/api/scans/${id}`, token)
}

export function checkHash(hash, token) {
  return get(`/api/scans/check/${hash}`, token)
}

export function updateProductName(id, productName, token) {
  return patch(`/api/scans/${id}/name`, { product_name: productName }, token)
}