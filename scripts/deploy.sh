#!/usr/bin/env bash
set -e

if [ -f .env ]; then
  source .env
fi

if [[ -z "${SSH_HOST}" || -z "${SSH_PATH}" || -z "${SSH_SCRIPT}" || -z "${SSH_USER}" ]]; then
  echo "Required env variables not set"
  exit 1
fi

DIST_DIR=dist

scp -r "${DIST_DIR}" "${SSH_USER}@${SSH_HOST}:${SSH_PATH}"
ssh "${SSH_USER}@${SSH_HOST}" "${SSH_SCRIPT}"
