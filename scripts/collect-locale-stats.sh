#!/usr/bin/env bash
# collect-locale-stats.sh — count keys in each locale file for quick stats

set -euo pipefail

TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
echo "Collecting locale stats at $TIMESTAMP"

mkdir -p data/reports

EN_KEYS=$(python3 -c "
import json, sys
def flatten(d, prefix=''):
    keys = []
    for k, v in d.items():
        full_key = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            keys.extend(flatten(v, full_key))
        else:
            keys.append(full_key)
    return keys

with open('locales/en/translation.json') as f:
    data = json.load(f)
keys = flatten(data)
print(len(keys))
")

echo "English base locale: $EN_KEYS keys"

# Write stats manifest
cat > data/reports/locale-stats-${TIMESTAMP}.json <<EOF
{
  "collected_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "base_locale": "en",
  "base_key_count": $EN_KEYS,
  "locales_to_validate": ["es", "fr", "de"]
}
EOF

echo "Locale stats written to data/reports/locale-stats-${TIMESTAMP}.json"
echo "Ready for locale-validator agent"
