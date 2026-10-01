# FINDINGS — edit-file

Recorded by the 2026-06 code-verification pass (R3-124; plan `08-system-apps.md`).
**Record / verify only.** Gates green (`npm run build` + `npm run lint`).

## Spec-refs (Phase 1 — verified current)

`provides: edit-file@1.0`. Citations resolve correctly:
- `EditFile.tsx:1` → `UI_AS_APPS_SPEC §5.7` (Task invocation) / `§8.7`
  (Permissions as file access — scoped mounts). **Both § exist and match** (§5.7
  "Task invocation", §8.7 "Permissions as file access (scoped mounts)").
- `App.tsx:2,6` → `§5.7/§8.7`; `fs.ts:12` → `§8.7` (a `ro` delegation makes
  `writeFile` throw `EROFS` host-side). Re-verified 2026-10-01 (the fs.ts header
  rewrite moved the citation off line 5). Current.

The app receives a chrooted single-file cap (`/task/<slot>/file/<name>`) and uses
`useTaskInput`/`completeTask`/`cancelTask` — the Done-spec ↔ code mapping checks
out. Mapping is trivial enough to live in inline comments; no separate
CODE_SPEC_REFERENCES.md needed.

## SDK-version skew (resolved 2026-10-01)

~~Pins `@immediately-run/sdk` at **`0.2.8`** … Coordinated bump owed; do not bump here.~~
Resolved by the R3-447 fix (#10): the pin is **`0.75.0`** (exact, per the fleet's
post-2026-08 convention that each app pins its own current SDK — ways_of_working §6;
the June "coordinated bump" concern is obsolete: the listed tiers `0.2.8`/`0.8.1`/
`0.11.0`/`^0.12.0` predate it, and the entry was already stale at `^0.13.0`). The bump
was FORCED, not discretionary: `^0.13.0` predates the SDK's `/fs` subpath the fs
accessor now delegates to.

## Vocabulary (Phase 2)

No `kernel` / `principal`-as-grantee in `src/`. `main.tsx` carries no app
logic/CSS. Conformant.
