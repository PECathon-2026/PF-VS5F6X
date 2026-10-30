# SmallWebReader — Frontend Agent Rules

## Role
You are responsible for the frontend only. The backend is being developed separately on another laptop. The team is not using GitHub yet.

## Read before coding
- `docs/PROJECT_SPEC.md`
- `docs/API_CONTRACT.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/TEST_PLAN.md`
- `docs/FRONTEND_PLAN.md`
- `docs/HANDOFF.md` when continuing work

## Draft warning
The supplied project documents are initial drafts. Any item marked `PROVISIONAL`, `ASSUMPTION`, or `TO CONFIRM` must be checked with the team before implementation. Do not treat proposed endpoints as final until both frontend and backend owners approve `docs/API_CONTRACT.md`.

## Frontend scope
- Implement only approved pages, user journeys, and features.
- Inspect existing frontend code before creating or modifying files.
- Preserve the current framework and working code unless the team approves a change.
- Do not invent features, endpoints, request fields, or response fields.
- Do not edit backend code or silently change shared architecture.
- Use accessible labels, keyboard-friendly controls, and responsive layouts.

## API integration
- Read `docs/API_CONTRACT.md` instead of guessing.
- Centralize requests in one API client/service module.
- Read the API base URL from environment configuration.
- Never put backend secrets in frontend code or `VITE_` variables.
- Keep temporary mock data separate from real API calls.
- Never silently display mock success when a real API request fails.
- Implement loading, success, empty, and error states.
- If a route/schema/status code needs changing, propose the change and get backend-owner approval first.

## Local-only collaboration
- GitHub is not being used yet.
- Keep the frontend runnable independently.
- Document dependencies, environment variables, and run/test commands.
- Do not overwrite files received from the backend owner without reviewing them.
- Exchange the same approved copies of shared project documents with the backend owner.

## Verification and handoff
- Before each task, state briefly what files will change.
- Run available lint/build/tests and report exact commands and results.
- Distinguish implemented, tested, and untested features.
- Update `docs/FRONTEND_PLAN.md` and `docs/HANDOFF.md` with verified progress and the next task.
