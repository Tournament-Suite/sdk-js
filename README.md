# @tournamentsuite/sdk

Official TypeScript SDK for the [Tournament Suite](https://tournamentsuite.com) API.

## Install

```bash
npm install @tournamentsuite/sdk
```

## Quickstart

```ts
import { TournamentSuiteClient } from '@tournamentsuite/sdk';

const client = new TournamentSuiteClient({
  apiKey: 'YOUR_API_KEY',
  projectId: 'YOUR_PROJECT_ID',
});

// List tournaments
const tournaments = await client.tournaments.list();

// Create a tournament
const tournament = await client.tournaments.create({
  name: 'Summer Championship 2026',
  format: 'single_elimination',
  game: 'cs2',
  maxParticipants: 16,
  registrationStart: '2026-06-20T00:00:00Z',
  registrationEnd: '2026-06-23T23:59:00Z',
  startDate: '2026-06-24T14:00:00Z',
  prizePool: 5000,
  currency: 'USD',
});

await client.tournaments.publish(tournament.id);
```

## Authentication

Pass either `apiKey` (for server-to-server) or `token` (for user-scoped flows):

```ts
// API key — generate from the Developer Portal
const client = new TournamentSuiteClient({ apiKey: 'ts_key_...', projectId: '...' });

// JWT token — obtained via Keycloak PKCE
const client = new TournamentSuiteClient({ token: 'eyJ...', projectId: '...' });
```

## Realtime

```ts
import { TournamentSuiteRealtime } from '@tournamentsuite/sdk';

const rt = new TournamentSuiteRealtime({ token: 'YOUR_TOKEN' });
rt.connect();

rt.joinTournament('TOURNAMENT_ID');

rt.onMatchUpdate((event) => {
  console.log('Score update:', event.score);
});
```

## Webhook Verification

```ts
import { verifyWebhookSignature, parseWebhook } from '@tournamentsuite/sdk';

// Express example
app.post('/webhooks/ts', express.raw({ type: 'application/json' }), (req, res) => {
  const payload = parseWebhook(
    req.body.toString(),
    {
      'x-ts-timestamp': req.headers['x-ts-timestamp'] as string,
      'x-ts-signature': req.headers['x-ts-signature'] as string,
    },
    process.env.TS_WEBHOOK_SECRET!
  );

  if (payload.event === 'tournament.completed') {
    console.log('Winner:', payload.data);
  }

  res.sendStatus(200);
});
```

## API Reference

| Resource | Methods |
|---|---|
| `client.tournaments` | `list`, `get`, `create`, `publish`, `generateBracket`, `getBracket`, `getStandings` |
| `client.matches` | `list`, `get`, `submitResult` |
| `client.participants` | `list`, `approve`, `disqualify` |
| `client.webhooks` | `list`, `create`, `delete`, `test` |

## Sandbox

Use the sandbox base URL for testing — no real data is affected:

```ts
const client = new TournamentSuiteClient({
  apiKey: 'YOUR_API_KEY',
  projectId: 'YOUR_PROJECT_ID',
  baseUrl: 'https://api.tournamentsuite.com/api/v1/sandbox',
});
```

## Links

- [API Docs](https://github.com/Tournament-Suite/api-docs)
- [Webhook Examples](https://github.com/Tournament-Suite/webhook-examples)
- [Developer Portal](https://tournamentsuite.com/developer)
- [GitHub Discussions](https://github.com/orgs/Tournament-Suite/discussions)