# Test Plan - Restful-Booker API

| | |
|---|---|
| **Project** | Restful-Booker (public hotel-booking demo API) |
| **Base URL** | https://restful-booker.herokuapp.com |
| **Author** | Laila |
| **Version** | 1.0 |

## 1. Objective

Verify that the booking API correctly authenticates users, performs CRUD on bookings, rejects invalid input, protects write operations, and stays responsive under light load.

## 2. Scope

**In scope**

| Area | Endpoints |
|---|---|
| Health | `GET /ping` |
| Authentication | `POST /auth` |
| Booking CRUD | `POST /booking`, `GET /booking`, `GET /booking/{id}`, `PUT /booking/{id}`, `PATCH /booking/{id}`, `DELETE /booking/{id}` |
| Non-functional | Response time, light load / stress behaviour (see `3-k6-performance`) |

**Out of scope**: UI, security penetration testing, the underlying infrastructure, and large-scale load (the server is a shared public service).

## 3. Test approach

| Level | Technique | Tooling |
|---|---|---|
| Functional API | Equivalence partitioning, boundary value analysis, state-based flow (create -> read -> update -> delete), negative testing | Postman + Newman |
| Data-driven | Same request over several data rows | Postman collection runner + CSV |
| Performance | Smoke, load, stress with thresholds | k6 |
| Exploratory | Input validation, error handling, headers | Manual (Postman / curl) |

Test cases are designed from the scenarios in `test-scenarios.md` and listed in `test-cases.csv`. Each automated case carries the same ID in the Postman collection (for example `TC-CRT-01`).

## 4. Test environment

- Public demo server (shared; data is reset periodically by the maintainers).
- Credentials: public demo account documented by the API (`admin` / `password123`).
- Tools: Postman, Newman 6, k6, Node.js 18+, GitHub Actions.

## 5. Entry / exit criteria

**Entry**: API reachable (`GET /ping` returns 201); test data and credentials available.

**Exit**
- 100% of Priority 1 test cases executed.
- All stable regression cases pass.
- Every failed case is logged as a bug with severity and evidence.
- Performance thresholds defined in `3-k6-performance/REPORT.md` are met or deviations are explained.

## 6. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Shared public server, data may be reset or changed by others | Flaky tests | Each run creates and cleans up its own booking; no hard-coded ids |
| Server is a free tier and may be slow after idling | Timing assertions fail | Generous response-time threshold (2 s); warm-up request first |
| Load tests could disturb other users | Ethical / availability | Capped at 10 virtual users, short duration |
| API has weak validation | Many "expected to fail" checks | Known defects isolated in their own folder so CI stays green |

## 7. Deliverables

Test plan, test scenarios, test cases, Postman collection and environment, Newman HTML report, k6 scripts and report, bug reports.

## 8. Defect severity guide

| Severity | Meaning | Example |
|---|---|---|
| Critical | Data loss, security hole, system down | Unauthenticated delete |
| Major | Core feature wrong, no workaround | Invalid data stored silently |
| Minor | Incorrect behaviour with a workaround | Wrong status code |
| Trivial | Cosmetic / documentation | Typo in message |
