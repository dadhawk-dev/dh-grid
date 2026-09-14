#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================================"
echo "📦 Generating checksums for Maven Repository artifacts..."
echo "============================================================"

python3 -c "
import hashlib, os

repo_dir = 'docs/maven-repo'
for root, dirs, files in os.walk(repo_dir):
    for file in files:
        if file.endswith(('.jar', '.pom', '.xml')) and not file.startswith('.'):
            filepath = os.path.join(root, file)
            with open(filepath, 'rb') as f:
                content = f.read()
            
            md5 = hashlib.md5(content).hexdigest()
            sha1 = hashlib.sha1(content).hexdigest()
            sha256 = hashlib.sha256(content).hexdigest()
            sha512 = hashlib.sha512(content).hexdigest()

            with open(filepath + '.md5', 'w') as f:
                f.write(md5 + '\n')
            with open(filepath + '.sha1', 'w') as f:
                f.write(sha1 + '\n')
            with open(filepath + '.sha256', 'w') as f:
                f.write(sha256 + '\n')
            with open(filepath + '.sha512', 'w') as f:
                f.write(sha512 + '\n')
            print(f'✅ Checksums updated for: {filepath}')
"
echo "============================================================"
echo "✨ All Maven repository checksum files (.md5, .sha1, .sha256, .sha512) generated successfully!"
echo "============================================================"
