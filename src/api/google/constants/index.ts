export const GOOGLE_API_AUTH_BASE_URL = 'https://www.googleapis.com/auth';
export const GOOGLE_API_DRIVE_URL = `${GOOGLE_API_AUTH_BASE_URL}/drive`;
export const GOOGLE_API_DOCUMENTS_URL = `${GOOGLE_API_AUTH_BASE_URL}/documents`;
export const GOOGLE_API_FORMS_URL = `${GOOGLE_API_AUTH_BASE_URL}/forms`;

export const FILE_TYPES = {
  form: 'form',
  folder: 'folder',
  document: 'document',
  spreadsheet: 'spreadsheet',
  presentation: 'presentation',
} as const;
