export const BASE_PATH =
  typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

export function publicAsset(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`Public asset paths must start with '/': ${path}`);
  }

  return `${BASE_PATH}${path}`;
}
