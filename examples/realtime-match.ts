import { TournamentSuiteRealtime } from '@tournamentsuite/sdk';

const realtime = new TournamentSuiteRealtime({
  token: process.env.TS_TOKEN!,
});

realtime.connect();

realtime.onConnect(() => {
  console.log('Connected to Tournament Suite realtime');

  const tournamentId = process.env.TS_TOURNAMENT_ID!;
  realtime.joinTournament(tournamentId);
});

realtime.onTournamentUpdate((event) => {
  console.log('Tournament update:', event.status, event.currentRound);
});

realtime.onMatchUpdate((event) => {
  console.log('Match update:', event.matchId, event.status, event.score);

  if (event.status === 'completed') {
    console.log('Winner:', event.winnerId);
  }
});

realtime.onDisconnect((reason) => {
  console.log('Disconnected:', reason);
});