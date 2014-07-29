
Site is built with the following pre-commit hook.

``` sh
BROCCOLI_TACO_ENV=production broccoli-taco build dist
cp -rf ./dist/* ./
git add .
```
