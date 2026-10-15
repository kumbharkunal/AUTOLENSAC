/** Renders `*word*` in content strings as the italic lens-blue accent. */
export function renderAccent(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={index} className="accent">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}

/** Plain text without accent markers (for aria labels, metadata). */
export function plain(text: string) {
  return text.replace(/\*/g, "");
}
