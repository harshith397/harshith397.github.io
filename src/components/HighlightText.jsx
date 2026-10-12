import MarkerSpan from "./MarkerSpan";

const HighlightText = ({ text }) => {
  if (!text) return null;

  const parts = text.split(
    /(\*\*===.*?===\*\*|===.*?===|\*\*.*?\*\*|`.*?`|\n\n)/g,
  );

  return (
    <>
      {parts.map((part, i) => {
        if (part === "\n\n") {
          return <div key={i} className="h-6" />;
        }
        if (part.startsWith("**===") && part.endsWith("===**")) {
          const content = part.slice(5, -5);
          return (
            <MarkerSpan key={i}>
              <strong className="font-semibold text-zinc-900">{content}</strong>
            </MarkerSpan>
          );
        }
        if (part.startsWith("===") && part.endsWith("===")) {
          return (
            <MarkerSpan key={i}>
              <span className="font-semibold text-zinc-900">{part.slice(3, -3)}</span>
            </MarkerSpan>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-zinc-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[0.85em] font-mono border border-zinc-200"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export default HighlightText;
