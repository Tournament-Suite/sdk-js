import { io, Socket } from 'socket.io-client';

export interface RealtimeConfig {
  token: string;
  baseUrl?: string;
}

export interface MatchUpdateEvent {
  matchId: string;
  status: string;
  score?: Record<string, number>;
  winnerId?: string;
}

export interface TournamentUpdateEvent {
  tournamentId: string;
  status: string;
  currentRound?: number;
}

export interface ParticipantUpdateEvent {
  participantId: string;
  tournamentId: string;
  status: string;
}

export class TournamentSuiteRealtime {
  private socket: Socket | null = null;
  private readonly config: Required<RealtimeConfig>;

  constructor(config: RealtimeConfig) {
    this.config = {
      token: config.token,
      baseUrl: config.baseUrl ?? 'wss://api.tournamentsuite.com',
    };
  }

  connect(): void {
    this.socket = io(this.config.baseUrl, {
      auth: { token: this.config.token },
      transports: ['websocket'],
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  /** Join a tournament room to receive live updates */
  joinTournament(tournamentId: string): void {
    this.socket?.emit('tournament:join', { tournamentId });
  }

  leaveTournament(tournamentId: string): void {
    this.socket?.emit('tournament:leave', { tournamentId });
  }

  /** Join a match room to receive live score updates */
  joinMatch(matchId: string): void {
    this.socket?.emit('match:join', { matchId });
  }

  leaveMatch(matchId: string): void {
    this.socket?.emit('match:leave', { matchId });
  }

  onMatchUpdate(handler: (event: MatchUpdateEvent) => void): () => void {
    this.socket?.on('match:update', handler);
    return () => this.socket?.off('match:update', handler);
  }

  onTournamentUpdate(handler: (event: TournamentUpdateEvent) => void): () => void {
    this.socket?.on('tournament:update', handler);
    return () => this.socket?.off('tournament:update', handler);
  }

  onParticipantUpdate(handler: (event: ParticipantUpdateEvent) => void): () => void {
    this.socket?.on('participant:update', handler);
    return () => this.socket?.off('participant:update', handler);
  }

  onConnect(handler: () => void): void {
    this.socket?.on('connect', handler);
  }

  onDisconnect(handler: (reason: string) => void): void {
    this.socket?.on('disconnect', handler);
  }
}