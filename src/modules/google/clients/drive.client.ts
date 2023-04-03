import { google } from 'googleapis';
import { GOOGLE_API_DRIVE_URL, GOOGLE_API_AUTH_BASE_URL } from '../constants';
import { getGoogleAuthClient } from './auth';

export const getGoogleDriveClient = () => {
  const auth = getGoogleAuthClient([GOOGLE_API_AUTH_BASE_URL, GOOGLE_API_DRIVE_URL]);
  return google.drive({
    version: 'v3',
    auth,
  });
};
