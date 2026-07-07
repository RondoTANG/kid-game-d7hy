#!/bin/bash
set -e
unset GITHUB_TOKEN

cd /Users/RondoT/Downloads/app_179m3p95vt8

echo "Building the project..."
npm run build

echo "Initializing git..."
if [ ! -d .git ]; then
    git init
    git branch -M main
fi

git add .
if ! git diff-index --quiet HEAD -- 2>/dev/null || ! git rev-parse HEAD >/dev/null 2>&1; then
    git commit -m "feat: complete dynamic question generation and prepare for deploy"
fi

# Generate repo name
DIR_NAME=$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
RAND_STR=$(LC_ALL=C tr -dc a-z0-9 </dev/urandom | head -c 4)
REPO_NAME="kid-game-${RAND_STR}"

echo "Creating GitHub repository: $REPO_NAME..."
if ! git remote -v | grep -q "^origin"; then
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
    # If origin already exists, just push
    git push -u origin main
    # Extract repo name from origin url
    REPO_NAME=$(git remote get-url origin | sed -e 's/.*github.com[:/]\(.*\)\.git/\1/' | cut -d'/' -f2)
fi

echo "Preparing standard flat dist structure..."
rm -rf deploy_dist
mkdir deploy_dist
cp -r dist/output/* deploy_dist/
cp -r dist/output_resource/* deploy_dist/
if [ -d "dist/output_static" ]; then
    cp -r dist/output_static/* deploy_dist/ || true
fi

echo "Replacing template variables in index.html..."
sed -i '' 's/{{appName}}/幼升小趣味闯关/g' deploy_dist/index.html
sed -i '' 's/{{appDescription}}/幼升小趣味答题闯关游戏/g' deploy_dist/index.html
sed -i '' 's|{{appAvatar}}|data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌈</text></svg>|g' deploy_dist/index.html

echo "Deploying to gh-pages branch..."
npx gh-pages -d deploy_dist

echo "Activating GitHub Pages..."
OWNER=$(gh api user -q ".login")

gh api -X POST /repos/$OWNER/$REPO_NAME/pages \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/" > /dev/null 2>&1 || echo "Note: Pages API configuration returned a warning (likely already active)."

USERNAME=$(echo "$OWNER" | tr '[:upper:]' '[:lower:]')

echo "================================================="
echo "✅ Deployment pipeline finished!"
echo "Your live URL will be ready in ± 2 minutes at:"
echo "https://${USERNAME}.github.io/${REPO_NAME}/"
echo "================================================="
