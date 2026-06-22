/**
 * Example: List and fetch matches for a tournament
 *
 * Install: npm install @tournamentsuite/sdk
 */
import { TournamentSuiteClient } from '@tournamentsuite/sdk';

const client = new TournamentSuiteClient({
  apiKey: process.env.TS_API_KEY,
  projectId: process.env.TS_PROJECT_ID,
});

const TOURNAMENT_ID = 'your-tournament-id';

async function main() {
  // List all matches in a tournament (paginated)
  const matches = await client.matches.list(TOURNAMENT_ID, { page: 1, limit: 20 });

  console.log(`Found ${matches.length} matches:`);
  for (const match of matches) {
    const participants = match.participants.map((p) => p.name).join(' vs ');
    console.log(`  [${match.status.padEnd(10)}] Round ${match.round} — ${participants}`);
  }

  // Fetch a single match by ID
  if (matches.length > 0) {
    const firstMatch = matches[0];
    const detail = await client.matches.get(firstMatch.id);
    console.log('\nMatch detail:', JSON.stringify(detail, null, 2));

    // Submit a result if the match is in progress
    if (detail.status === 'in_progress' && detail.participants.length > 0) {
      const winnerId = detail.participants[0].id;
      await client.matches.submitResult(detail.id, {
        winnerId,
        score: { [detail.participants[0].id]: 2, [detail.participants[1]?.id ?? '']: 0 },
      });
      console.log(`\nResult submitted — winner: ${detail.participants[0].name}`);
    }
  }
}

main().catch(console.error);