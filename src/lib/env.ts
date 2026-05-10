const required = [
  'NEXT_PUBLIC_TZ_ORG_KEY',
] as const;

export function validateEnv() {
  if (process.env['NEXT_PHASE'] === 'phase-production-build') return;

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const message = `Missing environment variables: ${missing.join(', ')}`;
    if (process.env['NODE_ENV'] === 'production') {
      throw new Error(message);
    }
    console.warn(`[Aurum] ${message}`);
  }
}
