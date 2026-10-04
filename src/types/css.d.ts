// `export {}` makes this file a module so the declaration below augments React's types.
export {};

declare module 'react' {
  /** Allow CSS custom properties (e.g. `--card-accent`) in inline `style` objects. */
  interface CSSProperties {
    [customProperty: `--${string}`]: string | number | undefined;
  }
}
