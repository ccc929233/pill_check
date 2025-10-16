// This file tells TypeScript that we are defining a custom property on the global `window` object.
// It resolves the "Property 'process' does not exist on type 'Window'" error in the editor.
interface Window {
  process: {
    env: {
      API_KEY: string;
    };
  };
}
