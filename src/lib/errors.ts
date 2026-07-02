export const ERRORS = {
  PASTE_TOO_LARGE: 'Input exceeds 2 MB. Trim your content or upload a file.',
  FILE_TOO_LARGE: (mb: string) => `File is ${mb} MB — exceeds the 5 MB limit.`,
  URL_TOO_LARGE: 'Response exceeds 1 MB. Fetch a smaller endpoint or paste directly.',
  URL_CORS: 'This URL blocked the request (CORS). Copy-paste the content instead.',
  URL_INVALID: 'Enter a valid URL starting with https://',
  IDB_SAVE_SKIPPED: 'Autosave paused — content too large',
  JSON_INVALID: (line: number, col: number) => `Invalid JSON at line ${line}, col ${col}.`,
} as const
