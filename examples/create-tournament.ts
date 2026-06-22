import { TournamentSuiteClient } from '@tournamentsuite/sdk';

const client = new TournamentSuiteClient({
  apiKey: process.env.TS_API_KEY!,
  projectId: process.env.TS_PROJECT_ID!,
});

async function main() {
  // Create a 16-team single elimination tournament
  const tournament = await client.tournaments.create({
    name: 'Summer Championship 2026',
    format: 'single_elimination',
    game: 'cs2',
    maxParticipants: 16,
    registrationStart: new Date().toISOString(),
    registrationEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    prizePool: 5000,
    currency: 'USD',
  });

  console.log('Created tournament:', tournament.id);

  // Publish it so registration opens
  await client.tournaments.publish(tournament.id);
  console.log('Tournament published — registration is open');
}

main().catch(console.error);