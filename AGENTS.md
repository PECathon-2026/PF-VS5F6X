# SmallWebReader — AI Development Rules

## Project status
This is a local-only working workspace. GitHub is not being used yet.
The frontend and backend are being developed separately on different laptops.

## Source of truth
Before coding, read the relevant files:
- `docs/PROJECT_SPEC.md`
- `docs/API_CONTRACT.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/TEST_PLAN.md`
- `docs/HANDOFF.md`

**Important:** These are initial working drafts. Any item marked `PROVISIONAL`, `ASSUMPTION`, or `TO CONFIRM` must be checked against the team's final report, problem statement, and agreed API contract before implementation.

## Scope
- Implement only the approved MVP.
- Do not add unapproved features.
- Do not silently change the API contract.
- Do not invent product requirements when information is missing; ask a concise question.
- Inspect existing files before creating or changing files.
- Do not overwrite or delete existing work without approval.

## API rules
- `docs/API_CONTRACT.md` is the shared interface agreement once the team confirms it.
- Frontend and backend must use the same route names, methods, request fields, response fields, and error format.
- If a change is necessary, propose it first and notify both frontend and backend owners.

## Backend safety
- Treat user-supplied URLs as untrusted input.
- Defend against SSRF: block localhost, private/internal IP ranges, link-local and reserved addresses; validate DNS resolution and redirects; re-check every redirect target; apply timeouts and response-size limits.
- Do not expose secrets or put backend API keys in frontend code.
- Use environment variables for secrets. Commit only placeholder values in `.env.example`.
- Do not log full sensitive content unnecessarily.
- Do not claim privacy or security guarantees that have not been implemented and tested.
- Never present mock data as real output.

## Frontend rules
- Keep API calls centralized in one client/service module.
- Read the contract instead of inventing endpoints or fields.
- Separate temporary mock data from real API calls.
- Show loading, empty, success, and error states.

## Verification
- Before coding, briefly state the task and files to change.
- Run relevant tests after changes and report exact commands/results.
- Distinguish implemented, tested, and untested functionality.
- Update `docs/HANDOFF.md` with verified progress and the next concrete step.
