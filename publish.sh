#!/bin/bash

echo $SHELL

PACKAGE_VERSION=`cat package.json|grep version|head -1|cut -d \" -f 4`

echo $PACKAGE_VERSION

if [[ $PACKAGE_VERSION =~ "alpha" ]]
then
    echo "alpha"
    npm publish --tag alpha
elif [[ $PACKAGE_VERSION =~ "beta" ]]
then
    echo "beta"
    npm publish --tag beta
else
    echo "latest"
    npm publish 
fi
