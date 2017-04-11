#!/bin/bash
set -e
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
BUILD_DIR=$CWD/build
SRC_DIR=$CWD/src
BABEL=$CWD/../tools/node_modules/.bin/babel
FLOW=$CWD/../tools/node_modules/.bin/flow

if [ -d "$BUILD_DIR" ]; then
  rm -rf $BUILD_DIR
fi

cd $SRC_DIR && $FLOW check --no-flowlib
$BABEL $SRC_DIR --out-dir $BUILD_DIR --copy-files
