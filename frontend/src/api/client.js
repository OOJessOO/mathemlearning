export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const tok = token || localStorage.getItem('ml_token');
  if (tok) headers.Authorization = `Bearer ${tok}`;

  const base = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Erreur réseau');
    err.status = res.status;
    throw err;
  }
  return data;
}
