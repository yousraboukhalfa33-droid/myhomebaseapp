# Personal life dashboard

## What you’ll get
A calm home base for client work, school, content, and everyday life. English interface, French and Arabic content support, generous tap targets, muted colors, and light/dark themes. No guilt for missed days.

**Approval starts Step 1 only.** I’ll pause after each step so you can test it before the next begins. No application code or Cloud setup has been changed yet.

## Today: five widgets, maximum
1. **Top 3 priorities** — select tasks from work or school and complete them with one tap. Put the next small step inside this widget rather than adding a sixth widget.
2. **Next deadline** — nearest deadline, with up to three upcoming exams/assignments inside the same widget.
3. **Posts coming up** — posts due in the next three days.
4. **Habits check-in** — complete, skip, or rest without penalties.
5. **Energy & mood** — separate 1–5 emoji check-ins, with “Plan my day” added in Step 3.

A floating **+** opens Quick Capture for a thought, task, or link. Captures go to the Inbox for sorting later. The assistant opens as a panel, not an extra home widget.

Only working controls appear at each stage. Step 1 can show honest empty habit/post states; tracking and content planning arrive in Step 2. No invented deadlines, school courses, client links, or completed work.

## Proposed pages
| Page | Purpose | Stage |
|---|---|---|
| Today `/` | Five-widget home, priorities, check-ins, quick capture | 1 |
| Sign in `/auth` | Sign in, sign up, and confirmation state | 1 |
| Reset password `/reset-password` | Complete email password recovery | 1 |
| Inbox `/inbox` | Review captures; turn them into tasks or notes | 1; note conversion in 2 |
| Account `/account` | Display name and personal settings | 1 |
| Habits `/habits` | Flexible schedules, weekly check-ins, routines | 2 |
| Projects `/projects` | Client/project list with status filters | 2 |
| Project `/projects/$projectId` | Tasks, notes, links, files, deadlines, content calendar tabs | 2 |
| School `/school` | Courses, assignments, exams, English lesson planning | 2 |
| Course `/school/courses/$courseId` | Tasks, readings, notes, deadlines | 2 |
| Dissertation `/school/dissertation` | Topic options, internship, milestones, supervisor notes, chapters | 2 |
| Group project `/school/groups/$projectId` | Team assignments and status per person | 2 |
| Notes `/notes` | Searchable, taggable notes and links | 2 |
| Calendar `/calendar` | Deadlines plus month/week content planning | 2 |
| Family `/family` | Family profiles and parent controls | 4 |
| Kid home `/kid` | Simplified chores, points, and rewards | 4 |
| Settings `/settings` | Reorder/hide Today widgets; reminders and appearance | 5 |

Tabs within a project share that project’s page. Each named page gets its own title and description. All personal pages require sign-in; the public entry shows sign-in when signed out and Today when signed in, without creating two competing home pages.

## Proposed data structure
Create tables incrementally with the step that needs them, not all at once.

### Step 1 — Accounts and daily life
| Table | Main fields / purpose |
|---|---|
| `profiles` | Auth user ID, display name, avatar path, timezone, preferred content language, appearance preference. Automatically created on signup. |
| `tasks` | Owner, optional project, title, next small step, status, due date, estimated minutes, energy demand, optional assignee. |
| `daily_priorities` | Owner, local date, task, position 1–3. Unique position and task per day; maximum three. |
| `daily_checkins` | Owner, local date, mood 1–5, energy 1–5. One entry per local day. |
| `inbox_items` | Owner, kind (thought/task/link), text, optional URL, captured date, sorted date, resulting task/note reference. |

Profiles store personal information, **never permission roles**. Authentication handles credentials; no passwords are stored in app tables.

### Step 2 — Work, school, habits, and content
| Table | Main fields / purpose |
|---|---|
| `projects` | Owner, name, category, client status, description, brand voice note. |
| `notes`, `tags`, `note_tags` | Owner, optional project/course, title, multilingual body, tags. |
| `project_links`, `project_files` | Owner, project, title, URL or private file path. Files live in private Cloud storage. |
| `habits`, `habit_checkins` | Owner, schedule, reminder preference; dated complete/skip/rest outcomes. |
| `routines`, `routine_steps` | Owner, routine name, ordered habit/task steps. |
| `courses` | Owner, title, program, notes; connect readings/tasks/deadlines to the course. |
| `dissertations`, `topic_options`, `dissertation_chapters` | Internship requirement, topic choice, supervisor notes, chapter checklist. |
| `milestones` | Owner, optional project/course/dissertation, title, type, date. Source for deadline and countdown views. |
| `team_assignments` | Group project, person’s display name, task, status. Planning records only; not shared account access. |
| `english_lessons` | Owner, title, objectives, materials, plan, planned date. |
| `fiverr_orders` | Owner, project, buyer, brief, due date, status. Manual orders inbox, not an automatic Fiverr integration. |
| `content_posts` | Owner, client/project, platform, language, idea, caption, hook, visual URL, hashtags, planned date, status. |

