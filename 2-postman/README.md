# Postman API Tests

Collection: `RestfulBooker.postman_collection.json` - 22 requests, 41 assertions in the regression folders.

## Folder structure

| Folder | Purpose | Expected result |
|---|---|---|
| 0. Health | `GET /ping` | Pass |
| 1. Auth | Login (stores `token`), negative logins | Pass |
| 2. Booking - Create | Valid create (stores `bookingId`), missing header, missing fields, optional fields | Pass |
| 3. Booking - Read | Get by id with JSON-schema check, 404 cases, list, filter | Pass |
| 4. Booking - Update | PUT / PATCH with and without token | Pass |
| 5. Booking - Delete | Delete, verify gone, double delete | Pass |
| 6. Data-driven | Creates one booking per row in `data/bookings.csv` | Pass |
| 7. Known defects | Asserts the **correct** behaviour for BUG-001..006 | **Fail on purpose** (documents bugs) |

Folders 0-5 share state (`token`, `bookingId`) and must run in order.

## What the tests demonstrate

- Collection variables and chaining (token and id passed between requests)
- Environment file for the base URL and credentials
- Status, body, schema (`jsonSchema`) and response-time assertions
- Positive, negative and security cases (missing or invalid token)
- Data-driven testing with a CSV file
- Separating stable regression tests from known defects so CI stays meaningful

## Run in Postman

Import the collection and `environments/public-demo.postman_environment.json`, select the environment, then run the collection (folders 0-5).

## Run from the command line

```bash
npm install
npm run test:api          # regression suite + HTML report in 2-postman/reports/
npm run test:api:data     # data-driven folder with bookings.csv
npm run test:api:defects  # known defects (will report failures, by design)
```

The public demo credentials in the environment file are the ones published by the API's authors, not secrets.
