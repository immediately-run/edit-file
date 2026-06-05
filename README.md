# edit-file

The Phase-09 **file-delegation** task app for [immediately.run](https://immediately.run)
(UI_AS_APPS_SPEC §5.7 / §8.7). It `provides` the `edit-file` contract: a caller
delegates a file with `capFile({ mountId, relPath }, { mode })`, the host mints an
**attenuated, task-scoped chroot** for it, and this app reads/edits/saves **only**
that file at the host-given path — returning `{ saved }`.

It holds **no standing authority** — the chroot *is* its grant (data + a bounded
file capability cross; ambient authority does not, §5.7). A `ro` delegation makes
the save fail with `EROFS` (the host-enforced read-only wall), surfaced in the UI;
outside the delegated path is unnameable.

```jsonc
// package.json
"immediately.run": { "provides": [{ "task": "edit-file", "version": "1.0" }] }
```
