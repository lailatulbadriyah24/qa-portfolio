# Performance Test Report - Restful-Booker API

| | |
|---|---|
| **Date** | 2026-10-16 |
| **Target** | https://restful-booker.herokuapp.com (public demo, free tier) |
| **Tool** | k6 v2.3.0, run from a single laptop over the public internet |
| **Max load** | 10 virtual users (deliberately low: shared public server) |

> Results include network latency from the test machine (about 230-250 ms minimum round trip), so absolute numbers describe "as seen by a remote client", not server processing time.

## 1. Objectives

1. Confirm the main booking flow works under concurrent use (functional correctness under load).
2. Check that latency and error rate stay within defined thresholds at expected load (10 VUs).
3. Observe how the API behaves under more aggressive traffic.

## 2. Scenarios

All scenarios exercise the same flow: list bookings -> create -> get -> (patch) -> delete (cleanup).

| Test | Profile | Think time |
|---|---|---|
| Smoke | 1 VU, 5 iterations | 1 s |
| Load | 0 -> 10 VUs in 30 s, hold 2 min, ramp down 30 s | 1-3 s |
| Stress | 2 -> 5 -> 8 -> 10 VUs, hold 1 min at 10, ramp down (total 3 min) | 0.5 s |

## 3. Thresholds

| Test | Threshold |
|---|---|
| Smoke | `http_req_failed < 1%`, `checks > 99%`, `p95 < 2000 ms` |
| Load | `http_req_failed < 1%`, `checks > 99%`, `p95 < 1500 ms`, `p99 < 3000 ms`, `GET /booking/{id}` p95 < 1000 ms, `POST /booking` p95 < 1500 ms |
| Stress | `http_req_failed < 5%`, `p95 < 3000 ms` |

## 4. Results

### Smoke (1 VU)

| Metric | Result |
|---|---|
| Checks passed | 42 / 42 (100%) |
| Requests | 26, 0 failed |
| p95 latency | 258 ms |
| Verdict | **Pass** |

### Load (10 VUs, 3 min)

| Metric | Result | Threshold | Verdict |
|---|---|---|---|
| Requests | 1,301 (7.0 req/s), 260 iterations | - | - |
| Checks passed | 2,082 / 2,082 (100%) | > 99% | Pass |
| `http_req_failed` | 0.00% | < 1% | Pass |
| Latency avg / median | 382 ms / 256 ms | - | - |
| Latency p90 / p95 | 793 ms / 952 ms | p95 < 1500 ms | Pass |
| Latency max | 1.91 s | p99 < 3000 ms | Pass |
| `GET /booking/{id}` p95 | 347 ms | < 1000 ms | Pass |
| `POST /booking` p95 | 343 ms | < 1500 ms | Pass |

**Verdict: Pass.** The API handles 10 concurrent users with no errors.

### Stress (up to 10 VUs, shorter think time, 3 min) - run twice

The stress test was run twice under identical settings. The two runs disagreed.

| Metric | Run 1 (10:18) | Run 2 (10:26) | Threshold |
|---|---|---|---|
| Requests / iterations | 1,773 / 443 | 2,061 / 515 | - |
| Checks passed | 2,995 / 3,103 (96.5%) | 100% | - |
| `http_req_failed` | **6.09%** (108 requests) | 0.00% | < 5% |
| Latency avg / median | 423 ms / 263 ms | 349 ms / 262 ms | - |
| Latency p90 / p95 | 761 ms / 1.05 s | 568 ms / 665 ms | p95 < 3000 ms |
| Latency max | **6.36 s** | 1.18 s | - |
| Verdict | **Fail** (error rate) | Pass | |

In run 1 every failure was a failed `DELETE /booking/{id}` check (108 of 443 deletes). Other endpoints had no failures. Run 2 had none.

**Overall verdict: inconclusive.** The error rate threshold was breached once in two runs, and the cause was not captured.

## 5. Analysis

1. **Normal load is healthy.** With realistic think time the API shows zero errors and a median of 256 ms, which is essentially network round-trip time. The p95 (952 ms) is about four times the median, meaning a small share of requests is noticeably slower. The occasional slow request is typical of a free-tier host.
2. **Stress behaviour is not stable.** Run 1 had a 6.1% error rate and a 6.4 s maximum latency; run 2, with the same script and load, had 0% errors and a 1.2 s maximum. Because only one of two runs failed, the failure is intermittent, not a hard capacity limit at 10 VUs.
3. **The failures in run 1 were all on `DELETE`.** 108 of 443 deletes (about 24%) failed their check while login, list, create and get stayed at 100%. A separate sequential check (create then delete immediately, single user, 25 times) returned `201` every time, so a single user does not trigger it.
4. **The failing status code was not captured in run 1.** The `check` only records pass or fail, so I cannot say whether the failures were `4xx`, `5xx` or timeouts. I added status-code logging to `DELETE` afterwards (`lib/api.js`), but run 2 had no failures, so it produced no evidence.
5. **Likely contributors (hypotheses, not confirmed):** other users sharing the free-tier demo server during run 1, or occasional server stalls. The 6.4 s maximum latency in run 1 fits a stall better than a steady capacity limit.

## 6. Recommendations

| # | Recommendation | Why |
|---|---|---|
| 1 | Repeat the stress test at least 3 more times (different times of day) and compare error rate and max latency | Two runs disagree; a trend needs more data |
| 2 | Keep the new status-code logging on `DELETE` so any future failure is diagnosable | Root cause is still unknown |
| 3 | Treat 10 VUs as supported for load (passes cleanly), and do not claim stress stability yet | Load test passed; stress is inconclusive |
| 4 | If the failures recur on a controlled environment, investigate `DELETE` under concurrent writes (locking, data store consistency) | All run-1 errors were on this endpoint |

## 7. Limitations

- Tests ran from one machine over the internet; client-side network variance is included in the numbers.
- The target is a shared public demo, so other users' traffic may affect results. The smoke and load tests were run once, the stress test twice (with different outcomes). To claim a trend, repeat at least three times and compare.
- Load is capped at 10 VUs on purpose, so this report cannot say where the real capacity limit is.
- A first attempt at these runs was discarded because two runs overlapped by mistake and distorted the load; the numbers above come from a clean re-run.

## 8. Raw data

JSON summaries are in `results/`: `smoke-summary.json`, `load-summary.json`, `stress-run1-summary.json` (6.09% errors) and `stress-summary.json` (run 2, 0% errors).
