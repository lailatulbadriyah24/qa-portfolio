export const BASE_URL = __ENV.BASE_URL || 'https://restful-booker.herokuapp.com';
export const USERNAME = __ENV.API_USERNAME || 'admin';
export const PASSWORD = __ENV.API_PASSWORD || 'password123';

// Shared thresholds. Latency limits are generous because the target is a free-tier public demo.
export const COMMON_THRESHOLDS = {
  http_req_failed: ['rate<0.01'], // < 1% errors
  checks: ['rate>0.99'], // > 99% of checks pass
};
