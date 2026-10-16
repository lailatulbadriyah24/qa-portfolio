# BUG-005 - Missing required fields cause `500 Internal Server Error`

| | |
|---|---|
| **Severity / Priority** | Major / P1 |
| **Status** | Open |
| **Environment** | https://restful-booker.herokuapp.com (public demo) |
| **Related test case** | TC-CRT-03 |

## Steps to reproduce

1. Send:
   ```http
   POST /booking
   Content-Type: application/json
   Accept: application/json

   { "firstname": "OnlyName" }
   ```

## Expected result

`400 Bad Request` listing the missing required fields (`lastname`, `totalprice`, `depositpaid`, `bookingdates`).

## Actual result

`500 Internal Server Error` with a generic body.

## Impact

A 5xx tells clients the server failed, not that their request was wrong. It pollutes error monitoring and gives API consumers no way to fix the request.

## Suggested fix

Validate the request body and return `400` with details instead of letting the exception propagate.
