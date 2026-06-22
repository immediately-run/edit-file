# FINDINGS — edit-file

Recorded by the 2026-06 code-verification pass (R3-124; plan `08-system-apps.md`).
**Record / verify only.** Gates green (`npm run build` + `npm run lint`).

## Spec-refs (Phase 1 — verified current)

`provides: edit-file@1.0`. Citations resolve correctly:
- `EditFile.tsx:1` → `UI_AS_APPS_SPEC §5.7` (Task invocation) / `§8.7`
  (Permissions as file access — scoped mounts). **Both § exist and match** (§5.7
  "Task invocation", §8.7 "Permissions as file access (scoped mounts)").
- `App.tsx:2,6` → `§5.7/§8.7`; `fs.ts:5` → `§8.7` (a `ro` delegation makes
  `writeFile` throw `EROFS` host-side). Current.

The app receives a chrooted single-file cap (`/task/<slot>/file/<name>`) and uses
`useTaskInput`/`completeTask`/`cancelTask` — the Done-spec ↔ code mapping checks
out. Mapping is trivial enough to live in inline comments; no separate
CODE_SPEC_REFERENCES.md needed.

## SDK-version skew (record only)

Pins `@immediately-run/sdk` at **`0.2.8`** (oldest fleet tier: `0.2.8` / `0.8.1` /
`0.11.0` / `^0.12.0`). Coordinated bump owed; do not bump here.

## Vocabulary (Phase 2)

No `kernel` / `principal`-as-grantee in `src/`. `main.tsx` carries no app
logic/CSS. Conformant.
