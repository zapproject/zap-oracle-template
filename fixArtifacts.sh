#!/bin/bash
rm -r node_modules/@zapjs/artifacts/
cp -r artifacts node_modules/@zapjs/artifacts/
mdkdir node_modules/@zapjs/artifacts/lib
cp index.js node_modules/@zapjs/artifacts/lib