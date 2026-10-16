// Renders `backtick` spans from the markdown sources as <code>.
export default function Inline({ text }) {
  return text.split("`").map((part, i) =>
    i % 2 ? <code key={i}>{part}</code> : part
  );
}
