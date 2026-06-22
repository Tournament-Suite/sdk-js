export { TournamentSuiteClient } from './client.js';
export type {
  TournamentSuiteConfig,
  Tournament,
  CreateTournamentDto,
  Match,
  Participant,
  WebhookSubscription,
  CreateWebhookDto,
  ListOptions,
} from './client.js';

export { TournamentSuiteRealtime } from './realtime.js';
export type {
  RealtimeConfig,
  MatchUpdateEvent,
  TournamentUpdateEvent,
  ParticipantUpdateEvent,
} from './realtime.js';

export {
  verifyWebhookSignature,
  parseWebhook,
  WebhookEventType,
} from './webhooks.js';
export type { WebhookPayload, VerifyOptions, WebhookEventType as WebhookEventTypeValue } from './webhooks.js';