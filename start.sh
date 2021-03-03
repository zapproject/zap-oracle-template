#!/bin/bash
sleep 30
echo starting after delay
rm -r node_modules/@zapjs/artifacts/
cp -r artifacts node_modules/@zapjs/
npm run start