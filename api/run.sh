#!/bin/bash
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
$CWD/test.sh && node $CWD/build/index.js
