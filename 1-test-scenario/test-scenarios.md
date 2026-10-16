# Test Scenarios - Restful-Booker API

High-level scenarios. Detailed steps live in `test-cases.csv`.

## TS-AUTH - Authentication (`POST /auth`)

| ID | Scenario | Type |
|---|---|---|
| TS-AUTH-01 | A user with valid credentials receives a token | Positive |
| TS-AUTH-02 | A user with wrong credentials does not receive a token | Negative |
| TS-AUTH-03 | A request without credentials does not receive a token | Negative |

## TS-CRT - Create booking (`POST /booking`)

| ID | Scenario | Type |
|---|---|---|
| TS-CRT-01 | A booking with all valid fields is created and an id is returned | Positive |
| TS-CRT-02 | A booking without optional fields is created | Positive |
| TS-CRT-03 | A request with missing required fields is rejected with a client error | Negative |
| TS-CRT-04 | Field values outside valid ranges (negative price, checkout before checkin) are rejected | Boundary / negative |
| TS-CRT-05 | Wrong data types and malformed dates are rejected | Negative |
| TS-CRT-06 | Empty / very long / special-character text is handled safely | Boundary / security |
| TS-CRT-07 | The request is rejected when the `Accept` header is missing | Negative |

## TS-GET - Read bookings (`GET /booking`, `GET /booking/{id}`)

| ID | Scenario | Type |
|---|---|---|
| TS-GET-01 | An existing booking can be fetched by id and matches the schema | Positive |
| TS-GET-02 | A non-existent or malformed id returns 404 | Negative |
| TS-GET-03 | The booking list returns ids | Positive |
| TS-GET-04 | The list can be filtered by name and by dates | Positive |

## TS-UPD - Update booking (`PUT`, `PATCH /booking/{id}`)

| ID | Scenario | Type |
|---|---|---|
| TS-UPD-01 | An authenticated user can fully replace a booking | Positive |
| TS-UPD-02 | An authenticated user can change only some fields | Positive |
| TS-UPD-03 | A request without or with an invalid token is rejected | Security |

## TS-DEL - Delete booking (`DELETE /booking/{id}`)

| ID | Scenario | Type |
|---|---|---|
| TS-DEL-01 | An authenticated user can delete a booking and it can no longer be fetched | Positive |
| TS-DEL-02 | An unauthenticated delete is rejected | Security |
| TS-DEL-03 | Deleting a booking that no longer exists is handled gracefully | Negative |

## TS-E2E - End-to-end flow

| ID | Scenario |
|---|---|
| TS-E2E-01 | Login -> create booking -> read it -> update it -> partially update it -> delete it -> confirm it is gone (Postman folders 1-5 run in order) |

## TS-NFR - Non-functional

| ID | Scenario | Tool |
|---|---|---|
| TS-NFR-01 | Key endpoints respond in under 2 s for a single user | Postman assertion |
| TS-NFR-02 | Under 10 concurrent users, p95 latency and error rate stay within threshold | k6 load test |
| TS-NFR-03 | Behaviour as load is increased past normal levels (find the breaking point) | k6 stress test |

## Traceability

| Scenario | Test cases |
|---|---|
| TS-AUTH-* | TC-AUTH-01 .. 03 |
| TS-CRT-* | TC-CRT-01 .. 11 |
| TS-GET-* | TC-GET-01 .. 06 |
| TS-UPD-* | TC-UPD-01 .. 05 |
| TS-DEL-* | TC-DEL-01 .. 04 |
