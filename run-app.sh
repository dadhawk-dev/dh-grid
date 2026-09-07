#!/usr/bin/env bash
set -e

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================================"
echo "🚀 Building & Launching Dadhawk DhGrid Showcase Application"
echo "============================================================"

# Free port 8085 if it is already in use by a previous instance
PID_8085=$(lsof -t -i:8085 2>/dev/null || fuser 8085/tcp 2>/dev/null | tr -d ' ' || true)
if [ -n "$PID_8085" ]; then
    echo "⚠️ Port 8085 is currently in use by process $PID_8085. Freeing port 8085..."
    kill -9 $PID_8085 2>/dev/null || true
    sleep 1
fi

echo ""
echo "📦 Step 1: Building and installing dhgrid-component library..."
mvn clean install

echo ""
echo "📦 Step 2: Installing compiled JAR into local Maven repository (~/.m2)..."
mvn install:install-file \
  -Dfile=target/dhgrid-component-1.0.0-RC2.jar \
  -DgroupId=com.dadhawk.faces \
  -DartifactId=dhgrid-component \
  -Dversion=1.0.0-RC2 \
  -Dpackaging=jar

echo ""
echo "📂 Step 3: Copying downloadable JAR to webapp demo..."
mkdir -p demo/src/main/webapp/downloads
cp target/dhgrid-component-1.0.0-RC2.jar demo/src/main/webapp/downloads/dhgrid-component-1.0.0-RC2.jar

echo ""
echo "🛠️ Step 4: Compiling dhgrid-demo Web Application..."
cd "$SCRIPT_DIR/demo"
mvn clean compile

echo ""
echo "============================================================"
echo "✨ Dadhawk DhGrid App is Ready!"
echo "🌐 Server URLs once started:"
echo "   - Jakarta Faces 4.0 Demo : http://localhost:8085/index.xhtml"
echo "   - Standalone Web Showcase: http://localhost:8085/standalone-demo.html"
echo "   - Web Component Script   : http://localhost:8085/resources/dadhawk/js/dh-grid.js"
echo "   - Downloadable JAR       : http://localhost:8085/downloads/dhgrid-component-1.0.0-RC2.jar"
echo "============================================================"
echo ""

echo "▶️ Launching Jetty Web Server (Port 8085)..."
mvn jetty:run
