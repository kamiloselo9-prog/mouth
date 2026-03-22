import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

export default async function handler(req, res) {
  console.log('--- [WEBHOOK] Endpoint hit ---');

  if (req.method !== 'POST') {
    console.log('[WEBHOOK] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payloadBuffer = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log(`[WEBHOOK] Secret configured: ${!!endpointSecret}, Signature present: ${!!sig}`);

  let event;
  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(payloadBuffer, sig, endpointSecret);
      console.log('[WEBHOOK] Signature verified successfully.');
    } else {
      console.log('[WEBHOOK] Warning: Falling back to JSON parse (No secret or signature).');
      event = JSON.parse(payloadBuffer.toString('utf8'));
    }
  } catch (err) {
    console.error(`[WEBHOOK] Error constructing event: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[WEBHOOK] Event type received: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    console.log('[WEBHOOK] Processing checkout.session.completed event...');
    const session = event.data.object;
    
    console.log('[WEBHOOK] Session details:', {
      id: session.id,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || session.customer_email
    });

    try {
      console.log('[WEBHOOK] Retrieving line items from Stripe...');
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      
      const lineItems = sessionWithLineItems.line_items.data;
      console.log(`[WEBHOOK] Retrieved ${lineItems.length} line items.`);
      
      const products = lineItems.filter(item => !item.description.startsWith('Dostawa:'));
      const productDescriptions = products.map(p => `${p.description} (Ilość: ${p.quantity})`).join('\n');
      
      const metadata = session.metadata || {};
      console.log('[WEBHOOK] Metadata extracted:', JSON.stringify(metadata));
      
      const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';
      
      const embed = {
        title: "🛒 Nowe zamówienie – Sleep Tape",
        color: 0x1A1A1A,
        fields: [
          {
            name: "Klient",
            value: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'Brak',
            inline: true
          },
          {
            name: "Email",
            value: metadata.email || 'Brak',
            inline: true
          },
          {
            name: "Telefon",
            value: metadata.phone || 'Brak',
            inline: true
          },
          {
            name: "Produkt",
            value: productDescriptions || 'Brak',
            inline: false
          },
          {
            name: "Kwota",
            value: `${amountTotal} zł`,
            inline: true
          },
          {
            name: "Dostawa",
            value: metadata.delivery_method || 'Brak',
            inline: true
          }
        ]
      };
      
      if (metadata.paczkomat_name) {
        embed.fields.push({
          name: "Paczkomat",
          value: `Nazwa: ${metadata.paczkomat_name}\nAdres: ${metadata.paczkomat_address}`,
          inline: false
        });
      } else if (metadata.street) {
        embed.fields.push({
          name: "Adres (Kurier)",
          value: `${metadata.street}\n${metadata.postal_code} ${metadata.city}`,
          inline: false
        });
      }

      console.log('[WEBHOOK] Before sending Discord notification...');
      await sendDiscordNotification(embed);

    } catch (err) {
      console.error('[WEBHOOK] Error handling checkout.session.completed:', err);
    }
  } else {
    console.log(`[WEBHOOK] Ignoring unhandled event type: ${event.type}`);
  }

  console.log('[WEBHOOK] Responding to Stripe with 200 OK');
  res.status(200).json({ received: true });
}

async function sendDiscordNotification(embed) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  console.log(`[DISCORD] Webhook configured: ${!!webhookUrl ? 'yes' : 'no'}`);
  
  if (!webhookUrl) {
    console.error('[DISCORD] No DISCORD_WEBHOOK_URL found in environment. Aborting.');
    return;
  }

  const payload = { embeds: [embed] };
  console.log('[DISCORD] Payload to send:', JSON.stringify(payload));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log(`[DISCORD] Response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.error(`[DISCORD] Failed with status ${response.status}. Body: ${text}`);
    } else {
      console.log('[DISCORD] Successfully sent Discord notification.');
    }
  } catch (error) {
    console.error('[DISCORD] Fetch request failed:', error);
  }
}
