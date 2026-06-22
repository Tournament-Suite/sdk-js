import { TournamentSuiteClient } from '@tournamentsuite/sdk';

const client = new TournamentSuiteClient({ apiKey: 'YOUR_API_KEY' });
const PROJECT_ID = 'YOUR_PROJECT_ID';

async function main() {
  // Create a key with read scopes
  console.log('Creating API key...');
  const { secret, id, keyPrefix } = await client.apiKeys.create(PROJECT_ID, {
    name: 'Read-only integration',
    scopes: ['tournaments:read', 'matches:read', 'participants:read'],
    expiresInDays: 90,
  });
  console.log(`Created: ${keyPrefix}... (secret shown once: ${secret})`);

  // List all keys
  const keys = await client.apiKeys.list(PROJECT_ID);
  console.log(`Project has ${keys.length} API key(s)`);

  // Rotate the key
  console.log('Rotating key...');
  const rotated = await client.apiKeys.rotate(PROJECT_ID, id);
  console.log(`Rotated: ${rotated.keyPrefix}... new secret: ${rotated.secret}`);

  // Revoke
  await client.apiKeys.revoke(PROJECT_ID, rotated.id, 'Example cleanup');
  console.log('Key revoked.');
}

main().catch(console.error);