#!/bin/bash
CDIR=$(cd $(dirname $0) && pwd)
BUILD_DIR=$CDIR/build
SRC_DIR=$CDIR/src
TMP_DIR=$CDIR/tmp
DEPLOY_TARGET=dev

print_usage_exit () {
  echo "usage: `basename $0`[-b] [-e <entry point js> ] [-t <dev|prod>] [-c|-d|-s]"
  echo -e "\t-b: exec browserify & gasify"
  echo -e "\t-e: entry point of browserify"
  echo -e "\t-t: deploy target"
  echo -e "\t-c: compare with server"
  echo -e "\t-d: also deploy to server"
  echo -e "\t-s: sync from server to local"
  echo -e "\t-h: print this message"
  exit 1
}

function dl_from_server() {
   local script_id=$(cat $CDIR/.clasp.json | grep scriptId | cut -d'"' -f 4)
   if [ -d "$TMP_DIR" ]; then
       rm -rf "$TMP_DIR"
   fi

   mkdir "$TMP_DIR"

   cd $TMP_DIR

   clasp clone $script_id

   cd $CDIR
}

ENTRY_POINT="$SRC_DIR"/main.js

while getopts be:dt:csh OPT
do
  case $OPT in
  b)
    BROWSERIFY_FLAG="1"
    ;;
  e)
    ENTRY_POINT="$OPTARG"
    ;;
  d)
    DEPLOY_FLAG="1"
    ;;
  t)
    DEPLOY_TARGET="$OPTARG"
    ;;
  c)
    COMPARE_FLAG="1"
    ;;
  s)
    SYNC_FLAG="1"
    ;;
  h)
    print_usage_exit
    ;;
  esac
done
shift $((OPTIND - 1))

if [ ! -d "$BUILD_DIR" ]; then
  mkdir -p "$BUILD_DIR"
fi

if [ "$DEPLOY_TARGET" != "dev" -a "$DEPLOY_TARGET" != "prod" ]; then
  print_usage_exit
fi

cp clasp_$DEPLOY_TARGET.json .clasp.json

if [ -d "$BUILD_DIR" ]; then
  rm -rf "$BUILD_DIR"/*
else
  mkdir -p "$BUILD_DIR"
fi

if [ "$BROWSERIFY_FLAG" == "1" ]; then
  browserify "$ENTRY_POINT" -p gasify -o $BUILD_DIR/Code.js
  cp -r "$SRC_DIR/appsscript.json" "$BUILD_DIR/"
else
  cp -r "$SRC_DIR/"* "$BUILD_DIR/"
fi

if [ "$DEPLOY_FLAG" == "1" ]; then
    clasp push
fi

if [ "$COMPARE_FLAG" == "1" ]; then
    dl_from_server
    diff "$BUILD_DIR/" "$TMP_DIR/"
fi

if [ "$SYNC_FLAG" == "1" ]; then
    echo "This operation overwrites local code. Will your realy continue?[y/N]"
    read line
    if [ "$line" = "y" -o "$line" = "Y" ]; then
        echo "syncing.."
        dl_from_server
        rsync -rltcv "$TMP_DIR/" "$SRC_DIR/"
    else
        echo "canceled!"
    fi
fi
