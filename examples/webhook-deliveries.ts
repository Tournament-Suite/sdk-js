import { TournamentSuiteClient } from '@tournamentsuite/sdk';

const client = new TournamentSuiteClient({ apiKey: 'YOUR_API_KEY' });
const PROJECT_ID = 'YOUR_PROJECT_ID';
const WEBHOOK_ID = 'YOUR_WEBHOOK_ID';

async function checkDeliveries() {
  const deliveries = await client.webhooks.listDeliveries(PROJECT_ID, WEBHOOK_ID);

  const failed = deliveries.filter(d => d.status === 'failed' || d.status === 'retrying');
  const delivered = deliveries.filter(d => d.status === 'delivered');

  console.log(`Total: ${deliveries.length} | Delivered: ${delivered.length} | Failed/Retrying: ${failed.length}`);

  for (const d of failed) {
    console.log(`  FAILED [${d.id}] attempt ${d.attemptCount}/${d.maxRetries}`);
    if (d.httpResponse) {
      console.log(`    HTTP ${d.httpResponse.statusCode} in ${d.httpResponse.responseTimeMs}ms`);
    }
    if (d.error) {
      console.log(`    Error type: ${d.error.type}, retryable: ${d.error.retryable}`);
    }
    if (d.nextRetryAt) {
      console.log(`    Next retry: ${d.nextRetryAt}`);
    }
  }
}

checkDeliveries().catch(console.error);