# Bug Reports

Defects found while testing Restful-Booker. Each was reproduced against the live API; the Postman folder **7. Known defects** contains an automated check for BUG-001 to BUG-004 and BUG-006.

| ID | Title | Severity | Priority | Status |
|---|---|---|---|---|
| [BUG-001](BUG-001-negative-price.md) | Booking accepts negative `totalprice` | Major | P1 | Open |
| [BUG-002](BUG-002-checkout-before-checkin.md) | Booking accepts checkout date earlier than checkin | Major | P1 | Open |
| BUG-003 | Booking accepts an empty `firstname` | Minor | P2 | Open |
| [BUG-004](BUG-004-invalid-types-and-dates.md) | Non-numeric price and malformed dates are silently corrupted (`null`, `0NaN-aN-aN`) | Major | P1 | Open |
| [BUG-005](BUG-005-missing-fields-500.md) | Missing required fields cause `500 Internal Server Error` instead of `400` | Major | P1 | Open |
| [BUG-006](BUG-006-failed-login-200.md) | Failed login returns `200 OK` instead of `401` | Minor | P2 | Open |
| BUG-007 | Inconsistent delete status codes: success returns `201`, repeat delete returns `405` (expected `204`/`200` and `404`) | Minor | P3 | Open |

**BUG-003 reproduction (one line):** `POST /booking` with `"firstname": ""` -> `200 OK`, booking stored with an empty name.

**BUG-007 reproduction (one line):** `DELETE /booking/{id}` with a valid token -> `201 Created`; the same request again -> `405 Method Not Allowed`.

## Report template

```
ID:
Title:
Environment:
Severity / Priority:
Preconditions:
Steps to reproduce:
Expected result:
Actual result:
Evidence (request / response):
Impact:
Suggested fix:
```
