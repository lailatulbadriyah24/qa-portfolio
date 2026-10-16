import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { REPO_URL } from "../lib/data";
import Inline from "./Inline";

export default function Bugs({ bugs }) {
  return (
    <div className="bugs">
      {bugs.map((b) => (
        <details key={b.id} className="bug">
          <summary>
            <span className="mono">{b.id}</span>
            <span className="bug-title"><Inline text={b.title} /></span>
            <span className={`bug-sev ${b.severity === "Major" ? "bad strong" : "warn"}`}>
              {b.severity} · {b.priority}
            </span>
          </summary>
          <div className="md">
            <Markdown remarkPlugins={[remarkGfm]}>{b.body}</Markdown>
            {b.file && (
              <p>
                <a href={`${REPO_URL}/blob/main/1-test-scenario/bug-reports/${b.file}`}>Lihat sumber di GitHub</a>
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
