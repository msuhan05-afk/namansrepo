import { getPremiereModule } from '@/services/uxp/uxp';
import type { ServiceResult } from '@/types';

/**
 * Premiere Pro project-import bridge — ARCHITECTURE / PLACEHOLDER.
 *
 * This module isolates every call into the Premiere Pro DOM (`premierepro`
 * module) behind a stable interface. The functions are deliberately NOT
 * implemented end-to-end yet: importing media touches the active Project,
 * ProjectItem root, and the editor's selected sequence, and the exact API
 * surface varies across Premiere versions. Wiring that up is a focused task
 * for a follow-up once a target Premiere build is pinned.
 *
 * The contract below is what the rest of WebDock can rely on today.
 */

/** Whether a Premiere host is present and import is theoretically possible. */
export function canImportToPremiere(): boolean {
  return getPremiereModule() !== null;
}

/**
 * Import a local media file (already downloaded to disk) into the active
 * Premiere project's root bin.
 *
 * FUTURE IMPLEMENTATION:
 *   const ppro = getPremiereModule() as PremiereApp;
 *   const project = await ppro.Project.getActiveProject();
 *   const root = await project.getRootItem();
 *   await project.importFiles([localPath], /* suppressUI *\/ true, root);
 *
 * @param localPath Absolute path to a media file on disk.
 */
export async function importFileToProject(
  localPath: string,
): Promise<ServiceResult<{ path: string }>> {
  if (!canImportToPremiere()) {
    return { ok: false, error: 'Premiere Pro host is not available.' };
  }
  if (!localPath) {
    return { ok: false, error: 'No file path provided.' };
  }

  // NOT IMPLEMENTED: real import is pending a pinned Premiere API version.
  console.info('[WebDock] importFileToProject requested:', localPath);
  return {
    ok: false,
    error: 'Importing into Premiere is not implemented yet (placeholder).',
  };
}

/**
 * Insert an already-imported ProjectItem onto the active sequence at the
 * playhead.
 *
 * FUTURE IMPLEMENTATION: resolve the active sequence, find the target video/
 * audio track, and call the sequence insert/overwrite API.
 */
export async function insertIntoActiveSequence(
  projectItemId: string,
): Promise<ServiceResult> {
  if (!canImportToPremiere()) {
    return { ok: false, error: 'Premiere Pro host is not available.' };
  }
  console.info('[WebDock] insertIntoActiveSequence requested:', projectItemId);
  return {
    ok: false,
    error: 'Sequence insertion is not implemented yet (placeholder).',
  };
}
