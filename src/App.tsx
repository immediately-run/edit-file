// Root component — immediately.run renders the default export of THIS file.
// The Phase-09 FILE-DELEGATION task app (§5.7/§8.7): the caller delegates a file
// (`capFile`); the host mints an attenuated, task-scoped chroot and hands this app
// the path. It reads/edits/saves that ONE file and returns `{ saved }` — it holds
// no standing authority; the chroot IS its grant (data crosses, ambient authority
// does not, §5.7).
import "./index.css";
import "./App.css";
import EditFile from "./components/EditFile";

function App() {
  return <EditFile />;
}

export default App;
