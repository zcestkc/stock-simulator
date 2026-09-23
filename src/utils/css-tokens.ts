/**
 * Resolves a design token from src/styles/globals.css to a concrete colour string,
 * for JS APIs that can't take Tailwind classes (canvas charts, SVG props).
 *
 * tokenColor('positive')      -> 'hsl(142 76% 36%)'
 * tokenColor('positive', 0.2) -> 'hsl(142 76% 36% / 0.2)'
 *
 * On the server there's no computed style, so it falls back to a var() reference.
 */
export const tokenColor = (name: string, alpha = 1): string => {
  const channels =
    typeof window === 'undefined'
      ? `var(--${name})`
      : getComputedStyle(document.documentElement)
          .getPropertyValue(`--${name}`)
          .trim();
  return alpha === 1 ? `hsl(${channels})` : `hsl(${channels} / ${alpha})`;
};
