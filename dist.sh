#!/bin/bash
set -e
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
$CWD/test.sh
DIST_DIR=$CWD/dist

if [ -d "$DIST_DIR" ]; then
  rm -rf $DIST_DIR
fi

mkdir $DIST_DIR
cp -r $CWD/api/build $DIST_DIR/api
cp $CWD/api/package.json $DIST_DIR/api/package.json
cp $CWD/docker/api.Dockerfile $DIST_DIR/api/Dockerfile
cd $DIST_DIR/api && docker build -t api .

mkdir $DIST_DIR/client
cp -r $CWD/client/public $DIST_DIR/client/public
cp -r $CWD/client/src $DIST_DIR/client/src
cp $CWD/client/package.json $DIST_DIR/client/package.json
cp $CWD/docker/client.Dockerfile $DIST_DIR/client/Dockerfile
cd $DIST_DIR/client && docker build -t client .
