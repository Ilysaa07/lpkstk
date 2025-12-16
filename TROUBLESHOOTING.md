# Troubleshooting: Module Not Found Error

## Issue
```
Module not found: Can't resolve '@/lib/supabase/client'
```

## Root Cause
The `tsconfig.json` was missing the `paths` configuration that maps the `@/*` alias to `./src/*`. While `jsconfig.json` had this configuration, TypeScript files (`.ts`, `.tsx`) use `tsconfig.json` for module resolution.

## Solution
Added the following to `tsconfig.json`:

```json
{
  "compilerOptions": {
    ...
    "paths": {
      "@/*": ["./src/*"]
    },
    ...
  }
}
```

## Steps Taken
1. Verified that `src/lib/supabase/client.ts` exists
2. Checked `jsconfig.json` - paths were correctly configured
3. Checked `tsconfig.json` - paths configuration was missing
4. Added `paths` to `tsconfig.json`
5. Next.js dev server automatically reloaded with the fix

## Result
The `@/lib/supabase/client` import now resolves correctly for all TypeScript files.

## Prevention
When using path aliases in a TypeScript Next.js project:
- Always configure `paths` in `tsconfig.json`
- The `jsconfig.json` is only used for JavaScript files
- Next.js will automatically apply these path mappings

---

**Status**: ✅ RESOLVED
**Date**: 2025-12-16
