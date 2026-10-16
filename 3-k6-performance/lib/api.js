import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';
import { BASE_URL, USERNAME, PASSWORD } from './config.js';

const deleteFailures = new Counter('delete_failures');

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

export function login() {
  const res = http.post(
    `${BASE_URL}/auth`,
    JSON.stringify({ username: USERNAME, password: PASSWORD }),
    { headers: JSON_HEADERS, tags: { name: 'POST /auth' } },
  );
  const ok = check(res, {
    'login: status is 200': (r) => r.status === 200,
    'login: token returned': (r) => !!r.json('token'),
  });
  if (!ok) throw new Error(`Login failed: ${res.status} ${res.body}`);
  return res.json('token');
}

export function bookingPayload() {
  return {
    firstname: `k6-${__VU}`,
    lastname: `iter-${__ITER}`,
    totalprice: 100 + Math.floor(Math.random() * 400),
    depositpaid: true,
    bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast',
  };
}

export function createBooking() {
  const res = http.post(`${BASE_URL}/booking`, JSON.stringify(bookingPayload()), {
    headers: JSON_HEADERS,
    tags: { name: 'POST /booking' },
  });
  check(res, {
    'create: status is 200': (r) => r.status === 200,
    'create: bookingid returned': (r) => !!r.json('bookingid'),
  });
  return res.json('bookingid');
}

export function getBooking(id) {
  const res = http.get(`${BASE_URL}/booking/${id}`, {
    headers: JSON_HEADERS,
    tags: { name: 'GET /booking/{id}' },
  });
  check(res, {
    'get: status is 200': (r) => r.status === 200,
    'get: has firstname': (r) => !!r.json('firstname'),
  });
  return res;
}

export function listBookings() {
  const res = http.get(`${BASE_URL}/booking`, { headers: JSON_HEADERS, tags: { name: 'GET /booking' } });
  check(res, {
    'list: status is 200': (r) => r.status === 200,
    'list: returns an array': (r) => Array.isArray(r.json()),
  });
  return res;
}

export function patchBooking(id, token) {
  const res = http.patch(`${BASE_URL}/booking/${id}`, JSON.stringify({ firstname: 'patched' }), {
    headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
    tags: { name: 'PATCH /booking/{id}' },
  });
  check(res, { 'patch: status is 200': (r) => r.status === 200 });
  return res;
}

export function deleteBooking(id, token) {
  const res = http.del(`${BASE_URL}/booking/${id}`, null, {
    headers: { Cookie: `token=${token}` },
    tags: { name: 'DELETE /booking/{id}' },
  });
  const ok = check(res, { 'delete: status is 201': (r) => r.status === 201 });
  if (!ok) {
    // Record WHY it failed: the status code (0 = network error/timeout) and a body snippet.
    deleteFailures.add(1, { status: String(res.status) });
    console.warn(`DELETE failed: status=${res.status} error=${res.error || '-'} body=${String(res.body).slice(0, 80)}`);
  }
  return res;
}
