import { TZ } from './tz';
import type { StorefrontConfig } from '@buildwithdarsh/sdk';

let cachedConfig: StorefrontConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getConfig(): Promise<StorefrontConfig | null> {
  const now = Date.now();
  if (cachedConfig && now - cacheTimestamp < CACHE_TTL) {
    return cachedConfig;
  }

  try {
    const config = await TZ.storefront.config.get();
    cachedConfig = config;
    cacheTimestamp = now;
    return config;
  } catch {
    return cachedConfig;
  }
}
