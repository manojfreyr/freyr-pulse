/** Shared access-gate helpers. Web Crypto only, so this is safe in both the
 *  edge middleware and Node route handlers. */
export const ACCESS_COOKIE = "fp_access";

export async function tokenFor(passphrase: string): Promise<string> {
  const data = new TextEncoder().encode(`freyr-pulse:${passphrase}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
