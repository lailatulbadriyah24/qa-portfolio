# BUG-006 - Failed login returns `200 OK` instead of `401`

| | |
|---|---|
| **Severity / Priority** | Minor / P2 |
| **Status** | Open |
| **Environment** | https://restful-booker.herokuapp.com (public demo) |
| **Related test cases** | TC-AUTH-02, TC-AUTH-03 |

## Steps to reproduce

1. Send:
   ```http
   POST /auth
   Content-Type: application/json

   { "username": "admin", "password": "wrong" }
   ```

## Expected result

`401 Unauthorized`.

## Actual result

`200 OK` with body `{"reason":"Bad credentials"}` (no token). An empty body `{}` behaves the same.

## Impact

Clients and API gateways that treat `2xx` as success may misinterpret a failed login. Failed-login monitoring and rate limiting based on status codes will not work.

## Suggested fix

Return `401 Unauthorized` for invalid credentials and `400` for a malformed request.
