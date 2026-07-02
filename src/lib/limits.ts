export const LIMITS = {
  PASTE_BYTES: 2 * 1024 * 1024, // 2 MB
  FILE_BYTES: 5 * 1024 * 1024,      // 5 MB — stated limit shown in UI
  FILE_BYTES_HARD: 6 * 1024 * 1024, // 6 MB — actual enforcement threshold
  URL_BYTES: 1 * 1024 * 1024, // 1 MB
  REGEX_TEST_BYTES: 500 * 1024, // 500 KB
  IDB_SAVE_BYTES: 10 * 1024 * 1024, // 10 MB
  UUID_LENGTH_MIN: 8,
  UUID_LENGTH_MAX: 128,
  UUID_LENGTH_DEFAULT: 16,
  JSON_LINE_RENDER_THRESHOLD: 5_000, // lines above which OutputPanel switches to textarea
} as const
