#!/bin/bash

# ./docker-build.sh tag_image

tag_image=$1
if [ -z $1 ]; then
    echo "Chua nhap tham so, gia tri se de mac dinh tag:latest"
    tag_image=latest
fi

# build image
docker build -f docker/dockerfile -t image:"$tag_image" .