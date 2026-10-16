# BUG-002 - Booking accepts checkout date earlier than checkin

| | |
|---|---|
| **Severity / Priority** | Major / P1 |
| **Status** | Open |
| **Environment** | https://restful-booker.herokuapp.com (public demo) |
| **Related test case** | TC-CRT-06 |

## Steps to reproduce

1. Send `POST /booking` with `"bookingdates": { "checkin": "2026-11-10", "checkout": "2026-11-01" }` and otherwise valid data.

## Expected result

`400 Bad Request`: checkout must be after checkin.

## Actual result

`200 OK`; the booking is stored with checkout nine days before checkin.

## Impact

Invalid stays break availability calculation and pricing by number of nights.

## Suggested fix

Validate `checkout > checkin` on create and update.
