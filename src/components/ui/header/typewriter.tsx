'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  delay: number;
  infinite: boolean;
}

const PAUSE_AT_END_MS = 2000;

export const Typewriter = ({ text, delay, infinite }: TypewriterProps) => {
  // Only the position is state; the visible text is derived from it.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => setIndex((i) => i + 1), delay);
      return () => clearTimeout(timeout);
    }
    if (infinite) {
      // Pause at the end, then start typing again.
      const timeout = setTimeout(() => setIndex(0), PAUSE_AT_END_MS);
      return () => clearTimeout(timeout);
    }
  }, [index, delay, infinite, text]);

  return (
    <p className="select-none">
      &nbsp;{text.slice(0, index)}
      <span className="animate-ping">|</span>
    </p>
  );
};
