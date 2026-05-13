# Git Create Semantic Commits

Create semantic commits from all available changes.

Do not make one big commit by default.
Group files by purpose
Commit each group separately.

## Goal

Turn the current working tree into clean, meaningful commits.
No guessing. No mega commits. No vague messages. NO mixing unrelated changes.

## Steps

### 1. Inspect repository state

Check what changed:

```bash
git status --short
```

Check staged changes:

```bash
git diff --cached
```

Check unstaged changes:

```bash
git diff
```

Check untracked files:

```bash
git ls-files --others --exclude-standard
```

Understand every available changes before committing.

### 2. Detect issue key

Check branch name and context for an issue key.

```bash
git branch --show-current
```

Examples:

— `PROJ-123`
— `POW-456`
— `#123`

If there is a clear issue key, use it in every related commit.

If there is no issue key, commit without it.

Do not invent one.

### 3. Group changes semantically

Group files and hunks by intent.


Examples of valid groups:

— one bug fix
— one feature
— one refactor
— one test update
— one documentation change
— one dependency update
— one config or CI change

One commit = one purpose

If two files changed for the same reason, commit them together.

If one file contains unrelated changes, split hunks.

Use:

```bash
git add -p
```

or state files explicitly:

```bash
git add <file>
```

Do not use `git add -A` blindly when changes are unrelated.

### 4. Create commits one by one

For each semantic group:

1. State only the files or hunks for that group.
2. Verify the staged diff.
3. Create a Conventional Commit message.
4. Commit.
5. Repeat until no meaningful changes remain.

Verify staged diff:

```bash
git diff --cached
```

Commit format:

```bash
git commit -m "<type>(<scope>): <summary>"
```

With issue key:

```bash
git commit -m "<issue-key>: <type>(<scope>): <summary>"
```

Examples:

```bash
git commit -m "fix(auth): Handle expired token refresh"
git commit -m "feat(api): Add user activity endpoint"
git commit -m "refactor(ui): Simplify modal state handling"
git commit -m "test(auth): Cover expired token flow"
git commit -m "PROJ-123: fix(auth): Handle token refresh"
```

### 5. Keep committing until done

After each commit, check remaining changes:

```bash
git status --short
```

If changes remain, inspect them again and create the next semantic commit.

Stop only when:

— all intentional changes are committed
— unrelated or unsafe changes are left unstaged on purpose
— the user must decide what to do with ambiguous changes

## Commit types

Use the most accurate type:

— `feat`: new feature
— `fix`: bug fix
— `docs`: documentation only
— `style`: formatting only, no logic change
— `refactor`: code change without behavior change
— `perf`: performance improvement
— `test`: tests added or updated
— `build`: build system or dependencies
— `ci`: CI/CD changes
— `chore`: maintenance
— `revert`: revert previous commit

## Scope

Use a short scope when useful:

```bash
fix(auth): Handle expired session
feat(payments): Add retry flow
docs(readme): Update setup instructions
test(cart): Cover discount calculation
```

Skip scope only if it adds no value:

```bash
chore: Update dependencies
```

Good scopes are usually:

— feature area
— package name
— route name
— module name
— service name
— config name

Examples:

```bash
fix(login): Show invalid credentials error
feat(dashboard): Add revenue chart
test(api): Cover pagination params
ci(github): Cache pnpm dependencies
build(vite): Update bundle config
```

## Message rules

— Max 72 characters.
— Use imperative mood: `Add`, `Fix`, `Update`, `Remove`.
— Capitalize the summary.
— Be specific.
— Describe the purpose, not just the file changed.
— Do not mention implementation details unless they are the point.
— Do not say `changes`, `stuff`, `misc`, or other filler words.

Good:

```bash
git commit -m "fix(auth): Refresh token before request retry"
git commit -m "feat(profile): Add avatar upload"
git commit -m "test(cart): Cover discount calculation"
git commit -m "docs(api): Document pagination params"
git commit -m "chore: Remove unused dev dependency"
```

Bad:

```bash
git commit -m "fix stuff"
git commit -m "WIP"
git commit -m "updates"
git commit -m "asdf"
git commit -m "(): Broken scope"
```

## Multi-line commit body (optional)

Use when the summary is not enough (breaking changes, migration steps, ticket context):

```bash
git commit -m "feat(posts): Add bilingual metadata schema" -m "Flatten locales in api.js for the list view.

BREAKING CHANGE: posts.json must use date + locales object per AGENT.md."
```

Keep the first line within 72 characters; body can wrap at 72 for readability in `git log`.

## Binary, assets, and generated files

