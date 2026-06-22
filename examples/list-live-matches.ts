import { TournamentSuiteClient } from '@tournamentsuite/sdk';

const client = new TournamentSuiteClient({ apiKey: 'YOUR_API_KEY' });

async function pollLiveMatches() {
  console.log('Polling live matches every 30s...');

  const poll = async () => {
    const matches = await client.publicMatches.listLive({ disciplineId: 'cs2' });
    console.log(`${new Date().toISOString()} — ${matches.length} live match(es)`);

    for (const match of matches) {
      const score = match.opponents.map(o => o.score ?? 0).join(' - ');
      console.log(`  [${match.id}] ${score}`);
    }
  };

  await poll();
  setInterval(poll, 30_000);
}

pollLiveMatches().catch(console.error);