#!/bin/bash
set -e
echo "Installing dependencies..."
npm install --prefix back
npm install --prefix front
echo "Building front-end..."
npm run build --prefix front
echo "Build complete!"
