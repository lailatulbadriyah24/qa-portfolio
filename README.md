# QA Portfolio - Restful-Booker API

A complete, small-scale QA workflow on a public API: planning and test design, automated API testing, and performance testing.

**Target system:** [Restful-Booker](https://restful-booker.herokuapp.com), a public hotel-booking demo API built for testing practice.

## Contents

| Part | What it shows | Where |
|---|---|---|
| **1. Test documentation** | Test plan, scenarios, 29 test cases, traceability, 7 bug reports | [`1-test-scenario/`](1-test-scenario) |
| **2. API automation (Postman + Newman)** | 22 requests, 41 assertions, schema checks, token chaining, data-driven testing, HTML report | [`2-postman/`](2-postman) |
| **3. Performance testing (k6)** | Smoke, load and stress scripts with thresholds, results and analysis | [`3-k6-performance/`](3-k6-performance) |
| **CI** | GitHub Actions runs Newman and the k6 smoke test on every push | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

## Key findings

Testing found that the API has almost no input validation:

- Negative prices, checkout-before-checkin dates, empty names, and non-numeric values are accepted (BUG-001..004). Some are silently corrupted, for example `"abc"` becomes `null` and `"not-a-date"` becomes `"0NaN-aN-aN"`.
- Missing required fields cause a `500` instead of `400` (BUG-005).
- A failed login returns `200 OK` (BUG-006).
- Write operations are correctly protected: all unauthenticated or invalid-token `PUT`/`PATCH`/`DELETE` calls return `403`.

Full details are in [`1-test-scenario/bug-reports/`](1-test-scenario/bug-reports).

## Quick start

Requirements: Node.js 18+ and [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).

```bash
npm install
npm run test:api          # Postman regression suite via Newman (HTML report in 2-postman/reports/)
npm run test:api:data     # data-driven run
npm run test:api:defects  # known defects, fails by design
k6 run 3-k6-performance/smoke.js
```

## Approach

- **Design first**: scenarios -> test cases -> automation, with IDs that trace through all three (for example `TC-CRT-01` exists in the CSV and in the collection).
- **Stable vs. known-defect tests**: assertions for bugs live in a separate folder so the regression suite stays green and meaningful.
- **Responsible load testing**: the target is a shared public server, so load is capped at 10 virtual users and every script cleans up the data it creates.

## Tools

Postman, Newman (+ htmlextra reporter), k6, Node.js, GitHub Actions.

## Website

`site/` is a Next.js static site that renders this portfolio (bug reports, test cases, Postman and k6 results) straight from the files above, so it never drifts from the source.

```bash
cd site
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to site/out
```

It deploys to GitHub Pages through `.github/workflows/pages.yml`. In the repository settings, set **Pages > Source** to **GitHub Actions** once.
