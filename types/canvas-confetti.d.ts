declare module "canvas-confetti" {
  import type { Options } from "canvas-confetti";

  const confetti: (options?: Options) => Promise<null>;
  export default confetti;
}
