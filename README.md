# My Home Base

A calm, private personal dashboard. Step 1 includes sign-in, profiles, Today, Quick Capture, Inbox and account settings.

## Setup
1. Open the project in Lovable. Cloud is connected and supplies managed database/auth configuration.
2. Email/password, Google and Lovable sign-in are enabled. Email signups require confirmation; this is not silently disabled.
3. Create your account and follow the confirmation email. Set your name, timezone, content language and appearance in My account.
4. Add real tasks and optional next steps/deadlines. Select up to three for Today. The + button saves thoughts, tasks and links to the Inbox.

No client tasks or deadlines are fabricated. Habits and content widgets are honest empty states until Step 2. Family permissions and rewards are not yet implemented.

## Local development
Install Bun, use `bun install`, then `bun run dev`. Cloud-generated public configuration and server-only bindings are managed by Lovable; never put private keys into browser code. Deployment runs on the project's supported TanStack Start runtime, not Next.js.

## Structure and safety
- `src/features/home`: shared rules, authenticated server functions, queries and views.
- `src/routes`: public sign-in/recovery and client-only protected pages.
- Database migrations are managed by the migration tool. Each table has explicit grants and owner-only access policies.
- Profile creation uses an auth lifecycle trigger. Roles never belong in profile metadata.
- Daily priorities enforce three unique slots; mood and energy are integers from 1 to 5. Daily records use the profile's timezone.
- Quick Capture to task conversion is transactional and idempotent.
- Mixed-language text uses automatic writing direction; links only open HTTP(S) addresses.
- Recovery links land on `/reset-password`; signed-out access to private pages returns to sign-in.

## Verification
Run `bunx vitest run src/test/home-rules.test.ts src/test/app-routing.test.tsx`.
Check sign-in, capture → Inbox → task → Today priority, completion, mood/energy, persistence after reload, profile preferences, recovery and sign-out in the running app. Validate private access using a second account before expanding permissions.

## Later checkpoints
Step 2: habits, clients, school, notes, files and content planning.
Step 3: assistant. Step 4: family/rewards. Step 5: layout and home-screen installation.
Pause for user testing and approval between stages. Phone installation and offline support are not part of Step 1.
