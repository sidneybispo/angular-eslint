if ! git diff --quiet --exit-code packages/integration-tests/fixtures; then
  echo "\n-------\n\nPRE-COMMIT ERROR: You are attempting to commit a diff in the integration-test fixtures, this is usually a sign that they have been run locally and not cleaned up.\n\n-> If you are sure your changes to the fixtures need to happen, you can run the commit command with --no-verify.\n\n-------\n"
  exit 1
fi
