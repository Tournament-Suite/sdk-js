const DEFAULT_BASE_URL = 'https://api.tournamentsuite.com/api/v1';

export interface TournamentSuiteConfig {
  apiKey?: string;
  token?: string;
  baseUrl?: string;
  projectId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  format: string;
  game: string;
  status: string;
  maxParticipants: number;
  registrationStart: string;
  registrationEnd: string;
  startDate: string;
  prizePool?: number;
  currency?: string;
  createdAt: string;
}

export interface CreateTournamentDto {
  name: string;
  format: 'single_elimination' | 'double_elimination' | 'swiss' | 'round_robin' | 'group_stage' | 'gauntlet' | 'free_for_all';
  game: string;
  maxParticipants: number;
  registrationStart: string;
  registrationEnd: string;
  startDate: string;
  prizePool?: number;
  currency?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  status: string;
  participants: Array<{ id: string; name: string }>;
  scheduledAt?: string;
  completedAt?: string;
  winnerId?: string;
}

export interface Participant {
  id: string;
  tournamentId: string;
  userId: string;
  teamName?: string;
  status: string;
  registeredAt: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  status: string;
  createdAt: string;
}

export interface CreateWebhookDto {
  url: string;
  events: string[];
  secret: string;
  description?: string;
}

export interface ListOptions {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

class TournamentsResource {
  constructor(private readonly http: HttpClient, private readonly projectId: string) {}

  async list(options: ListOptions = {}): Promise<Tournament[]> {
    return this.http.get<Tournament[]>(`/projects/${this.projectId}/tournaments`, options);
  }

  async get(tournamentId: string): Promise<Tournament> {
    return this.http.get<Tournament>(`/projects/${this.projectId}/tournaments/${tournamentId}`);
  }

  async create(dto: CreateTournamentDto): Promise<Tournament> {
    return this.http.post<Tournament>(`/projects/${this.projectId}/tournaments`, dto);
  }

  async publish(tournamentId: string): Promise<void> {
    return this.http.post(`/projects/${this.projectId}/tournaments/${tournamentId}/publish`);
  }

  async generateBracket(tournamentId: string): Promise<void> {
    return this.http.post(`/projects/${this.projectId}/tournaments/${tournamentId}/bracket/generate`);
  }

  async getBracket(tournamentId: string): Promise<unknown> {
    return this.http.get(`/projects/${this.projectId}/tournaments/${tournamentId}/bracket`);
  }

  async getStandings(tournamentId: string): Promise<unknown> {
    return this.http.get(`/projects/${this.projectId}/tournaments/${tournamentId}/standings`);
  }
}

class MatchesResource {
  constructor(private readonly http: HttpClient, private readonly projectId: string) {}

  async list(tournamentId: string, options: ListOptions = {}): Promise<Match[]> {
    return this.http.get<Match[]>(`/projects/${this.projectId}/tournaments/${tournamentId}/matches`, options);
  }

  async get(matchId: string): Promise<Match> {
    return this.http.get<Match>(`/projects/${this.projectId}/matches/${matchId}`);
  }

  async submitResult(matchId: string, result: { winnerId: string; score?: Record<string, number> }): Promise<void> {
    return this.http.post(`/projects/${this.projectId}/matches/${matchId}/result`, result);
  }
}

class ParticipantsResource {
  constructor(private readonly http: HttpClient, private readonly projectId: string) {}

  async list(tournamentId: string, options: ListOptions = {}): Promise<Participant[]> {
    return this.http.get<Participant[]>(`/projects/${this.projectId}/tournaments/${tournamentId}/participants`, options);
  }

  async approve(tournamentId: string, participantId: string): Promise<void> {
    return this.http.post(`/projects/${this.projectId}/tournaments/${tournamentId}/participants/${participantId}/approve`);
  }

  async disqualify(tournamentId: string, participantId: string, reason: string): Promise<void> {
    return this.http.post(`/projects/${this.projectId}/tournaments/${tournamentId}/participants/${participantId}/disqualify`, { reason });
  }
}

class WebhooksResource {
  constructor(private readonly http: HttpClient, private readonly projectId: string) {}

  async list(): Promise<WebhookSubscription[]> {
    return this.http.get<WebhookSubscription[]>(`/projects/${this.projectId}/webhooks`);
  }

  async create(dto: CreateWebhookDto): Promise<WebhookSubscription> {
    return this.http.post<WebhookSubscription>(`/projects/${this.projectId}/webhooks`, dto);
  }

  async delete(webhookId: string): Promise<void> {
    return this.http.delete(`/projects/${this.projectId}/webhooks/${webhookId}`);
  }

  async test(webhookId: string): Promise<void> {
    return this.http.post(`/projects/${this.projectId}/webhooks/${webhookId}/test`);
  }
}

class HttpClient {
  constructor(private readonly config: Required<TournamentSuiteConfig>) {}

  private headers(): Record<string, string> {
    const auth = this.config.token
      ? `Bearer ${this.config.token}`
      : `Bearer ${this.config.apiKey}`;
    return {
      Authorization: auth,
      'Content-Type': 'application/json',
    };
  }

  async get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
    const res = await fetch(url.toString(), { headers: this.headers() });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  async post<T = void>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status} ${await res.text()}`);
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  async delete<T = void>(path: string): Promise<T> {
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status} ${await res.text()}`);
    return undefined as T;
  }
}

export class TournamentSuiteClient {
  readonly tournaments: TournamentsResource;
  readonly matches: MatchesResource;
  readonly participants: ParticipantsResource;
  readonly webhooks: WebhooksResource;

  private readonly http: HttpClient;

  constructor(config: TournamentSuiteConfig) {
    const resolved: Required<TournamentSuiteConfig> = {
      apiKey: config.apiKey ?? '',
      token: config.token ?? '',
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      projectId: config.projectId ?? '',
    };

    if (!resolved.apiKey && !resolved.token) {
      throw new Error('TournamentSuiteClient requires apiKey or token');
    }

    this.http = new HttpClient(resolved);
    this.tournaments = new TournamentsResource(this.http, resolved.projectId);
    this.matches = new MatchesResource(this.http, resolved.projectId);
    this.participants = new ParticipantsResource(this.http, resolved.projectId);
    this.webhooks = new WebhooksResource(this.http, resolved.projectId);
  }
}