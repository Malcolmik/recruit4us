/// <reference types="vite/client" />

// (optional but nice) declare your env var:
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
