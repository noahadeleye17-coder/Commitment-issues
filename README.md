# Commitment Issues

A personality readout for your git commit history. Paste a `git log` export
(no login, runs entirely in your browser) or connect GitHub to see when you
actually code, your longest streak, your messiest day, and which coding
archetype your history matches — presented as a git-diff-styled "commit."

Built with Next.js 14 (App Router), no external UI or charting libraries —
the heatmap and bar charts are hand-rolled SVG/CSS.

## Run it locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000. The **paste git log** flow works immediately,
no setup needed.

## Enable "Connect GitHub"

The GitHub flow needs an OAuth App so people can sign in with their GitHub
account.

1. Go to https://github.com/settings/applications/new
2. Fill in:
   - **Homepage URL**: `http://localhost:3000` (or your deployed URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
     (or `https://your-domain.vercel.app/api/auth/callback` once deployed)
3. Copy the generated **Client ID**, and generate + copy a **Client Secret**.
4. Create a `.env.local` file (copy `.env.example`) and fill in:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
5. Restart `npm run dev`.

Note: GitHub OAuth Apps only support one callback URL at a time. If you want
both local dev and a deployed version working, either create two separate
OAuth Apps (recommended), or update the callback URL when you switch between
them.

## Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com/new and import the repo. Framework preset
   ("Next.js") is auto-detected — no config needed.
3. Before the first deploy (or after, in Project Settings → Environment
   Variables), add:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL` — your Vercel URL, e.g. `https://commitment-issues.vercel.app`
     (no trailing slash)
4. Deploy. Then go back to your GitHub OAuth App settings and update the
   **Authorization callback URL** to
   `https://your-vercel-url.vercel.app/api/auth/callback`.

That's it — the paste flow needs no env vars at all, so the site is fully
usable even before you set up GitHub OAuth.

## How the GitHub flow works

- `/api/auth/github` redirects to GitHub's OAuth consent screen (requesting
  no scopes beyond identifying the user — meaning it can only read **public**
  repo data, nothing private).
- `/api/auth/callback` exchanges the code for an access token and stores it
  in a short-lived (10 min), httpOnly cookie.
- `/api/stats` uses that token to pull the user's ~12 most recently
  pushed-to repos and up to 100 commits per repo, then immediately clears
  the cookie (the token is single-use).
- If you want private repos included too, change the `scope` in
  `app/api/auth/github/route.js` from `""` to `"repo"` — and update the
  privacy copy on the landing page to reflect that.

## Project structure

```
app/
  page.js              landing page (terminal hero)
  paste/page.js         paste-a-git-log flow
  results/page.js       stats dashboard (used by both flows)
  api/auth/github/      OAuth redirect
  api/auth/callback/    OAuth token exchange
  api/stats/            fetches + returns GitHub commit data
components/             Heatmap, WeekdayBars, PersonalityCard, TerminalHero
lib/
  parseGitLog.js         parses pasted git log text
  computeStats.js         shared stats + personality-archetype logic
```