— Commit images (`images/`), fonts, and PDFs with a clear message: `feat(posts): Add hero image for tokens article`.
— If generated output is tracked, commit it separately from the generator change: `chore: Regenerate sitemap` vs `feat: Add sitemap script`.
— Never mix a 5 MB asset rename with a one-line CSS fix in the same commit unless they are the same logical change.

## Renames and moves

Use `git status` to see renames (`R`). Prefer one commit per rename story:

```bash
git commit -m "refactor(css): Move syntax theme into syntax.css"
```

If Git does not detect rename similarity, two deletes + two adds are still one commit if the intent is a single move.

## When not to split

— Single typo fix across three files: one `docs:` or `fix:` commit is fine.
— Lockfile + `package.json` from one `npm install`: one `build:` or `chore:` commit (this repo may not use npm; same idea for any manifest).
— Config + code that only works together: one commit with the clearest primary type.

## Stuck with mixed hunks in one file

```bash
git add -p path/to/file.js
```

If splitting is too painful, commit the file once with an honest message covering the dominant change, then follow up immediately with a second commit only if the remainder is still meaningful and separable.

## Amend vs new commit

— **Amend** (`git commit --amend`) only for the last commit, only before push (or if you will force-push with team agreement), and only to fix message typos or add forgotten files that belong to that same commit.
— **New commit** for anything already pushed to a shared branch or when the change is logically separate.

## Pre-push sanity (quick)

```bash
git log --oneline -10
git diff origin/main...HEAD
```

Confirm there are no accidental secrets, `.env`, or personal machine paths in the diff.

## If Conventional Commits do not fit

Prefer the closest type plus a clear summary:

— Copy-only or legal text: `docs:` or `chore:`.
— Revert: `revert:` with subject referencing the reverted SHA or message.
— Release tagging and changelog are out of scope here; keep commits atomic first.

Group suggestions aligned with the static blog layout:

| Area | Typical type | Example scope |
|------|----------------|---------------|
| `posts/*.html` content | `feat` / `fix` | `posts` |
| `posts/posts.json` | `feat` / `fix` | `posts` |
| `javascript/` behavior | `feat` / `fix` / `refactor` | `router`, `i18n`, `seo` |
| `css/` | `fix` / `style` / `feat` | `layout`, `components` |
| `images/` | `feat` / `chore` | `assets` |
| `pages/about*.html` | `docs` / `feat` | `about` |
| `.github/workflows/` | `ci` | `github-pages` |
| `AGENT.md` / `.cursor/` | `docs` | `docs` |

Example sequence after adding a post:

1. `feat(posts): Add article HTML for topic X (ES/EN)`
2. `feat(posts): Register topic X in posts.json`
3. `feat(assets): Add illustrations for topic X` (if images are large or many)

## Anti-patterns

— One commit titled `update` touching CSS, JS, JSON, and three posts.
— Using `git commit -a` to avoid reviewing the index.
— Conventional type that lies (`feat` for comment-only deletion).
— Scope that is the entire repo: `fix(all): ...` — prefer a real module name or omit scope.

## Checklist before declaring "done"

— `git status` is clean for intentional work (or only deliberate unstaged noise).
— Each commit message matches imperative mood and length rule.
— Types and scopes match the tables above.
— No unrelated file slipped in via `git add .` without review.

## Quick reference

```text
feat     new user-visible behavior
fix      bug fix
docs     documentation / comments meant for readers
style    formatting, whitespace (no logic)
refactor behavior-neutral code change
perf     faster, less memory
test     tests only
build    tooling, deps, bundler
ci       pipelines, Actions, hooks config
chore    maintenance, regen, trivial config
revert   undo a prior commit
```

## Summary

Inspect, group by intent, stage precisely, commit with a truthful Conventional message, repeat until the tree matches what you want on `main`. When in doubt, smaller commits beat one vague blob.

## Advanced (optional)

### Merge commits

When integrating a branch, prefer **merge** with a message that states what landed, or **squash merge** via GitHub if policy requires a single commit on `main`. If you create a local merge commit, the default merge message is acceptable; append the issue key in the title if your team requires it.

### Revert

```bash
git revert <sha>
```

Use `revert` for shared history; the generated message is fine if you add context in the body. Do not rewrite `main` with `reset --hard` after push without team agreement.

### Interactive rebase (before push only)

Squash or reword local commits:

```bash
git rebase -i origin/main
```

Never rebase commits others have based work on unless coordinated.

### Conflicts during `git add -p`

Resolve the working tree first, then re-run `git add -p`. If a hunk is ambiguous, stage the whole file once, commit, and split logically in a follow-up only if it remains worth the noise.

### Deploy branch (`main` → GitHub Pages)

This site deploys from **push to `main`** (see `.github/workflows/static.yml`). Treat commits on `main` as production-facing: prefer clean Conventional messages so deploy notifications and `git log` stay readable.
