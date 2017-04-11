#!/bin/bash
set -e
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd $CWD/tools && npm i
cd $CWD/api && npm i
cd $CWD/client && npm i
