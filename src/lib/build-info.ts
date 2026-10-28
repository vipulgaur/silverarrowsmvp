declare const __APP_BUILD_HASH__: string | undefined;

/**
 * Current Git commit short SHA automatically resolved at build/dev time
 * from .git/HEAD / .git/refs or Cloud Build environment variables.
 */
export const APP_BUILD_HASH: string =
  typeof __APP_BUILD_HASH__ !== "undefined" && __APP_BUILD_HASH__
    ? __APP_BUILD_HASH__
    : "ad58e63";
