import katex from 'katex';

function renderLatex(latex, displayMode) {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode, strict: false });
  } catch {
    return latex;
  }
}

export default function MathText({ text, className = '' }) {
  const parts = String(text ?? '').split('$');
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: renderLatex(part, /\\(displaystyle|dfrac)/.test(part)),
            }}
          />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
