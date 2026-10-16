# BUG-001 - Booking accepts negative `totalprice`

| | |
|---|---|
| **Severity / Priority** | Major / P1 |
| **Status** | Open |
| **Environment** | https://restful-booker.herokuapp.com (public demo) |
| **Related test case** | TC-CRT-05 |

## Steps to reproduce

1. Send:
   ```http
   POST /booking
   Content-Type: application/json
   Accept: application/json

   {
     "firstname": "A", "lastname": "B",
     "totalprice": -100, "depositpaid": true,
     "bookingdates": { "checkin": "2026-11-01", "checkout": "2026-11-02" }
   }
   ```

## Expected result

`400 Bad Request` with a message that `totalprice` must be zero or greater.

## Actual result

`200 OK`; the booking is stored with `"totalprice": -100`.

## Impact

Negative amounts corrupt revenue reporting and could be abused to create credits or refunds.

## Suggested fix

Validate `totalprice >= 0` on create and update (`POST`, `PUT`, `PATCH`).
