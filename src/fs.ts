// Read/write a file from the sandbox filesystem. The host mounts the delegated,
// task-scoped chroot into this iframe; app code reaches it the same way the SDK
// reaches the other bundler services — through `module.evaluation.module.bundler.fs`
// (a node-compatible ZenFS). Outside the delegated path is unnameable (the chroot),
// and a `ro` delegation makes `writeFile` throw `EROFS` host-side (§8.7).
/* eslint-disable @typescript-eslint/no-explicit-any */

function sandboxFs(): any | null {
  try {
    // @ts-expect-error - `module` is injected by the sandbox runtime
    return module?.evaluation?.module?.bundler?.fs ?? null;
  } catch {
    return null;
  }
}

export function fsAvailable(): boolean {
  return sandboxFs() != null;
}

export async function readFile(path: string): Promise<string> {
  const fs = sandboxFs();
  if (!fs) throw new Error("sandbox filesystem unavailable");
  const p = fs.promises ?? fs;
  const data = await p.readFile(path, "utf-8");
  return typeof data === "string" ? data : new TextDecoder().decode(data);
}

export async function writeFile(path: string, content: string): Promise<void> {
  const fs = sandboxFs();
  if (!fs) throw new Error("sandbox filesystem unavailable");
  const p = fs.promises ?? fs;
  await p.writeFile(path, content);
}
