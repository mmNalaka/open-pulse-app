#!/bin/bash

# Script to rename all occurrences of 'bun-hono-react-saas-starter' to a new name
# Usage: ./rename-project.sh <new-name>

set -e

# Check if new name is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide a new name for the project"
    echo "Usage: $0 <new-name>"
    echo "Example: $0 my-awesome-project"
    exit 1
fi

NEW_NAME="$1"
OLD_NAME="bun-hono-react-saas-starter"

echo "Renaming project from '$OLD_NAME' to '$NEW_NAME'..."

# Function to replace text in a file
replace_in_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "  Updating $file..."
        # Use sed to replace all occurrences of OLD_NAME with NEW_NAME
        sed -i.bak "s/$OLD_NAME/$NEW_NAME/g" "$file"
        echo "  ✓ Updated $file"
    else
        echo "  Warning: $file not found, skipping..."
    fi
}

# Replace in main project files
echo "Updating project files..."
replace_in_file "package.json"
replace_in_file "README.md"
replace_in_file "docker-compose.yml"

# Also check for any other files that might contain the old name
echo "Searching for additional files with old name..."
# Find all files that contain the old name (excluding .git directory and common ignore patterns)
find . -type f -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" | \
    grep -v node_modules | \
    grep -v .git | \
    grep -v dist | \
    grep -v build | \
    grep -v coverage | \
    while read -r file; do
        if grep -q "$OLD_NAME" "$file" 2>/dev/null; then
            echo "  Found '$OLD_NAME' in $file"
            replace_in_file "$file"
        fi
done

# Special handling for package.json homepage URL
if [ -f "package.json" ]; then
    echo "Updating homepage URL in package.json..."
    # Extract current homepage and replace the repo name
    current_homepage=$(grep -o '"homepage": "[^"]*"' package.json | grep -o 'https://[^"]*')
    if [ ! -z "$current_homepage" ]; then
        new_homepage=$(echo "$current_homepage" | sed "s/$OLD_NAME/$NEW_NAME/g")
        sed -i.bak "s|$current_homepage|$new_homepage|g" package.json
        echo "  ✓ Updated homepage URL"
    fi
fi

# Update README.md title if it exists
if [ -f "README.md" ]; then
    echo "Updating README.md title..."
    # Update the main title (first line if it starts with #)
    if head -n 1 README.md | grep -q "^# $OLD_NAME$"; then
        sed -i.bak "1s/^# $OLD_NAME$/# $NEW_NAME/" README.md
        echo "  ✓ Updated README title"
    fi
fi

echo ""
echo "✅ Project renaming completed!"
echo ""
echo "⚠️  Important notes:"
echo "  • Backup files (.bak) have been created for all modified files"
echo "  • If you want to rename the directory itself, you'll need to do that manually:"
echo "    mv $OLD_NAME $NEW_NAME"
echo "  • Review the changes and remove .bak files if everything looks good"
echo "  • Update any git remote URLs if needed"
echo ""
echo "Files that were updated:"
find . -name "*.bak" -type f | sed 's/\.bak$//' | sort

echo ""
echo "Next steps:"
echo "1. Review the changes in the modified files"
echo "2. Remove backup files: find . -name '*.bak' -delete"
echo "3. If renaming directory: mv $OLD_NAME $NEW_NAME"
echo "4. Update git remote if needed: git remote set-url origin <new-url>"
