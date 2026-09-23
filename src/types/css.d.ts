// Global stylesheets are imported for their side effects (e.g. `import '@/styles/globals.css'`).
// Next.js only declares types for *.module.css, so TypeScript (TS 6+ checks side-effect
// imports by default: noUncheckedSideEffectImports) needs this to resolve plain .css files.
declare module '*.css';
