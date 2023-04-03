import { google } from 'googleapis';

export const getGoogleAuthClient = (scopes: string[] = undefined) => {
  return new google.auth.GoogleAuth({
    scopes,
  }).fromJSON({
    type: 'authorized_user',
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
  });
};
