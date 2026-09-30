// The Cloudflare build resolves this module itself; the Node build never loads it.
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}
