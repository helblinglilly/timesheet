#!/bin/bash

# Path to the pre-push hook file
PRE_PUSH_HOOK=".git/hooks/pre-push"

# Ensure the hooks directory exists
if [ ! -d ".git/hooks" ]; then
    echo "This script must be run from the root of a Git repository."
    exit 1
fi

# Create the pre-push hook file if it doesn't exist
if [ ! -f "$PRE_PUSH_HOOK" ]; then
    echo "Creating pre-push hook file..."
    echo "#!/bin/bash" > "$PRE_PUSH_HOOK"
    chmod +x "$PRE_PUSH_HOOK"
fi

# Function to check if a step is already present in the hook file
step_already_added() {
    grep -qF "$1" "$PRE_PUSH_HOOK"
}

# Step 1: Add build step
echo "Would you like to add a build check to the pre-push hook? (y/n)"
read -r ADD_BUILD_STEP
if [[ "$ADD_BUILD_STEP" =~ ^[Yy]$ ]]; then
    BUILD_COMMAND="npm run build"

    if step_already_added "Build failed! Aborting push."; then
        echo "Build step is already present in the pre-push hook."
    else
        echo "Adding build step to the pre-push hook..."
        cat <<EOL >> "$PRE_PUSH_HOOK"

# Step: Build the application
echo "Running pre-push hook: Building the application..."
if ! $BUILD_COMMAND; then
    echo "Build failed! Aborting push."
    exit 1
fi
echo "Build succeeded!"
EOL
    fi
fi

# # Step 2: Add file validation step
# echo "Would you like to add validation that a runtime has been specified for new 'page.tsx' files? (y/n)"
# read -r ADD_FILE_CHECK
# if [[ "$ADD_FILE_CHECK" =~ ^[Yy]$ ]]; then
#     if step_already_added "The following files are missing the required line"; then
#         echo "File validation step is already present in the pre-push hook."
#     else
#         echo "Adding runtime validation for 'page.tsx' step to the pre-push hook..."
#         cat <<'EOL' >> "$PRE_PUSH_HOOK"

# echo "Checking 'page.tsx' files in /src/app..."
# MISSING_RUNTIME_FILES=()
# FILES_TO_CHECK=$(git diff --cached --name-only | grep -E '^src/app/.*/page\.tsx$')

# for FILE in $FILES_TO_CHECK; do
#     if ! grep -q 'export const runtime = "edge";' "$FILE"; then
#         MISSING_RUNTIME_FILES+=("$FILE")
#     fi
# done

# if [ ${#MISSING_RUNTIME_FILES[@]} -ne 0 ]; then
#     echo "The following files do not specify a runtime. This will cause the build to fail on cloudflare 'export const runtime = \"edge\"':"
#     for FILE in "${MISSING_RUNTIME_FILES[@]}"; do
#         echo " - $FILE"
#     done
#     echo "Please specify the runtime in the page.tsx files before pushing."
#     exit 1
# fi
# echo "Runtime specified in all new files!"
# EOL
#     fi
# fi

echo "Setup complete. Your pre-push hook has been updated."
