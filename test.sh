#!/bin/bash
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd $CWD

$CWD/api/test.sh
