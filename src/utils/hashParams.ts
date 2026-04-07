export function getHashParams(): URLSearchParams {
  const hash = window.location.hash
  const qIndex = hash.indexOf('?')
  if (qIndex === -1) return new URLSearchParams()
  return new URLSearchParams(hash.slice(qIndex))
}

export function updateHashParams(key: string, value: string | null) {
  const hash = window.location.hash
  const qIndex = hash.indexOf('?')
  const path = qIndex === -1 ? hash : hash.slice(0, qIndex)
  const params = qIndex === -1 ? new URLSearchParams() : new URLSearchParams(hash.slice(qIndex))

  if (value === null || value === '') {
    params.delete(key)
  } else {
    params.set(key, value)
  }

  const paramStr = params.toString()
  const newHash = paramStr ? `${path}?${paramStr}` : path
  window.history.replaceState(null, '', newHash || '#/')
}
