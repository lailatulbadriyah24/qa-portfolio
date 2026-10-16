// Load test: realistic traffic, ramp up to 10 virtual users and hold.
// Run: k6 run 3-k6-performance/load.js
// Optional report file: k6 run --summary-export=3-k6-performance/results/load-summary.json 3-k6-performance/load.js
import { sleep, group } from 'k6';
import { COMMON_THRESHOLDS } from './lib/config.js';
import { login, createBooking, getBooking, listBookings, patchBooking, deleteBooking } from './lib/api.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // ramp up
    { duration: '2m', target: 10 }, // steady state
    { duration: '30s', target: 0 }, // ramp down
  ],
  thresholds: {
    ...COMMON_THRESHOLDS,
    http_req_duration: ['p(95)<1500', 'p(99)<3000'],
    'http_req_duration{name:GET /booking/{id}}': ['p(95)<1000'],
    'http_req_duration{name:POST /booking}': ['p(95)<1500'],
  },
};

export function setup() {
  return { token: login() };
}

export default function (data) {
  // Read-heavy mix: most real users browse, fewer write.
  group('browse', () => {
    listBookings();
    sleep(1);
  });

  group('booking lifecycle', () => {
    const id = createBooking();
    sleep(1);
    getBooking(id);
    patchBooking(id, data.token);
    deleteBooking(id, data.token);
  });

  sleep(Math.random() * 2 + 1); // think time 1-3 s
}
