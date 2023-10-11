PUBLISHED_LIBRARIES=("arrays" "datetime" "dstructs" "hof" "numbers" "objects" "stats" "strings")

# These libraries do not have a build step
UNPUBLISHED_LIBRARIES=("_template" "interop" "tooling")

ALL_LIBRARIES=(${PUBLISHED_LIBRARIES[@]} ${UNPUBLISHED_LIBRARIES[@]})
