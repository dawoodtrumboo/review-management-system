#! /usr/bin/env bash

declare -r app_name="package-demo"
declare -r version="1.0"

set -e

echo "Setting NODE_ENV to production"
export NODE_ENV=production
echo "NODE_ENV set to $NODE_ENV"

echo "Running npm build"
npm run build
echo "npm build completed successfully"

echo "Zipping files"
zip -r app.zip .next scripts public styles *.json *.js
echo "Zip completed successfully"

echo "Script execution completed"
