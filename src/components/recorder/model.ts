export enum MimeTypes {
  MP4 = 'video/mp4',
  MP3 = 'audio/mpeg',
  WEBM = 'video/webm',
  MKV = 'video/x-matroska',
  OGG = 'audio/ogg',
  WEBM_AUDIO = 'audio/webm',
};

export const MimeExtensions = {
  [MimeTypes.MP4]: 'mp4',
  [MimeTypes.MP3]: 'mp3',
  [MimeTypes.WEBM]: 'webm',
  [MimeTypes.MKV]: 'mkv',
  [MimeTypes.OGG]: 'ogg',
  [MimeTypes.WEBM_AUDIO]: 'webm',
};

/**
 * @param {string?} mimeType
 * @returns {string}
 */
export function findExtensionForMimeType(mimeType?: string): string {
  if (!mimeType) {
    return MimeExtensions[MimeTypes.MP4];
  }
  for (const [key, value] of Object.entries(MimeExtensions)) {
    if (mimeType.indexOf(key) !== -1) {
      return value;
    }
  }
  return MimeExtensions[MimeTypes.MP4];
}
