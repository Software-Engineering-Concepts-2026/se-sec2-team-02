# Coverage Report — Lab09

## Scope

This report applies the Lab09 goals to the project's Next.js/TypeScript test
suite. The guide's Python examples were adapted to the existing `node:test`
and `tsx` setup.

## Testing Pyramid Assessment

There are 23 automated tests after this lab:

- Unit: 22 tests (95.7%) — pure utilities, constants, data validation, and the
  application workflow tested with injected doubles.
- Integration: 1 test (4.3%) — the real job catalogue is connected to the
  application workflow, an in-memory store, and a notification boundary.
- E2E: 0 tests (0%) — browser automation is outside this lab's current scope.

The suite is intentionally unit-heavy because the application currently has no
backend API or database in this repository. The integration test covers the
main cross-module path without making tests depend on external services.

## TDD Record

The new `submitApplication` workflow was developed in the Lab09 order:

1. Red: add tests for an open job, employer notification, and rejected jobs
   before the implementation existed.
2. Green: add the smallest workflow that looks up the job, saves the
   application, and sends one notification.
3. Refactor: isolate the repository, store, and notification interfaces so
   each boundary can be replaced independently in tests.

No Git commit was created for these stages, per the task request.

## Test Doubles

- Stub: `JobRepository.findById` returns a known open job.
- Mock: `NotificationMock` records calls and verifies the exact notification.
- Fake: `InMemoryApplicationStore` stores applications in a `Map`.

## Coverage and Quality Commands

```powershell
npm test
npm run test:coverage
npm run lint
```

Measured result: 23 passed, 98.40% line coverage, and 91.49% branch coverage.
`test:coverage` uses Node's built-in test coverage reporter. On this Windows
Node 24 environment, the command needed a temporary process-level workaround
for an `os.userInfo()`/`tsx` `ENOMEM` startup issue; CI runs the same commands
on a clean Node 20 environment.

## Saboteur Check

The boundary tests are designed to catch these mutations:

- Treating a closed job as open → the closed-job test fails.
- Skipping `applicationStore.save` → the saved application assertion fails.
- Sending zero or multiple notifications → the mock call assertions fail.
- Looking up the wrong job ID → the missing-job test fails.