Client statuses: **Lead / Active / Waiting on client / Delivered / Invoiced**.
Post statuses: **Idea / Designing / Ready / Scheduled / Posted**.
Platforms: **Instagram / LinkedIn / TikTok / Facebook**.

Content calendar includes month/week views, client/platform filters, drag-to-date scheduling, and a batch view grouped by client for missing captions or visuals. This is planning only; it does not automatically publish to social platforms.

### Step 3 — Assistant
| Table | Main fields / purpose |
|---|---|
| `assistant_threads`, `assistant_messages` | Owner, thread, role, content, timestamps. |

Use Anthropic models with credentials kept server-side. Only the signed-in user’s authorized tasks, notes, projects, brand voice, and energy are available to the assistant. It proposes tiny steps, day plans, summaries, and messages; task/calendar changes require confirmation. Post assistance generates three caption options, a hook, and hashtags in the chosen language and brand tone.

### Step 4 — Family and rewards
| Table | Main fields / purpose |
|---|---|
| `households`, `household_members` | Family group and associated authenticated profiles. |
| `user_roles` | User, household, role (parent/member/child). Separate from profiles; no self-granted parent access. |
| `chores`, `chore_submissions` | Household, child assignee, points value, completion awaiting parent approval. |
| `rewards`, `reward_requests` | Parent-managed catalog, point cost, child request, approval status. |
| `points_ledger` | Child, signed point movement, source approval/redemption; unique source prevents double awards. |

Family members use separate logins by default. Before Step 4, confirm whether children need separate logins or parent-managed profiles without their own credentials. Never expose private work or school information to children just because they belong to the same family. Parents can manage family chores and rewards, not unrelated private notes. Points and redemptions are validated together to prevent double spending.

### Step 5 — Personalization
| Table | Main fields / purpose |
|---|---|
| `widget_preferences` | Owner, widget key, visibility, order; enforce no more than five visible Today widgets. |
| `reminder_preferences` | Owner, channel/settings, quiet hours. |

## Your initial setup
- Create project shells for **Dimel Énergie et Électricité, Dima Light, MJ Marketing, MYG, and Fiverr** with the work descriptions you supplied.
- Create the **ENSM Marketing Management** school space, dissertation structure, English lesson planning, and group projects **Mautic** and **DECODE**.
- Do not guess client statuses, brand voice, dates, course names, or real tasks. Leave unknown details unset and ask for them when that stage needs them.
- Seed private personal records for your main account only, as part of the database setup—not for every new signup and not on page load.

## Delivery checkpoints
1. **Sign-in + profiles + Today + Quick Capture.** Enable Cloud after approval; create the first private tables. Test signed-in capture, task creation, three priorities, mood/energy saving, reload, password recovery, and sign-out. Pause.
2. **Habits + projects + notes + school + content calendar.** Add your supplied project shells, flexible check-ins, files, deadlines, calendar scheduling, and batch planning. Pause.
3. **Assistant.** Add the panel and post-writing help; test language matching, private context, and confirmed task changes. Pause.
4. **Kid profiles + rewards.** Confirm child access model, then add parent-approved chores, points, customizable rewards, and private family access. Pause.
5. **Layout + polish.** Reorder/hide widgets, test phone and desktop layouts, improve performance, add phone-home-screen installation, and update setup instructions. Pause.

## Technical notes
- This workspace uses **TanStack Start + TypeScript**, rather than Next.js. Keep its supported framework, with Tailwind and shadcn controls, while delivering the requested experience.
- **Lovable Cloud** provides the database, logins, and private file storage. Connect it only after approval.
- App actions use authenticated server functions; each private operation verifies the caller. Anthropic access stays server-side using the project’s managed AI integration.
- All tables have explicit grants and row-level access rules. Personal data is owner-only; family data has separately verified parent/child permissions. Enforce numeric limits in the database as well as the interface.
- Initial reads use cached queries. Keep Today lightweight and load later pages on demand. Verify speed rather than promising a universal sub-two-second load.
- Use `dir="auto"` for mixed-language content and explicit RTL where appropriate.
- Phone installation uses a manifest and icons only; **no offline caching** unless you request offline use.
- Test concrete rules: three priorities, five widgets, 1–5 scales, skip/rest outcomes, three-day post window, private access, and approval/points accounting as each is introduced.
- Keep commented code and a README describing setup, credentials, stages, and verification.

## Details to collect later
The dashboard’s name, timezone, reminder preferences, real deadlines/course names, and child access preferences are not specified. They do not block this proposal; ask for them before the relevant stage, without inventing personal data.