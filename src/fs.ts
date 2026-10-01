// Read/write a file from the sandbox filesystem. The host mounts the delegated,
// task-scoped chroot into this iframe; app code reaches it through the SDK's
// `sandboxFs()` (`@immediately-run/sdk/fs`) — the ONE home for the resolution
// order (`globalThis.__sandpackSharedFs` first). This module previously read
// `module.evaluation.module.bundler.fs` directly — the accessor the SDK's fs
// module names as the documented WRONG object (no `promises`/`stat` surface):
// every read threw before any RPC left the frame, and the UI fell back to
// "New or unreadable file — starting empty" on a healthy delegation (found live
// on the venue, R3-447/R3-643: a read of the same chroot path through
// `__sandpackSharedFs` returned the file's bytes).
// Outside the delegated path is unnameable (the chroot), and a `ro` delegation
// makes `writeFile` throw `EROFS` host-side (§8.7).
/* eslint-disable @typescript-eslint/no-explicit-any */

import { sandboxFs } from "@immediately-run/sdk/fs";

function fsHandle(): any | null {
  try {
    return sandboxFs();
  } catch {
    return null;
  }
}

export function fsAvailable(): boolean {
  return fsHandle() != null;
}

export async function readFile(path: string): Promise<string> {
  const fs = fsHandle();
  if (!fs) throw new Error("sandbox filesystem unavailable");
  const p = fs.promises ?? fs;
  const data = await p.readFile(path, "utf-8");
  return typeof data === "string" ? data : new TextDecoder().decode(data);
}

export async function writeFile(path: string, content: string): Promise<void> {
  const fs = fsHandle();
  if (!fs) throw new Error("sandbox filesystem unavailable");
  const p = fs.promises ?? fs;
  await p.writeFile(path, content);
}
