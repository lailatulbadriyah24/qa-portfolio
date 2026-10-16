// Smoke test: 1 virtual user, a few iterations. Confirms the scripts and the API work before any real load.
// Run: k6 run 3-k6-performance/smoke.js
import { sleep } from 'k6';
import { COMMON_THRESHOLDS } from './lib/config.js';
import { login, createBooking, getBooking, listBookings, patchBooking, deleteBooking } from './lib/api.js';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    ...COMMON_THRESHOLDS,
    http_req_duration: ['p(95)<2000'],
  },
};

export function setup() {
  return { token: login() };
}

export default function (data) {
  const id = createBooking();
  getBooking(id);
  listBookings();
  patchBooking(id, data.token);
  deleteBooking(id, data.token); // always clean up the booking we created
  sleep(1);
}
