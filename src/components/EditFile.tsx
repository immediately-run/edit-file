// The edit-file task callee (UI_AS_APPS_SPEC §5.7/§8.7). Reads the delegated file
// path from `useTaskInput()` (the host rewrote the caller's `capFile` to a concrete
// `/task/<slot>/file/<name>` chroot path), lets the user edit it, and writes it back
// — then `completeTask({ saved })`. A `ro` delegation makes the save throw `EROFS`
// (the host-enforced read-only wall), which this surfaces. The host always owns
// dismiss (T28), so Escape/close work even if this never calls `cancelTask`.
import { useEffect, useState } from "react";
import { useTaskInput, completeTask, cancelTask } from "@immediately-run/sdk";
import { readFile, writeFile } from "../fs";
import "./EditFile.css";

const basename = (p: string): string => p.split("/").filter(Boolean).pop() ?? p;

export default function EditFile() {
  const input = useTaskInput();
  const path = typeof input?.params.file === "string" ? input.params.file : null;

  const [content, setContent] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!path) return;
    let live = true;
    readFile(path)
      .then((c) => live && setContent(c))
      .catch(() => {
        // A new/unreadable file → start empty; the save still proves write access.
        if (live) {
          setContent("");
          setNote("New or unreadable file — starting empty.");
        }
      });
    return () => {
      live = false;
    };
  }, [path]);

  const save = async () => {
    if (path == null || content == null) return;
    setSaving(true);
    setNote(null);
    try {
      await writeFile(path, content);
      completeTask({ saved: true });
    } catch (e) {
      // The host `ro`-attenuated the delegation → EROFS, never a silent failure.
      setNote(`Couldn't save: ${(e as Error)?.message ?? "read-only"}.`);
      setSaving(false);
    }
  };

  if (!path) {
    return (
      <div className="ef ef--empty">
        Open this by invoking the <code>edit-file</code> task with a file capability.
      </div>
    );
  }

  return (
    <div className="ef">
      <header className="ef-hd">
        <span className="ef-title">Editing</span>
        <code className="ef-path" title={path}>
          {basename(path)}
        </code>
      </header>
      <textarea
        className="ef-area"
        value={content ?? ""}
        spellCheck={false}
        disabled={content === null}
        onChange={(e) => setContent(e.target.value)}
        aria-label={`Contents of ${basename(path)}`}
        placeholder={content === null ? "Loading…" : ""}
      />
      {note && <p className="ef-note">{note}</p>}
      <footer className="ef-foot">
        <button type="button" className="ef-btn" onClick={() => cancelTask()}>
          Cancel
        </button>
        <button
          type="button"
          className="ef-btn ef-save"
          disabled={saving || content === null}
          onClick={save}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </footer>
    </div>
  );
}
