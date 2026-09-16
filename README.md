# Interview — Playwright API + UI Automation

A small Playwright/TypeScript test suite built for the technical interview of Beon.tech. It covers two public demo targets:

| Layer | Target under test | Spec |
| --- | --- | --- |
| API | [Restful Booker](https://restful-booker.herokuapp.com) (hotel-booking REST API) | [tests/SmokeTest/API/Restful-Booker.spec.ts](tests/SmokeTest/API/Restful-Booker.spec.ts) |
| UI | [Sauce Demo](https://www.saucedemo.com/) (Swag Labs storefront) | [tests/SmokeTest/UI/SauceDemo.spec.ts](tests/SmokeTest/UI/SauceDemo.spec.ts) |

The API spec walks the full booking CRUD lifecycle (auth → create → read → update → delete); the UI spec automates the storefront login.

---

## Layout

```
Interview/
├── .env                      # base URLs + credentials (demo only — see Configuration)
├── playwright.config.ts      # single chromium project, HTML reporter, dotenv loading
├── tsconfig.json             # type-check only (noEmit), strict + noUncheckedIndexedAccess
├── Helpers/
│   └── Types.ts              # shared types: additionalneeds union, Auth_token
├── POM/                      # object layer: API service objects + UI page objects
│   ├── API/
│   │   ├── Authorization.ts  # POST /auth
│   │   ├── CreateBooking.ts  # POST /booking
│   │   ├── GetBooking.ts     # GET /booking/:id
│   │   ├── UpdateBooking.ts  # PUT /booking/:id
│   │   └── Delete.ts         # DELETE /booking/:id
│   └── UI/
│       └── Login.ts          # Sauce Demo login page object
├── tests/SmokeTest/
│   ├── API/Restful-Booker.spec.ts
│   └── UI/SauceDemo.spec.ts
└── playwright-report/        # HTML report from the last run
```

The `POM` folder applies the Page Object Model to both layers: UI page objects take a `Page` and expose locators plus actions, while the API classes are service objects that take the `request` fixture (`APIRequestContext`) per call and own only their endpoint URL. Every class reads its base URL from `process.env` at construction time.

## Configuration

`.env` (not committed content — variable names only):

| Variable | Used by |
| --- | --- |
| `BASE_URL` | all API service objects in [POM/API/](POM/API/) |
| `TEST_USER`, `TEST_PASSWORD` | `POST /auth` in the `Check Authorization` test |
| `UI_BASE_URL` | `page.goto` in the UI spec |
| `TEST_USER_UI`, `TEST_PASSWORD_UI` | Sauce Demo login form |


On a real enviroment this credential would not be passed, and it would be only sent to the a real repo the .envExample instead of the .env, the .env it is just send for pure demo purposes 

## Running

There are no npm scripts defined, so invoke Playwright directly:

```bash
npm install
npx playwright install chromium

npx playwright test                      # everything
npx playwright test tests/SmokeTest/API  # API only
npx playwright test tests/SmokeTest/UI   # UI only
npx playwright test --headed             # watch the UI test
npx playwright show-report               # open the HTML report
npx tsc --noEmit                         # type-check
```

---

## The API tests

[tests/SmokeTest/API/Restful-Booker.spec.ts](tests/SmokeTest/API/Restful-Booker.spec.ts) — five tests that form one sequential lifecycle, all passing. The booking id created by test 2 is carried through tests 3-5 in a module-level `customerInformation` object, so a single record is created, read, updated and then deleted. Each test maps to one stage of the exercise brief, with the brief's acceptance criteria kept inline as comments.

### 1. `Check Authorization`
`POST /auth` with `TEST_USER` / `TEST_PASSWORD` via [POM/API/Authorization.ts](POM/API/Authorization.ts). Split into two `test.step`s: asserts `200`, then parses the body and asserts the returned `token` is non-empty. The token is stored in a module-level `localToken` object (see Issues).

### 2. `Create Bookin`
`POST /booking` via [POM/API/CreateBooking.ts](POM/API/CreateBooking.ts) with a fixed payload (`Jim Brown`, price `111`, check-in `2018-01-01`, check-out `2019-01-01`, `additionalneeds: "Breakfast"` typed by the `additionalneeds` union in [Helpers/Types.ts](Helpers/Types.ts)). Asserts `200`, that `bookingid` is present, and that the echoed `totalprice` and both booking dates match what was sent. Saves `bookingid` into `customerInformation.Id` for the following tests.

### 3. `Read Booking`
`GET /booking/:id` with the saved id via [POM/API/GetBooking.ts](POM/API/GetBooking.ts). Asserts `200` and that `totalprice`, `checkin` and `checkout` match the values created in test 2 — i.e. read-back verification of the persisted record. Note that this endpoint returns the booking fields flat, with no `bookingid` in the body, so the test reads the response without touching the stored id.

### 4. `Update Booking`
The `PUT /booking/:id` step, via [POM/API/UpdateBooking.ts](POM/API/UpdateBooking.ts) against the id from test 2. Sends a full replacement payload — renamed to `Joaquin Pareja`, price `+10`, dates moved to 2027 — with the `Authorization` header the API requires for writes. Asserts `200` and then every changed field (`firstname`, `lastname`, `totalprice`, both dates) on the response, which `PUT` returns flat rather than wrapped in a `booking` object the way `POST` does. Because the id is left untouched, test 5 goes on to delete this same updated record.

### 5. `Delete Booking`
`DELETE /booking/:id` via [POM/API/Delete.ts](POM/API/Delete.ts), asserting `201`, then re-issues the `GET` from test 3 and asserts `404` — confirming the deletion actually removed the record rather than trusting the status code alone. This is the strongest test in the file. Auth for the delete comes from a hard-coded `Basic` header in the service object (see Issues).

## The UI test

[tests/SmokeTest/UI/SauceDemo.spec.ts](tests/SmokeTest/UI/SauceDemo.spec.ts) — a single `Automate Login` test, structured as four `test.step`s driving [POM/UI/Login.ts](POM/UI/Login.ts):

1. **Visit Url** — `goto(UI_BASE_URL)`, assert the resulting URL contains `saucedemo.com`.
2. **Check Top header text** — assert the `.login_logo` element contains `Swag Labs`.
3. **Log in** — fill username and password, asserting each field's value after filling, then click the login button.
4. Post-login assertions — URL contains `/inventory.html` and the `Swag Labs` header is visible.

The page object exposes locators built on Sauce Demo's `data-test` attributes (`username`, `password`, `login-button`) plus `.login_logo`, and wraps the four actions (`visitSauceDemo`, `fillLogin`, `fillPassword`, `clickLoginButton`). Using `data-test` hooks rather than CSS/text is the right call — they survive restyling.

---

## Issues worth reporting

- **The auth token is captured and then it is  never requested until we hit the upgrage or delete, also the token is never refreshed we can have it hardcoded and it will never expire, this creates 2 importan securities breaches** 
This can be found in the [Restful-Booker.spec.ts:14], which through every endpoint request, except delete, we trigger them without the need to authorize us, this is a serious security breach.
We should follow the https://www.jwt.io/ standard for creating the authorization token to handle session security and expiration.

For example we must be promted to put the Authorization token but it's not throwing error at the time of the run for the following method.
    async get(request:APIRequestContext,bookingId:string){
        const getBookingId= request.get(`${this.getBookingById(bookingId)}`,{
       
        })
    }