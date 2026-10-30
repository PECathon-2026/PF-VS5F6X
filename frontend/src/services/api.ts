import { ReaderApiClient } from '../types/article';
import { MockApiClient } from './mockClient';
import { LiveApiClient } from './liveClient';

/**
 * Determines whether development fixtures are active.
 * Controlled strictly by VITE_USE_DEV_FIXTURES environment variable.
 */
export function isFixtureModeEnabled(): boolean {
  return import.meta.env.VITE_USE_DEV_FIXTURES === 'true' || import.meta.env.VITE_USE_DEV_FIXTURES === true;
}

/**
 * Returns the configured API client singleton.
 * If VITE_USE_DEV_FIXTURES=true -> MockApiClient
 * Otherwise -> LiveApiClient
 */
export function createApiClient(): ReaderApiClient {
  if (isFixtureModeEnabled()) {
    return new MockApiClient();
  }
  return new LiveApiClient();
}

export const readerApi = createApiClient();
