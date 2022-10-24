#!/bin/bash
npm install
npm run-script build

source set-secrets.sh

microcontainer=$(buildah from docker.io/redhat/ubi8-micro:latest)
micromount=$(buildah mount $microcontainer)
dnf --installroot $micromount \
	--setopt=reposdir=/etc/yum.repos.d \
	install \
	node \
	-y
dnf --installroot $micromount clean all
buildah copy $microcontainer './dist/comment-delete' '/home/comment-delete' 
buildah copy $microcontainer './server/server.js' '/home/comment-delete/server.js' 
buildah copy $microcontainer './server/run.sh' '/home/comment-delete/run.sh'

buildah config --env CD_ID=$CD_ID $microcontainer
buildah config --env CD_SECRET=$CD_SECRET $microcontainer
buildah config --env CD_PORT=$CD_PORT $microcontainer
buildah config --env CD_ORIGIN=$CD_ORIGIN $microcontainer
buildah config --env CD_REDIRECT=$CD_REDIRECT $microcontainer

buildah config --cmd /home/comment-delete/run.sh $microcontainer

rm -rf $micromount/var/cache $micromount/var/log/*

buildah umount $microcontainer
buildah rmi comment-delete
buildah commit $microcontainer comment-delete
buildah delete $microcontainer


