#!/usr/bin/env bash
# scan-source.sh — pre-scan setup: ensures data directories exist and records scan start time

set -euo pipefail

TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
echo "Starting string scan at $TIMESTAMP"

# Ensure output directories exist
mkdir -p data/scans data/keys data/reports output/coverage output/release-check

# Write a simple scan-manifest so the agent knows what to process
cat > data/scans/scan-manifest-${TIMESTAMP}.json <<EOF
{
  "scan_initiated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "source_dirs": ["sample-source"],
  "extensions": [".tsx", ".ts", ".jsx", ".js", ".py"]
}
EOF

echo "Scan manifest written to data/scans/scan-manifest-${TIMESTAMP}.json"
echo "Ready for string-scanner agent"
