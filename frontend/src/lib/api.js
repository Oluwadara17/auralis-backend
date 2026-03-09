const DEFAULT_DEV_API_BASE_URL = 'http://127.0.0.1:5000';
const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

function trimTrailingSlashes(value) {
  return value.replace(/\/+$/, '');
}

function resolveApiBaseUrl() {
  if (!RAW_API_BASE_URL) {
    return import.meta.env.DEV ? DEFAULT_DEV_API_BASE_URL : '';
  }

  if (RAW_API_BASE_URL.startsWith('/')) {
    return trimTrailingSlashes(RAW_API_BASE_URL);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(RAW_API_BASE_URL);
  } catch {
    throw new Error(
      'VITE_API_BASE_URL must be a valid absolute URL (for example https://api.example.com) or a relative path.',
    );
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('VITE_API_BASE_URL must use http:// or https://.');
  }

  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(parsedUrl.hostname);
  if (import.meta.env.PROD && parsedUrl.protocol !== 'https:' && !isLocalHost) {
    throw new Error('In production, VITE_API_BASE_URL must use HTTPS.');
  }

  return trimTrailingSlashes(parsedUrl.toString());
}

let API_BASE_URL = '';
let apiConfigError = '';

try {
  API_BASE_URL = resolveApiBaseUrl();
} catch (error) {
  apiConfigError = error instanceof Error ? error.message : 'Invalid API configuration.';
}

export { API_BASE_URL };

async function request(path, options = {}) {
  if (apiConfigError) {
    throw new Error(apiConfigError);
  }

  const { method = 'GET', body } = options;
  const headers = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const rawText = await response.text();
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function getJournals() {
  return request('/api/journals');
}

export function getJournal(id) {
  return request(`/api/journals/${id}`);
}

export function createJournal(payload) {
  return request('/api/journals', {
    method: 'POST',
    body: payload,
  });
}

export function getImpactMetrics() {
  return request('/api/impact');
}

export function createImpactMetric(payload) {
  return request('/api/impact', {
    method: 'POST',
    body: payload,
  });
}

export function getTestimonials() {
  return request('/api/testimonials');
}

export function createTestimonial(payload) {
  return request('/api/testimonials', {
    method: 'POST',
    body: payload,
  });
}

export function submitContact(payload) {
  return request('/api/contact', {
    method: 'POST',
    body: payload,
  });
}

export function submitVolunteer(payload) {
  return request('/api/volunteer', {
    method: 'POST',
    body: payload,
  });
}
