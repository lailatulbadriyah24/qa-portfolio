// Stress test: push beyond normal load to see where latency or errors start to degrade.
// Capped at 10 VUs on purpose: the target is a shared public demo server.
// Run: k6 run 3-k6-performance/stress.js
import { sleep } from 'k6';
import { login, createBooking, getBooking, listBookings, deleteBooking } from './lib/api.js';

export const options = {
  stages: [
    { duration: '30s', target: 2 },
    { duration: '30s', target: 5 },
    { duration: '30s', target: 8 },
    { duration: '1m', target: 10 }, // peak, held
    { duration: '30s', target: 0 }, // recovery
  ],
  // Thresholds are looser than in the load test: here we want to observe degradation, not only pass/fail.
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
  },
};

export function setup() {
  return { token: login() };
}

export default function (data) {
  listBookings();
  const id = createBooking();
  getBooking(id);
  deleteBooking(id, data.token);
  sleep(0.5); // minimal think time = higher pressure than the load test
}
