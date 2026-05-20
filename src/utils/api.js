// Vite proxy: /api → https://secrets-api.appbrewery.com (fixes CORS in dev)
export const API_BASE = 'https://secrets-api.appbrewery.com';

/**
 * Central fetch wrapper for all API calls.
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} method
 * @param {string} url
 * @param {object|null} body
 * @param {{ bearer?: string, basic?: { username: string, password: string } }} auth
 */
export async function apiCall(method, url, body = null, auth = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (auth?.bearer) {
    opts.headers['Authorization'] = `Bearer ${auth.bearer}`;
  }
  if (auth?.basic) {
    opts.headers['Authorization'] =
      'Basic ' + btoa(`${auth.basic.username}:${auth.basic.password}`);
  }
  if (body) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const data = await res.json();

  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

/** Parse an error thrown by apiCall into a readable string. */
export function parseError(e) {
  try {
    return JSON.parse(e.message)?.error || e.message;
  } catch {
    return e.message;
  }
}
