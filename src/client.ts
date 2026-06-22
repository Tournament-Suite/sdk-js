import type {
  Tournament,
  Match,
  MatchGame,
  MatchEngagement,
  MatchQueue,
  Participant,
  Circuit,
  CircuitStanding,
  User,
  WebhookSubscription,
  CreateWebhookDto,
  UpdateWebhookDto,
  WebhookDelivery,
  WebhookTestResult,
  ApiKey,
  ApiKeySecret,
  CreateApiKeyDto,
  CompleteMatchDto,
} from './types/index.js';

const DEFAULT_BASE_URL = 'https://api.tournamentsuite.com/api/v1';

export interface TournamentSuiteClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

class TournamentsResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async list(filters?: { page?: number; limit?: number; status?: string; game?: string; disciplineId?: string; search?: string }): Promise<Tournament[]> {
    return this.client['_request']<Tournament[]>('GET', '/tournaments', { query: filters as Record<string, string | number | undefined> });
  }

  async search(q: string, fuzzy?: boolean): Promise<Tournament[]> {
    return this.client['_request']<Tournament[]>('GET', '/tournaments/search', { query: { q, fuzzy: fuzzy ? 'true' : undefined } });
  }

  async get(tournamentId: string): Promise<Tournament> {
    return this.client['_request']<Tournament>('GET', `/tournaments/${tournamentId}`);
  }

  async create(dto: Omit<Tournament, 'id' | 'createdAt' | 'updatedAt' | 'participantCount' | 'checkedInCount' | 'status'>): Promise<Tournament> {
    return this.client['_request']<Tournament>('POST', '/tournaments', { body: dto });
  }

  async update(tournamentId: string, dto: Partial<Tournament>): Promise<Tournament> {
    return this.client['_request']<Tournament>('PATCH', `/tournaments/${tournamentId}`, { body: dto });
  }

  async delete(tournamentId: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/tournaments/${tournamentId}`);
  }

  async getStages(tournamentId: string): Promise<unknown[]> {
    return this.client['_request']<unknown[]>('GET', `/tournaments/${tournamentId}/stages`);
  }

  async getBracket(tournamentId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/tournaments/${tournamentId}/bracket`);
  }

  async getSchedule(tournamentId: string): Promise<unknown[]> {
    return this.client['_request']<unknown[]>('GET', `/tournaments/${tournamentId}/schedule`);
  }

  async getStatistics(tournamentId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/tournaments/${tournamentId}/statistics`);
  }

  async listFeatured(filters?: { page?: number; limit?: number }): Promise<Tournament[]> {
    return this.client['_request']<Tournament[]>('GET', '/tournaments/featured', { query: filters as Record<string, string | number | undefined> });
  }

  async listUpcoming(limit?: number): Promise<Tournament[]> {
    return this.client['_request']<Tournament[]>('GET', '/tournaments/upcoming', { query: { limit } });
  }
}

class MatchesResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async list(tournamentId: string, filters?: { page?: number; limit?: number; status?: string }): Promise<Match[]> {
    return this.client['_request']<Match[]>('GET', `/tournaments/${tournamentId}/matches`, { query: filters as Record<string, string | number | undefined> });
  }

  async get(tournamentId: string, matchId: string): Promise<Match> {
    return this.client['_request']<Match>('GET', `/tournaments/${tournamentId}/matches/${matchId}`);
  }

  async create(tournamentId: string, dto: unknown): Promise<Match> {
    return this.client['_request']<Match>('POST', `/tournaments/${tournamentId}/matches`, { body: dto });
  }

  async update(tournamentId: string, matchId: string, dto: unknown): Promise<Match> {
    return this.client['_request']<Match>('PATCH', `/tournaments/${tournamentId}/matches/${matchId}`, { body: dto });
  }

  async delete(tournamentId: string, matchId: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/tournaments/${tournamentId}/matches/${matchId}`);
  }

  async start(tournamentId: string, matchId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/matches/${matchId}/start`);
  }

  async complete(tournamentId: string, matchId: string, dto: CompleteMatchDto): Promise<Match> {
    return this.client['_request']<Match>('POST', `/tournaments/${tournamentId}/matches/${matchId}/complete`, { body: dto });
  }

  async forfeit(tournamentId: string, matchId: string, dto: { winnerId: string; reason?: string }): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/matches/${matchId}/forfeit`, { body: dto });
  }

  async reset(tournamentId: string, matchId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/matches/${matchId}/reset`);
  }

  async reschedule(tournamentId: string, matchId: string, dto: { scheduledAt: string }): Promise<Match> {
    return this.client['_request']<Match>('POST', `/tournaments/${tournamentId}/matches/${matchId}/reschedule`, { body: dto });
  }

  async submitScore(tournamentId: string, matchId: string, dto: { score1: number; score2: number }): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/matches/${matchId}/score`, { body: dto });
  }

  async getStandings(tournamentId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/tournaments/${tournamentId}/standings`);
  }

  async openDispute(tournamentId: string, matchId: string, dto: { reason: string; evidence?: string }): Promise<unknown> {
    return this.client['_request']<unknown>('POST', `/tournaments/${tournamentId}/matches/${matchId}/dispute`, { body: dto });
  }
}

class PublicMatchesResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async listLive(filters?: { disciplineId?: string; disciplineSlug?: string }): Promise<Match[]> {
    return this.client['_request']<Match[]>('GET', '/matches/live', { query: filters as Record<string, string | number | undefined> });
  }

  async listUpcoming(filters?: { timeRange?: string; disciplineId?: string; disciplineSlug?: string }): Promise<Match[]> {
    return this.client['_request']<Match[]>('GET', '/matches/upcoming', { query: filters as Record<string, string | number | undefined> });
  }

  async listRecent(filters?: { timeRange?: string; disciplineId?: string }): Promise<Match[]> {
    return this.client['_request']<Match[]>('GET', '/matches/recent', { query: filters as Record<string, string | number | undefined> });
  }

  async get(matchId: string): Promise<Match> {
    return this.client['_request']<Match>('GET', `/matches/${matchId}`);
  }

  async getGames(matchId: string): Promise<MatchGame[]> {
    return this.client['_request']<MatchGame[]>('GET', `/matches/${matchId}/games`);
  }

  async getStats(matchId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/matches/${matchId}/stats`);
  }

  async getEngagement(matchId: string): Promise<MatchEngagement> {
    return this.client['_request']<MatchEngagement>('GET', `/matches/${matchId}/engagement`);
  }
}

class ParticipantsResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async list(tournamentId: string, filters?: { page?: number; limit?: number; status?: string }): Promise<Participant[]> {
    return this.client['_request']<Participant[]>('GET', `/tournaments/${tournamentId}/participants`, { query: filters as Record<string, string | number | undefined> });
  }

  async get(tournamentId: string, participantId: string): Promise<Participant> {
    return this.client['_request']<Participant>('GET', `/tournaments/${tournamentId}/participants/${participantId}`);
  }

  async register(tournamentId: string, dto?: { teamId?: string; metadata?: unknown }): Promise<Participant> {
    return this.client['_request']<Participant>('POST', `/tournaments/${tournamentId}/participants/register`, { body: dto });
  }

  async unregister(tournamentId: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/tournaments/${tournamentId}/participants/me`);
  }

  async approve(tournamentId: string, participantId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/participants/${participantId}/approve`);
  }

  async reject(tournamentId: string, participantId: string, reason?: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/participants/${participantId}/reject`, { body: reason ? { reason } : undefined });
  }

  async checkin(tournamentId: string, participantId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/participants/${participantId}/checkin`);
  }

  async disqualify(tournamentId: string, participantId: string, reason?: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/participants/${participantId}/disqualify`, { body: reason ? { reason } : undefined });
  }

  async reinstate(tournamentId: string, participantId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/tournaments/${tournamentId}/participants/${participantId}/reinstate`);
  }

  async getStatistics(tournamentId: string, participantId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/tournaments/${tournamentId}/participants/${participantId}/statistics`);
  }

  async getMatches(tournamentId: string, participantId: string): Promise<Match[]> {
    return this.client['_request']<Match[]>('GET', `/tournaments/${tournamentId}/participants/${participantId}/matches`);
  }

  async getWaitlist(tournamentId: string): Promise<Participant[]> {
    return this.client['_request']<Participant[]>('GET', `/tournaments/${tournamentId}/participants/waitlist`);
  }
}

class CircuitsResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async list(filters?: { search?: string; status?: string; game?: string; region?: string; tier?: string; page?: number; limit?: number }): Promise<Circuit[]> {
    return this.client['_request']<Circuit[]>('GET', '/circuits', { query: filters as Record<string, string | number | undefined> });
  }

  async get(circuitId: string): Promise<Circuit> {
    return this.client['_request']<Circuit>('GET', `/circuits/${circuitId}`);
  }

  async create(dto: unknown): Promise<Circuit> {
    return this.client['_request']<Circuit>('POST', '/circuits', { body: dto });
  }

  async update(circuitId: string, dto: unknown): Promise<Circuit> {
    return this.client['_request']<Circuit>('PATCH', `/circuits/${circuitId}`, { body: dto });
  }

  async delete(circuitId: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/circuits/${circuitId}`);
  }

  async publish(circuitId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/circuits/${circuitId}/publish`);
  }

  async start(circuitId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/circuits/${circuitId}/start`);
  }

  async complete(circuitId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/circuits/${circuitId}/complete`);
  }

  async listPopular(): Promise<Circuit[]> {
    return this.client['_request']<Circuit[]>('GET', '/circuits/popular');
  }

  async listUpcoming(): Promise<Circuit[]> {
    return this.client['_request']<Circuit[]>('GET', '/circuits/upcoming');
  }

  async getStandings(circuitId: string, opts?: { type?: string; region?: string; page?: number; limit?: number }): Promise<CircuitStanding[]> {
    return this.client['_request']<CircuitStanding[]>('GET', `/circuits/${circuitId}/standings`, { query: opts as Record<string, string | number | undefined> });
  }

  async getTournaments(circuitId: string): Promise<Tournament[]> {
    return this.client['_request']<Tournament[]>('GET', `/circuits/${circuitId}/tournaments`);
  }

  async getStatistics(circuitId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/circuits/${circuitId}/statistics`);
  }

  async registerParticipant(circuitId: string, dto?: { teamId?: string }): Promise<unknown> {
    return this.client['_request']<unknown>('POST', `/circuits/${circuitId}/register`, { body: dto });
  }
}

class UsersResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async get(userId: string): Promise<User> {
    return this.client['_request']<User>('GET', `/users/${userId}`);
  }

  async getMe(): Promise<User> {
    return this.client['_request']<User>('GET', '/users/me');
  }

  async updateMe(dto: Partial<User>): Promise<User> {
    return this.client['_request']<User>('PATCH', '/users/me', { body: dto });
  }

  async getStats(userId: string, game?: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/users/${userId}/stats`, { query: { game } });
  }

  async getLeaderboard(filters?: { game?: string; region?: string; page?: number; limit?: number }): Promise<unknown[]> {
    return this.client['_request']<unknown[]>('GET', '/users/leaderboard', { query: filters as Record<string, string | number | undefined> });
  }

  async follow(userId: string): Promise<void> {
    return this.client['_request']<void>('POST', `/users/${userId}/follow`);
  }

  async unfollow(userId: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/users/${userId}/follow`);
  }

  async getFollowers(userId: string): Promise<User[]> {
    return this.client['_request']<User[]>('GET', `/users/${userId}/followers`);
  }

  async getFollowing(userId: string): Promise<User[]> {
    return this.client['_request']<User[]>('GET', `/users/${userId}/following`);
  }

  async getCareer(): Promise<unknown> {
    return this.client['_request']<unknown>('GET', '/users/me/career');
  }

  async getTournamentHistory(): Promise<unknown[]> {
    return this.client['_request']<unknown[]>('GET', '/users/me/tournaments');
  }
}

class WebhooksResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async list(projectId: string): Promise<WebhookSubscription[]> {
    return this.client['_request']<WebhookSubscription[]>('GET', `/projects/${projectId}/developer/webhooks`);
  }

  async create(projectId: string, dto: CreateWebhookDto): Promise<WebhookSubscription> {
    return this.client['_request']<WebhookSubscription>('POST', `/projects/${projectId}/developer/webhooks`, { body: dto });
  }

  async update(projectId: string, webhookId: string, dto: UpdateWebhookDto): Promise<WebhookSubscription> {
    return this.client['_request']<WebhookSubscription>('PATCH', `/projects/${projectId}/developer/webhooks/${webhookId}`, { body: dto });
  }

  async delete(projectId: string, webhookId: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/projects/${projectId}/developer/webhooks/${webhookId}`);
  }

  async test(projectId: string, webhookId: string, eventType?: string): Promise<WebhookTestResult> {
    return this.client['_request']<WebhookTestResult>('POST', `/projects/${projectId}/developer/webhooks/${webhookId}/test`, { body: eventType ? { eventType } : undefined });
  }

  async listDeliveries(projectId: string, webhookId: string): Promise<WebhookDelivery[]> {
    return this.client['_request']<WebhookDelivery[]>('GET', `/projects/${projectId}/developer/webhooks/${webhookId}/deliveries`);
  }
}

class ApiKeysResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async list(projectId: string): Promise<ApiKey[]> {
    return this.client['_request']<ApiKey[]>('GET', `/projects/${projectId}/developer/api-keys`);
  }

  async create(projectId: string, dto: CreateApiKeyDto): Promise<ApiKeySecret> {
    return this.client['_request']<ApiKeySecret>('POST', `/projects/${projectId}/developer/api-keys`, { body: dto });
  }

  async revoke(projectId: string, keyId: string, reason?: string): Promise<void> {
    return this.client['_request']<void>('DELETE', `/projects/${projectId}/developer/api-keys/${keyId}`, { body: reason ? { reason } : undefined });
  }

  async rotate(projectId: string, keyId: string): Promise<ApiKeySecret> {
    return this.client['_request']<ApiKeySecret>('POST', `/projects/${projectId}/developer/api-keys/${keyId}/rotate`);
  }
}

class MatchmakingResource {
  constructor(private readonly client: TournamentSuiteClient) {}

  async listQueues(): Promise<MatchQueue[]> {
    return this.client['_request']<MatchQueue[]>('GET', '/matchmaking/queues');
  }

  async getQueue(queueId: string): Promise<MatchQueue> {
    return this.client['_request']<MatchQueue>('GET', `/matchmaking/queues/${queueId}`);
  }

  async getQueueStats(queueId: string): Promise<unknown> {
    return this.client['_request']<unknown>('GET', `/matchmaking/queues/${queueId}/stats`);
  }

  async join(dto: { queueId: string; teamId?: string }): Promise<void> {
    return this.client['_request']<void>('POST', '/matchmaking/join', { body: dto });
  }

  async leave(): Promise<void> {
    return this.client['_request']<void>('POST', '/matchmaking/leave');
  }

  async getStatus(): Promise<unknown> {
    return this.client['_request']<unknown>('GET', '/matchmaking/status');
  }
}

export class TournamentSuiteClient {
  readonly tournaments: TournamentsResource;
  readonly matches: MatchesResource;
  readonly publicMatches: PublicMatchesResource;
  readonly participants: ParticipantsResource;
  readonly circuits: CircuitsResource;
  readonly users: UsersResource;
  readonly webhooks: WebhooksResource;
  readonly apiKeys: ApiKeysResource;
  readonly matchmaking: MatchmakingResource;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: TournamentSuiteClientConfig) {
    if (!config.apiKey) {
      throw new Error('TournamentSuiteClient requires apiKey');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = config.timeout ?? 30_000;

    this.tournaments = new TournamentsResource(this);
    this.matches = new MatchesResource(this);
    this.publicMatches = new PublicMatchesResource(this);
    this.participants = new ParticipantsResource(this);
    this.circuits = new CircuitsResource(this);
    this.users = new UsersResource(this);
    this.webhooks = new WebhooksResource(this);
    this.apiKeys = new ApiKeysResource(this);
    this.matchmaking = new MatchmakingResource(this);
  }

  private async _request<T>(
    method: string,
    path: string,
    options?: { query?: Record<string, string | number | undefined>; body?: unknown }
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (options?.query) {
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url.toString(), {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
      }

      if (res.status === 204) return undefined as T;
      return res.json() as Promise<T>;
    } finally {
      clearTimeout(timer);
    }
  }
}