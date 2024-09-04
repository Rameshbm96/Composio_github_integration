const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = process.env.GOOGLE_SCOPES;
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function getSignInLink(oAuth2Client) {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  // Function to search for emails in a specified label (inbox or spam)
  async function searchEmailInLabel(label) {
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1,
      labelIds: [label], 
    });

    if (res.data.messages && res.data.messages.length > 0) {
      const message = res.data.messages[0];
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      let emailData;

      if (email.data.payload.parts) {
        const part = email.data.payload.parts.find(
          part => part.mimeType === 'text/html' || part.mimeType === 'text/plain'
        );
        emailData = Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else {
        emailData = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8');
      }

      const linkRegex = /https:\/\/app\.composio\.dev\/verify\?token=[\w-]+/;
      const match = emailData.match(linkRegex);

      if (match) {
        return match[0];
      }
    }
    return null;
  }

  // First, check the inbox
  let signInLink = await searchEmailInLabel('INBOX');

  // If not found in the inbox, check the spam/junk folder
  if (!signInLink) {
    signInLink = await searchEmailInLabel('SPAM');
  }
  return signInLink;
}

module.exports = { authorize, getSignInLink };