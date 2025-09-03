import fs from 'fs';
import { google } from 'googleapis';

export type GoogleClients = {
  oAuth2Client: any;
  calendar: any;
};

function loadCredentials() {
  // First try to load from file
  if (fs.existsSync('credentials.json')) {
    try {
      const raw = fs.readFileSync('credentials.json', 'utf8');
      const parsed = JSON.parse(raw);
      const conf = parsed.installed ?? parsed.web;
      if (!conf) throw new Error('Invalid credentials.json: expected "installed" or "web" root');
      return conf;
    } catch (error) {
      console.warn('Failed to load Google credentials from file:', error);
    }
  }

  // Fallback to environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.PUBLIC_BASE_URL || 'http://localhost:5000'}/api/webhooks/booking`;

  console.log('[DEBUG] Google credentials check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId ? clientId.length : 0,
    redirectUri
  });

  if (clientId && clientSecret) {
    return {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri]
    };
  }

  console.info('Google credentials not found in file or environment variables');
  return null;
}

function loadToken() {
  // First try to load from file
  if (fs.existsSync('token.json')) {
    try {
      const raw = fs.readFileSync('token.json', 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Failed to load Google token from file:', error);
    }
  }

  // Fallback to environment variables
  const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const tokenType = process.env.GOOGLE_TOKEN_TYPE || 'Bearer';
  const expiryDate = process.env.GOOGLE_TOKEN_EXPIRY_DATE;

  console.log('[DEBUG] Google token check:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    tokenType,
    expiryDate
  });

  if (accessToken && refreshToken) {
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      expiry_date: expiryDate ? parseInt(expiryDate) : undefined
    };
  }

  console.info('Google token not found in file or environment variables');
  return null;
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