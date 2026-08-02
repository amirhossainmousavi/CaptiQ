# Agent Rules

- Never hardcode API keys or secrets; always use `process.env` or request body.
- The user's API key (provided in the request body) must NEVER be cached, logged, or echoed in error messages. It exists only in the memory of the current request.
- Every async function must have a `try/catch` block and return errors in the project's standard JSON format.
- After completing each phase (Phase 1 to 6), provide a summary of changes and the results of manual tests before proceeding to the next phase.
- Format code using ESLint + Prettier.
- Do not add new dependencies without a clear justification.
- Confirm with the user before changing the defined directory structure.
