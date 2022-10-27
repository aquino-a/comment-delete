#!/bin/bash
npm install
npm run-script build-prod

source ./set-secrets.sh

microcontainer=$(buildah from registry.access.redhat.com/ubi8/nodejs-14-minimal:latest)
micromount=$(buildah mount $microcontainer)

buildah copy $microcontainer './dist/comment-delete' '/home/comment-delete' 
buildah copy $microcontainer './server/server.js' '/home/comment-delete/server.js' 
buildah copy $microcontainer './server/package.json' '/home/comment-delete/package.json' 

npm install --prefix $micromount/home/comment-delete

buildah config --env CD_ID=$CD_ID $microcontainer
buildah config --env CD_SECRET=$CD_SECRET $microcontainer
buildah config --env CD_PORT=$CD_PORT $microcontainer
buildah config --env CD_ORIGIN=$CD_ORIGIN $microcontainer
buildah config --env CD_REDIRECT=$CD_REDIRECT $microcontainer

buildah config --cmd "node /home/comment-delete/server.js --clientId=$CD_ID --clientSecret=$CD_SECRET --port=$CD_PORT --origin=$CD_ORIGIN  --redirect=$CD_REDIRECT --app-folder=/home/comment-delete" $microcontainer

rm -rf $micromount/var/cache $micromount/var/log/*

buildah umount $microcontainer
buildah rmi comment-delete
buildah commit $microcontainer comment-delete
buildah delete $microcontainer


