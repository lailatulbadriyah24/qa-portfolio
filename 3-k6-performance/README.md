# k6 Performance Tests

Target: https://restful-booker.herokuapp.com (public demo). Load is intentionally capped at **10 virtual users** to be considerate of a shared service.

| Script | Type | Profile | Purpose |
|---|---|---|---|
| `smoke.js` | Smoke | 1 VU, 5 iterations | Sanity check that scripts and API work |
| `load.js` | Load | Ramp to 10 VUs, hold 2 min | Validate behaviour at expected traffic |
| `stress.js` | Stress | 2 -> 5 -> 8 -> 10 VUs, shorter think time | Observe degradation and recovery |

Shared code lives in `lib/`: `config.js` (URLs, thresholds) and `api.js` (request helpers with `check`s and request tags).

## Run

Install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

```bash
k6 run 3-k6-performance/smoke.js
k6 run --summary-export=3-k6-performance/results/load-summary.json 3-k6-performance/load.js
k6 run --summary-export=3-k6-performance/results/stress-summary.json 3-k6-performance/stress.js
```

Override settings with environment variables: `k6 run -e BASE_URL=https://other-host 3-k6-performance/smoke.js`.

## What the scripts demonstrate

- `setup()` to log in once and share the token
- Realistic user flow (browse -> create -> read -> update -> delete) with think time and cleanup
- `check`s for functional correctness during load
- Thresholds on error rate and latency, including per-endpoint thresholds using tags
- Stage-based ramp-up / steady-state / ramp-down profiles

See [`REPORT.md`](REPORT.md) for results and analysis.
