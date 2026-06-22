// Tournament Suite SDK — Type Definitions
// Based on @tournamentsuite/shared-types

export type TournamentStatus = 'draft' | 'registration' | 'checkin' | 'ongoing' | 'completed' | 'cancelled';
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'swiss' | 'round_robin' | 'ffa' | 'group_stage' | 'gauntlet';
export type TournamentType = 'individual' | 'team';
export type MatchStatus = 'pending' | 'ongoing' | 'completed' | 'cancelled' | 'bye';
export type ParticipantStatus = 'pending' | 'accepted' | 'refused' | 'cancelled' | 'waitlisted';
export type WebhookDeliveryStatus = 'pending' | 'delivered' | 'failed' | 'retrying' | 'expired';
export type WebhookCircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  status: TournamentStatus;
  format: TournamentFormat;
  type: TournamentType;
  maxParticipants: number;
  participantCount: number;
  checkedInCount: number;
  startDate: string;
  endDate?: string;
  registrationDeadline: string;
  entryFee?: number;
  prizePool?: number;
  currency?: string;
  isPublic: boolean;
  featured?: boolean;
  allowSpectators: boolean;
  disciplineId?: string;
  organizerId: string;
  projectId?: string;
  bannerUrl?: string;
  logoUrl?: string;
  streamUrl?: string;
  region?: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface MatchOpponent {
  number: number;
  participantId?: string;
  score?: number;
  result?: 'win' | 'loss' | 'draw' | null;
  winner?: boolean;
  forfeit?: boolean;
}

export interface MatchGame {
  id: string;
  matchId: string;
  number: number;
  status: string;
  map?: string;
  score1?: number;
  score2?: number;
  winnerId?: string;
  duration?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  stageId?: string;
  groupId?: string;
  roundId?: string;
  number?: number;
  type?: string;
  format?: string;
  status: MatchStatus;
  scheduledAt?: string;
  playedAt?: string;
  opponents: MatchOpponent[];
  winnerId?: string;
  bestOf?: number;
  streamUrl?: string;
  vodUrl?: string;
  games?: MatchGame[];
}

export interface Participant {
  id: string;
  tournamentId: string;
  name: string;
  type?: 'individual' | 'team';
  status: ParticipantStatus;
  seed?: number;
  currentPosition?: number;
  finalPosition?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  points?: number;
  matchesPlayed?: number;
  userId?: string;
  logoUrl?: string;
  rating?: number;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  role?: string;
  country?: string;
  createdAt: string;
}

export interface Circuit {
  id: string;
  name: string;
  slug: string;
  status: string;
  game?: string;
  disciplineId?: string;
  region?: string;
  tier?: string;
  organizerId: string;
  startDate?: string;
  endDate?: string;
  participantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CircuitStanding {
  rank: number;
  participantId: string;
  participantName: string;
  points: number;
  wins: number;
  losses: number;
  tournamentsPlayed: number;
}

export interface ApiKey {
  id: string;
  projectId: string;
  name: string;
  keyPrefix: string;
  keyHint?: string;
  scopes: string[];
  status: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
}

export interface ApiKeySecret extends ApiKey {
  secret: string;
  rotatedFromKeyId?: string;
}

export interface CreateApiKeyDto {
  name: string;
  scopes: string[];
  expiresInDays?: number;
}

export interface WebhookSubscription {
  id: string;
  projectId?: string;
  name: string;
  url: string;
  description?: string;
  events: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookDto {
  name: string;
  url: string;
  events: string[];
  description?: string;
  secret?: string;
}

export interface UpdateWebhookDto {
  name?: string;
  url?: string;
  events?: string[];
  description?: string;
  secret?: string;
  active?: boolean;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventType: string;
  aggregateId?: string;
  aggregateType?: string;
  status: WebhookDeliveryStatus;
  attemptCount: number;
  maxRetries: number;
  lastAttemptAt?: string;
  completedAt?: string;
  nextRetryAt?: string;
  httpResponse?: {
    statusCode: number;
    statusText: string;
    responseTimeMs: number;
    body?: string;
  };
  error?: {
    code: string;
    message: string;
    type: 'network' | 'timeout' | 'authentication' | 'validation' | 'server' | 'client' | 'unknown';
    retryable: boolean;
  };
}

export interface WebhookTestResult {
  success: boolean;
  deliveryId?: string;
  responseTime?: number;
  statusCode?: number;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface MatchEngagement {
  spectatorCount: number;
  predictionsOpen: boolean;
  pollActive: boolean;
  streamAvailable: boolean;
  featureFlags: Record<string, boolean>;
}

export interface MatchQueue {
  id: string;
  name: string;
  disciplineId?: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedWaitMs?: number;
  playersInQueue: number;
  status: 'active' | 'inactive' | 'full';
}

export interface CompleteMatchDto {
  score1: number;
  score2: number;
  winnerId?: string;
  forfeit?: boolean;
  games?: Array<{ map?: string; score1: number; score2: number }>;
}