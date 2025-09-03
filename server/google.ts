import fs from 'fs';
import { google } from 'googleapis';

export type GoogleClients = {
  oAuth2Client: any;
  calendar: any;
};

function loadCredentials() {
  if (!fs.existsSync('credentials.json')) {
    return null;
  }
  try {
    const raw = fs.readFileSync('credentials.json', 'utf8');
    const parsed = JSON.parse(raw);
    const conf = parsed.installed ?? parsed.web;
    if (!conf) throw new Error('Invalid credentials.json: expected "installed" or "web" root');
    return conf;
  } catch (error) {
    console.warn('Failed to load Google credentials:', error);
    return null;
  }
}

function loadToken() {
  if (!fs.existsSync('token.json')) {
    return null;
  }
  try {
    const raw = fs.readFileSync('token.json', 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load Google token:', error);
    return null;
  }
}

export function getGoogleClients(): GoogleClients | null {
  const creds = loadCredentials();
  const token = loadToken();
  
  if (!creds || !token) {
    console.info('Google Calendar integration disabled: missing credentials or token files');
    return null;
  }

  try {
    const { client_id, client_secret, redirect_uris } = creds;
    const redirectUri = Array.isArray(redirect_uris) && redirect_uris.length ? redirect_uris[0] : undefined;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
    oAuth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    return { oAuth2Client, calendar };
  } catch (error) {
    console.warn('Failed to initialize Google clients:', error);
    return null;
  }
}