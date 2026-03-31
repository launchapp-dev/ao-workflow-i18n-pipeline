# i18n Pipeline

Automated internationalization pipeline — scan source code for hardcoded strings, generate translation keys, validate locale files, and produce coverage dashboards.

## What It Does

- **Daily**: Scans your codebase for hardcoded user-facing strings, generates i18n key suggestions, and updates the English base locale
- **Weekly**: Validates all locale files for completeness, flags missing keys by criticality, produces a coverage dashboard
- **On demand**: Pre-release readiness check with go/no-go/conditional verdict

## Quick Start

```bash
# 1. Clone and navigate to this example
git clone https://github.com/launchapp-dev/ao-example-i18n-pipeline
cd ao-example-i18n-pipeline

# 2. Start the AO daemon
ao daemon start --autonomous

# 3. Run the daily string scan
ao workflow run daily-scan

# 4. Run the weekly locale audit
ao workflow run weekly-audit

# 5. Check release readiness before shipping
ao workflow run release-check

# 6. Watch live logs
ao daemon stream --pretty
```

## No API Keys Required

This pipeline uses only local tools:
- Filesystem MCP (read/write local files)
- Git MCP (detect new strings since last commit)
- Sequential-thinking MCP (structured reasoning for key naming)

No external services or API keys needed.

## Agents

| Agent | Model | Role |
|---|---|---|
| **string-scanner** | claude-haiku-4-5 | Fast grep-based scan for hardcoded strings |
| **key-generator** | claude-sonnet-4-6 | Generates semantic i18n keys with translator context |
| **locale-validator** | claude-sonnet-4-6 | Validates all locale files, classifies missing keys by criticality |
| **coverage-reporter** | claude-sonnet-4-6 | Produces dashboards and release readiness assessments |

## Workflows

| Workflow | Schedule | Description |
|---|---|---|
| `daily-scan` | Daily 9 AM UTC | Scan source code for new hardcoded strings |
| `weekly-audit` | Mondays 8 AM UTC | Full locale validation and coverage dashboard |
| `release-check` | On demand | Pre-release go/no-go gate |

## AO Features Demonstrated

- **Scheduled workflows** — daily string detection + weekly coverage audits
- **Multi-agent pipeline** — scanner → key generator → validator → reporter
- **Command phases** — bash scripts for setup and locale key counting
- **Decision contracts** — locale-validator emits `complete|partial|blocking`; release-check emits `go|no-go|conditional`
- **Phase routing** — validator verdict routes to appropriate next phase
- **Output contracts** — structured JSON reports and markdown dashboards

## Project Structure

```
i18n-pipeline/
├── .ao/workflows/          # AO workflow configuration
│   ├── agents.yaml         # string-scanner, key-generator, locale-validator, coverage-reporter
│   ├── phases.yaml         # scan-source-code, extract-new-strings, validate-all-locales, ...
│   ├── workflows.yaml      # daily-scan, weekly-audit, release-check
│   ├── mcp-servers.yaml    # filesystem, git, sequential-thinking
│   └── schedules.yaml      # Daily and weekly schedules
├── config/
│   ├── scan-config.yaml    # Source dirs, extensions, thresholds, locales
│   └── key-config.yaml     # Namespace rules, key style
├── locales/
│   ├── en/translation.json # Canonical English source (source of truth)
│   ├── es/translation.json # Spanish
│   ├── fr/translation.json # French
│   └── de/translation.json # German
├── sample-source/          # Example source files with hardcoded strings to scan
│   ├── auth/LoginForm.tsx
│   ├── dashboard/StatsPanel.tsx
│   └── checkout/OrderSummary.tsx
├── scripts/
│   ├── scan-source.sh      # Pre-scan setup
│   └── collect-locale-stats.sh  # Locale key counting
├── data/                   # Runtime output (gitignored)
└── output/                 # Reports and dashboards
    ├── dashboard.md        # Live coverage summary (updated every run)
    ├── coverage/           # Weekly audit reports
    └── release-check/      # Release readiness assessments
```

## Configuring for Your Project

Edit `config/scan-config.yaml`:

```yaml
source_dirs:
  - src           # Point to your source directory

file_extensions:
  - .tsx
  - .ts
  - .jsx
  - .js

supported_locales:
  - es
  - fr
  - de
  - ja           # Add more locales

release_threshold: 95    # % required for release
minimum_threshold: 80    # Hard NO-GO below this
```

Edit `config/key-config.yaml` to map your directory structure to namespaces:

```yaml
namespace_rules:
  - pattern: "src/components/auth/"
    namespace: auth
  - pattern: "src/features/checkout/"
    namespace: checkout
  - default: common
```
