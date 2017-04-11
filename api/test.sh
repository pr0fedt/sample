#!/bin/bash
set -e
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
MOCHA=$CWD/../tools/node_modules/.bin/mocha
$CWD/compile.sh
$MOCHA $CWD/build/**/__tests__/**/*.js
