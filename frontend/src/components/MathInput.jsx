import { useRef, useEffect } from 'react';

export default function MathInput({ value, onChange, placeholder, className = '', style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.value) {
      ref.current.value = value || '';
    }
  }, [value]);

  return (
    <math-field
      ref={ref}
      class={`math-input ${className}`}
      style={style}
      virtual-keyboard-mode="manual"
      onInput={(e) => onChange?.(e.target.value)}
    />
  );
}
