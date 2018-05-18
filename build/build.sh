#!/bin/sh

echo "-- build backend (y/n):"
read buildBackend
if [ "$buildBackend" = "y" ]; then
  cd ../src/backend
  GOOS=linux GOARCH=amd64 go build -o "../../build/bin/service"
  cd ../../build
fi


echo "-- build frontend (y/n):"
read buildFrontend
if [ "$buildFrontend" = "y" ]; then
cd ../src/frontend
docker run --rm -v "$(pwd):/app"  -v "$(pwd)/../../build/public:/tmp/public" -e "COMMAND=npm run build" dkfbasel/hot-reload-webpack:6.2.0
cd ../../build
echo "-- build finished"
fi

echo "-- build docker container (y/n):"
read buildContainer
if [ "$buildContainer" = "y" ]; then
  echo "specify container tag (dev):"
  read tag
  if [ "$tag" = "" ]; then
    tag="dev"
  fi
  docker build -t dkfbasel/testing:$tag --no-cache .

  echo "-- push docker container (y/n)"
  read pushContainer
  if [ "$pushContainer" = "y" ]; then
    docker push dkfbasel/testing:$tag
  fi

fi
