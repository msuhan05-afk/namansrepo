import { getUxpModule } from './uxp';
import type { ServiceResult } from '@/types';

/**
 * Opens a URL in the operating system's default browser.
 *
 * Adobe-specific: UXP exposes `uxp.shell.openExternal`. The `launchProcess`
 * permission in the manifest (schemes https/http) is what authorizes this.
 * In a plain browser dev session we fall back to `window.open`.
 */
export async function openInExternalBrowser(url: string): Promise<ServiceResult> {
  if (!url) return { ok: false, error: 'No URL provided.' };

  const uxpModule = getUxpModule();
  try {
    if (uxpModule?.shell?.openExternal) {
      await uxpModule.shell.openExternal(url);
      return { ok: true, data: undefined };
    }
    // Dev fallback outside the UXP host.
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return { ok: true, data: undefined };
    }
    return { ok: false, error: 'External browser is unavailable in this environment.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
