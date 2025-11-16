// Simple API helper for Spark
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function getToken() {
  return localStorage.getItem('spark_token')
}

export function setToken(token) {
  localStorage.setItem('spark_token', token)
}

export function clearToken() {
  localStorage.removeItem('spark_token')
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } }
  const token = getToken()
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok) {
    let detail = 'Request failed'
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch {}
    throw new Error(detail)
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}

export const api = {
  base: API_BASE,
  request,
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/me'),
  myProfile: () => request('/profiles/me'),
  updateProfile: (data) => request('/profiles/me', { method: 'PUT', body: data }),
  feed: (limit = 20) => request(`/feed?limit=${limit}`),
  swipe: (target_user_id, action) => request('/swipe', { method: 'POST', body: { target_user_id, action } }),
  matches: () => request('/matches'),
  messages: (matchId) => request(`/matches/${matchId}/messages`),
  sendMessage: (matchId, content) => request(`/matches/${matchId}/messages`, { method: 'POST', body: { content } }),
  report: (reported_user_id, reason, details) => request('/report', { method: 'POST', body: { reported_user_id, reason, details } }),
  block: (blocked_user_id) => request('/block', { method: 'POST', body: { blocked_user_id } }),
}
