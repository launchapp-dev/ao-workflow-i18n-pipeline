# i18n Pipeline — Project Context

## What This Project Does

This is an automated internationalization (i18n) pipeline. It scans source code for hardcoded
strings that should be translated, generates structured translation keys, validates locale files
for completeness, and produces coverage dashboards and release readiness assessments.

## Key Data Flows

1. **scan-source.sh** prepares scan manifests. The **string-scanner** agent then scans
   source files in `sample-source/` for hardcoded user-facing strings not wrapped in
   `t()` / `i18n()` translation calls. Results go to `data/scans/{timestamp}.json`.

2. **key-generator** agent reads scan results, assigns namespaces based on file paths,
   generates semantic key names (e.g., `auth.login.title`), and updates
   `locales/en/translation.json` with new keys.

3. **collect-locale-stats.sh** counts keys per locale. The **locale-validator** agent
   then loads all locale JSON files from `locales/*/translation.json`, compares against
   the canonical English file, and classifies missing keys by criticality. Results go to
   `data/reports/validation-{timestamp}.json`.

4. **coverage-reporter** agent reads validation reports and produces:
   - `output/coverage/{date}.md` — full weekly audit report
   - `output/dashboard.md` — always-current live summary
   - `output/release-check/{date}.md` — pre-release readiness assessment

## Locale File Structure

All locale files are JSON with nested keys organized by namespace:
```json
{
  "auth": { "login": { "title": "Sign in..." } },
  "checkout": { "place_order": "Place order" },
  "common": { "buttons": { "save": "Save" } }
}
```

The canonical source of truth is `locales/en/translation.json`. All other locales
are validated against it.

## Adding a New Locale

1. Create `locales/{locale}/translation.json` (can be empty `{}` to start)
2. Add the locale code to `config/scan-config.yaml` under `supported_locales`
3. Run `ao workflow run weekly-audit` to get a full missing-keys report

## Adding New Source Directories to Scan

Edit `config/scan-config.yaml`:
- Add the path to `source_dirs`
- Add namespace mapping to `config/key-config.yaml` under `namespace_rules`

## Release Readiness

Run `ao workflow run release-check` before any release. It emits:
- **go**: all locales ≥ 95% coverage, zero blocking keys
- **conditional**: locales ≥ 80% but some below 95%, no blockers
- **no-go**: any locale < 80% OR any key missing from auth/checkout/errors namespaces

## Schedules

- **Daily at 9 AM UTC**: `daily-scan` — detects new hardcoded strings added since last commit
- **Mondays at 8 AM UTC**: `weekly-audit` — full locale validation and coverage dashboard

## Sample Source Files

`sample-source/` contains intentionally mixed files (some strings translated, some hardcoded)
that demonstrate what the scanner finds:
- `auth/LoginForm.tsx` — auth flow with several hardcoded strings
- `dashboard/StatsPanel.tsx` — dashboard component with untranslated labels
- `checkout/OrderSummary.tsx` — critical checkout flow with hardcoded strings
