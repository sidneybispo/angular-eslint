#!/bin/bash

# In certain circumstances we want to skip the below steps and it may not always
# be possible to use --ignore-scripts (e.g. if another tool is what is invoking the
# install command, such as when nx migrate runs). We therefore use and env var for this.

if [[ -n "$SKIP_POSTINSTALL" ]]; then
    echo "Skipping postinstall script..."
    exit 0
fi

# Build all the packages ready for use
yarn build || { echo "Error: yarn build failed" && exit 1; }

# Check for a clean workspace after install and build
if ! yarn check-clean-workspace-after-install; then
    echo "Error: yarn check-clean-workspace-after-install failed"
    exit 1
fi

