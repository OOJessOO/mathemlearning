export default function MathInput({ value, onChange, placeholder, className = '', style }) {
  return (
    <math-field
      class={`math-input ${className}`}
      style={style}
      virtual-keyboard-mode="manual"
      onInput={(e) => onChange?.(e.target.value)}
    >
      {value || ''}
    </math-field>
  );
}
