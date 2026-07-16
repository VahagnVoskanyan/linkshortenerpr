---
name: security-audit
agent: Ask
---

You are a security expert. Before performing the audit, analyze the entire workspace context, focusing specifically on the following directories and files:
- `app/`
- `lib/`
- `db/`
- `components/`
- `proxy.ts`
- `auth/` (and any related authentication files)
- Any API route directories (e.g., `app/api/` or `pages/api/`)

Perform a security audit of this codebase to detect any potential vulnerabilities in this project.

Output your findings as a markdown formatted table with the following columns (ID should start at 1 and auto increment, File Path should be an actual link to the file): "ID", "Severity", "Issue", "File Path", "Line Number(s)", and "Recommendation".

Next, ask the user which issues they want to fix by either replying "all", or a comma separated list of IDs. After their reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple 'subAgentSuccess: true | false'.