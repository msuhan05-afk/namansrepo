import type { AssetCandidate, AssetKind, ServiceResult } from '@/types';
import { importFileToProject } from './premiereImport';

/**
 * Asset import pipeline — ARCHITECTURE / PLACEHOLDER.
 *
 * Intended flow, once fully implemented:
 *   1. Resolve a direct media URL from the candidate (some services need an
 *      extra lookup to get the real file behind a page).
 *   2. Download the bytes to a temp location via UXP's `localFileSystem`.
 *   3. Hand the local path to `premiereImport.importFileToProject`.
 *
 * Steps 1–2 are intentionally stubbed: they require per-service scraping rules
 * and UXP file-system permissions that should be designed deliberately rather
 * than faked. The public surface below is stable so UI can be built against it.
 */

const KIND_LABEL: Record<AssetKind, string> = {
  image: 'image',
  video: 'video',
  audio: 'audio',
};

/**
 * Download an asset to disk.
 *
 * FUTURE IMPLEMENTATION: use `require('uxp').storage.localFileSystem` to get a
 * temporary folder, fetch the bytes, and write a File entry.
 */
export async function downloadAsset(
  candidate: AssetCandidate,
): Promise<ServiceResult<{ localPath: string }>> {
  if (!candidate.url) {
    return { ok: false, error: 'Asset has no source URL.' };
  }
  console.info(
    `[WebDock] downloadAsset requested (${KIND_LABEL[candidate.kind]}):`,
    candidate.url,
  );
  return {
    ok: false,
    error: `Downloading ${KIND_LABEL[candidate.kind]} assets is not implemented yet (placeholder).`,
  };
}

/**
 * High-level convenience: download an asset and import it into Premiere in one
 * call. Wired through to the real services above; currently surfaces the
 * placeholder errors so callers can show honest UI states.
 */
export async function downloadAndImport(
  candidate: AssetCandidate,
): Promise<ServiceResult<{ path: string }>> {
  const downloaded = await downloadAsset(candidate);
  if (!downloaded.ok) return downloaded;

  return importFileToProject(downloaded.data.localPath);
}
