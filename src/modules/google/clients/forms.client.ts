import { google } from 'googleapis';
import { GOOGLE_API_FORMS_URL, GOOGLE_API_DRIVE_URL, GOOGLE_API_AUTH_BASE_URL } from '../constants';
import { getGoogleAuthClient } from './auth';

export const getGoogleFormsClient = () => {
  const auth = getGoogleAuthClient([GOOGLE_API_FORMS_URL, GOOGLE_API_DRIVE_URL, GOOGLE_API_AUTH_BASE_URL]);
  return google.forms({
    version: 'v1',
    auth,
  });
};
