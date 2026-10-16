# BUG-004 - Non-numeric price and malformed dates are silently corrupted

| | |
|---|---|
| **Severity / Priority** | Major / P1 |
| **Status** | Open |
| **Environment** | https://restful-booker.herokuapp.com (public demo) |
| **Related test cases** | TC-CRT-08, TC-CRT-09 |

## Steps to reproduce

**Case A - wrong type**
1. `POST /booking` with `"totalprice": "abc"` and otherwise valid data.

**Case B - malformed date**
1. `POST /booking` with `"checkin": "not-a-date"` and otherwise valid data.

## Expected result

`400 Bad Request` describing the invalid field.

## Actual result

Both return `200 OK` and the data is silently corrupted:

| Input | Stored value |
|---|---|
| `"totalprice": "abc"` | `"totalprice": null` |
| `"checkin": "not-a-date"` | `"checkin": "0NaN-aN-aN"` |

## Impact

Silent data corruption: the caller believes the booking was saved correctly. Downstream reports and date logic receive `null` or an unparseable date.

## Suggested fix

Validate types and ISO-8601 date format (`YYYY-MM-DD`) before persisting, and return a field-level error message.
