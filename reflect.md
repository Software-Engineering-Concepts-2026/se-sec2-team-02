 # Reflection: Lab 6 and Lab 7

## Lab 6: Post-quiz

### 1. Dockerfile draft

The Dockerfile uses a multi-stage build. The first stage installs dependencies,
the second stage runs `npm run build`, and the final runner stage copies only
the production output. This reduces the final image and keeps development
dependencies and source build steps out of production. The runner exposes port
3000 and uses the non-root `nextjs` user. The stats-service Dockerfile follows
the same idea and uses `USER node` in its runner stage.

### 2. Service decomposition: Rule of Twos

The Rule of Twos is a warning against splitting a system into services too
early. A service boundary should be justified by at least two independent
reasons, such as a different scaling need, a different deployment lifecycle,
or a clear ownership/security boundary. In this project, the statistics
service has a separate responsibility and can be deployed independently, so it
is a reasonable extraction. Splitting every UI component into a service would
add network and operational complexity without a second strong reason.

### 3. REST

REST models resources and uses standard HTTP methods, status codes, and
representations. The statistics service exposes `GET /health` for service
health and `GET /api/stats` for a read-only statistics representation. These
requests are safe and idempotent, return JSON, and should return a successful
2xx status when the resource is available. A future create operation would use
`POST`, while updates and deletion would use `PUT`/`PATCH` and `DELETE` only
when those resource operations are actually needed.

## Lab 7: Post-quiz

### 1. DRY Hunt

The refactoring work searched for repeated formatting, filtering, sorting, and
category values. Shared behavior was moved to `src/utils/format.ts` and
`src/utils/jobFilters.ts`, while categories were centralized in
`src/constants/categories.ts`. The goal was to remove duplicated knowledge,
not merely make similar-looking code shorter.

### 2. Orthogonality

Orthogonality means that a change in one responsibility should have little or
no unexpected effect on another. Keeping formatting utilities, job filtering,
category constants, mock data, and UI components separate makes each part
easier to test and change. The refactor preserves the existing UI behavior and
does not introduce a new feature.

### 3. Refactoring plan

First, establish a passing test baseline. Next, identify one smell at a time,
make the smallest behavior-preserving change, and run the focused tests. Then
run the complete test suite and lint/build checks. Finally, inspect the diff for
unrelated changes and document the before/after behavior in the refactoring
journal. Any new feature request must be handled separately from the
refactoring branch so the change remains reviewable.
