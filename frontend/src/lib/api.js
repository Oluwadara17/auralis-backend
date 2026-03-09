const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

async function request(path, options = {}) {
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
