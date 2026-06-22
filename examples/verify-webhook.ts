/**
 * Example: Verify a Tournament Suite webhook in an Express handler
 *
 * Install: npm install express @tournamentsuite/sdk
 */
import express from 'express';
import { parseWebhook, WebhookEventType } from '@tournamentsuite/sdk';

const app = express();

// Use raw body parser so we can verify the HMAC signature
app.use('/webhooks/tournamentsuite', express.raw({ type: 'application/json' }));

const WEBHOOK_SECRET = process.env.TS_WEBHOOK_SECRET ?? '';

app.post('/webhooks/tournamentsuite', (req, res) => {
  const rawBody = req.body.toString('utf-8');
  const timestamp = req.headers['x-ts-timestamp'] as string;
  const signature = req.headers['x-ts-signature'] as string;

  let payload;
  try {
    payload = parseWebhook(rawBody, {
      'x-ts-timestamp': timestamp,
      'x-ts-signature': signature,
    }, WEBHOOK_SECRET);
  } catch {
    res.status(401).json({ error: 'Invalid webhook signature' });
    return;
  }

  switch (payload.event) {
    case WebhookEventType.MATCH_COMPLETED:
      console.log('Match completed:', payload.data);
      break;
    case WebhookEventType.TOURNAMENT_STARTED:
      console.log('Tournament started:', payload.data);
      break;
    case WebhookEventType.PARTICIPANT_REGISTERED:
      console.log('Participant registered:', payload.data);
      break;
    default:
      console.log(`Unhandled event: ${payload.event}`, payload.data);
  }

  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook listener running on http://localhost:3000');
});