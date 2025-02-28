#!/usr/bin/env bash

set -e

: "${VERSION?Need to set VERSION}"
: "${BRANCH?Need to set BRANCH}"

: "${DOCKER_USERNAME?Need to set DOCKER_USERNAME}"
: "${DOCKER_PASSWORD?Need to set DOCKER_PASSWORD}"

REPO_NAME=skalenetwork/blockscout-frontend
IMAGE_NAME=$REPO_NAME:$VERSION

if [ "$BRANCH" = "stable" ]; then
  LATEST_IMAGE_NAME=$REPO_NAME:latest
else
  LATEST_IMAGE_NAME=$REPO_NAME:$BRANCH-latest
fi

# Build image

echo "Building $IMAGE_NAME..."
docker build -t $IMAGE_NAME . || exit $?
docker tag $IMAGE_NAME $LATEST_IMAGE_NAME

echo "========================================================================================="
echo "Built $IMAGE_NAME"

echo "$DOCKER_PASSWORD" | docker login --username $DOCKER_USERNAME --password-stdin

echo "Pushing $IMAGE_NAME..."
docker push $IMAGE_NAME || exit $?
docker push $LATEST_IMAGE_NAME || exit $?