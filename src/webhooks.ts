import crypto from 'crypto';

export const WebhookEventType = {
  TOURNAMENT_CREATED: 'tournament.created',
  TOURNAMENT_PUBLISHED: 'tournament.published',
  TOURNAMENT_STARTED: 'tournament.started',
  TOURNAMENT_COMPLETED: 'tournament.completed',
  TOURNAMENT_CANCELLED: 'tournament.cancelled',
  TOURNAMENT_UPDATED: 'tournament.updated',
  MATCH_CREATED: 'match.created',
  MATCH_STARTED: 'match.started',
  MATCH_COMPLETED: 'match.completed',
  MATCH_DISPUTED: 'match.disputed',
  MATCH_RESCHEDULED: 'match.rescheduled',
  MATCH_FORFEITED: 'match.forfeited',
  PARTICIPANT_REGISTERED: 'participant.registered',
  PARTICIPANT_APPROVED: 'participant.approved',
  PARTICIPANT_REJECTED: 'participant.rejected',
  PARTICIPANT_CHECKED_IN: 'participant.checked_in',
  PARTICIPANT_ELIMINATED: 'participant.eliminated',
  PARTICIPANT_DISQUALIFIED: 'participant.disqualified',
  REGISTRATION_OPENED: 'registration.opened',
  REGISTRATION_CLOSED: 'registration.closed',
  REGISTRATION_FULL: 'registration.full',
  PAYMENT_RECEIVED: 'payment.received',
  PAYOUT_PROCESSED: 'payout.processed',
  PAYOUT_FAILED: 'payout.failed',
  BROADCAST_STARTED: 'broadcast.started',
  BROADCAST_ENDED: 'broadcast.ended',
  CIRCUIT_CREATED: 'circuit.created',
  CIRCUIT_SEASON_STARTED: 'circuit.season.started',
  CIRCUIT_SEASON_COMPLETED: 'circuit.season.completed',
  USER_CREATED: 'user.created',
  USER_VERIFIED: 'user.verified',
  USER_SUSPENDED: 'user.suspended',
} as const;

export type WebhookEventType = (typeof WebhookEventType)[keyof typeof WebhookEventType];

export interface WebhookPayload<T = unknown> {
  event: WebhookEventType;
  timestamp: string;
  data: T;
}

export interface VerifyOptions {
  /** Maximum age of a webhook event in seconds (default: 300) */
  maxAge?: number;
}

/**
 * Verify a Tournament Suite webhook signature.
 *
 * @param rawBody   Raw request body string (before JSON.parse)
 * @param timestamp Value of X-TS-Timestamp header
 * @param signature Value of X-TS-Signature header
 * @param secret    Webhook signing secret from your subscription
 */
export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string,
  options: VerifyOptions = {}
): boolean {
  const maxAge = options.maxAge ?? 300;
  const ts = parseInt(timestamp, 10);

  if (isNaN(ts)) return false;

  const age = Math.floor(Date.now() / 1000) - ts;
  if (age > maxAge || age < -30) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected =
    'sha256=' +
    crypto.createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Parse and verify a Tournament Suite webhook request.
 * Throws if the signature is invalid.
 */
export function parseWebhook<T = unknown>(
  rawBody: string,
  headers: { 'x-ts-timestamp': string; 'x-ts-signature': string },
  secret: string,
  options?: VerifyOptions
): WebhookPayload<T> {
  const valid = verifyWebhookSignature(
    rawBody,
    headers['x-ts-timestamp'],
    headers['x-ts-signature'],
    secret,
    options
  );

  if (!valid) {
    throw new Error('Invalid webhook signature');
  }

  return JSON.parse(rawBody) as WebhookPayload<T>;
}