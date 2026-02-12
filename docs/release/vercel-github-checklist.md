# Vercel + GitHub Release Checklist

This is the exact manual setup you need to do once.

## 1) Vercel project settings

1. Open your Vercel project connected to this repository.
2. Set **Root Directory** to `apps/www`.
3. Keep framework auto-detected as **Next.js**.
4. Keep the default build command (`next build`) and output (`.next`).
5. Add env var in Vercel:
   - `NEXT_PUBLIC_SITE_URL=https://<your-production-domain>`
6. Redeploy once after saving settings.

## 2) Confirm live registry endpoints

After deploy, verify these URLs in browser:

- `https://<your-production-domain>/registry.json`
- `https://<your-production-domain>/r/bar-chart.json`

If both load JSON, `shadcn add` integration is live.

## 3) GitHub Actions secrets

In GitHub repo settings, add:

- `NPM_TOKEN`: npm automation token with publish access to `@devstool/shadcn-echarts` (or your final scope)

No other custom secret is required for this setup.

## 4) npm package prerequisites

1. Ensure the npm scope exists and you have publish rights.
2. For first publish under a scope, keep package access as public.
3. Validate local release commands:
   - `pnpm changeset`
   - `pnpm version-packages`
   - `pnpm release`

## 5) First release flow

1. Create a changeset: `pnpm changeset`
2. Commit and push to `main`.
3. Release workflow opens/updates a version PR.
4. Merge that PR.
5. Workflow publishes package to npm using `NPM_TOKEN`.

## 6) Install command checks

After deploy + publish, verify all methods:

- npm:
  - `pnpm add @devstool/shadcn-echarts echarts react`
- direct URL:
  - `npx shadcn@latest add https://<your-production-domain>/r/bar-chart.json`
- namespace (`components.json`):
  - `"@devstool": "https://<your-production-domain>/r/{name}.json"`
  - `npx shadcn@latest add @devstool/bar-chart`

## 7) Important security note

If any npm token was ever pasted into a file, issue, chat, or commit, revoke it immediately in npm and create a new token before release.
