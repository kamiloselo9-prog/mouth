import { createClient } from '@supabase/supabase-js';
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
    
    try {
      console.log('[WEBHOOK] Retrieving line items from Stripe...');
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      
      const lineItems = sessionWithLineItems.line_items.data;
      const products = lineItems.filter(item => !item.description.startsWith('Dostawa:'));
      const productDescriptions = products.map(p => `${p.description}`).join(' | ');
      const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
      
      const deliveryItem = lineItems.find(item => item.description.startsWith('Dostawa:'));
      const shippingCost = deliveryItem ? deliveryItem.amount_total / 100 : 0;
      
      const metadata = session.metadata || {};
      const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';
      
      // --- SUPABASE & TRACKING LOGIC ---
      console.log('[WEBHOOK] Preparing order data...');
      const trackingNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      const customerEmail = metadata.email || session.customer_details?.email;
      
      const orderData = {
        orderId: session.id,
        email: customerEmail,
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        phone: metadata.phone || '',
        packageName: productDescriptions,
        quantity: totalQuantity,
        deliveryMethod: metadata.delivery_method || 'Nieznana',
        shippingCost: shippingCost,
        totalAmount: parseFloat(amountTotal),
        inpostPointName: metadata.paczkomat_name || null,
        inpostPointAddress: metadata.paczkomat_address ? `${metadata.paczkomat_address}, ${metadata.paczkomat_city}` : null,
        courierAddress: metadata.street ? `${metadata.street}, ${metadata.postal_code} ${metadata.city}` : null,
        trackingNumber: trackingNumber,
        status: 'W trakcie realizacji',
        createdAt: new Date().toISOString()
      };

      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('orders').insert([orderData]);
        console.log('[SUPABASE] Successfully saved order to database');
      }

      // --- DISCORD LOGIC ---
      const embed = {
        title: "🛒 Nowe zamówienie – Sleep Tape",
        color: 0x1A1A1A,
        fields: [
          { name: "Klient", value: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'Brak', inline: true },
          { name: "Email", value: customerEmail || 'Brak', inline: true },
          { name: "Telefon", value: metadata.phone || 'Brak', inline: true },
          { name: "Produkt", value: products.map(p => `${p.description} (Ilość: ${p.quantity})`).join('\n') || 'Brak', inline: false },
          { name: "Kwota", value: `${amountTotal} zł`, inline: true },
          { name: "Dostawa", value: metadata.delivery_method || 'Brak', inline: true }
        ],
        footer: { text: `Numer śledzenia: ${trackingNumber}` }
      };
      
      if (metadata.paczkomat_name) {
        embed.fields.push({ name: "Paczkomat", value: `${metadata.paczkomat_name}\n${metadata.paczkomat_address}`, inline: false });
      } else if (metadata.street) {
        embed.fields.push({ name: "Adres (Kurier)", value: `${metadata.street}\n${metadata.postal_code} ${metadata.city}`, inline: false });
      }

      await sendDiscordNotification(embed);

      // --- RESEND EMAIL LOGIC ---
      if (customerEmail) {
        await sendConfirmationEmail(orderData, req.headers.host);
      }

    } catch (err) {
      console.error('[WEBHOOK] Error handling event:', err);
    }
  }

  res.status(200).json({ received: true });
}

async function sendConfirmationEmail(order, host) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromAddress = 'Sleep Tape <zamowienia@sleepfix.pl>';
  
  console.log('[RESEND] --- Email Sending Step Started ---');
  console.log('[RESEND] API Key exists:', !!resendApiKey);
  console.log('[RESEND] Recipient:', order.email);
  console.log('[RESEND] From address:', fromAddress);

  if (!resendApiKey) {
    console.error('[RESEND] ERROR: Missing RESEND_API_KEY in environment variables.');
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    const baseUrl = host ? `https://${host}` : 'https://sleepfix.pl';
    const trackUrl = order.deliveryMethod === 'Paczkomat InPost' 
      ? `https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}`
      : `${baseUrl}/#track`;

    const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dziękujemy za zamówienie – Sleep Tape</title>
  <style>
    body { background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    .container { max-width: 520px; margin: 0 auto; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .logo { text-align: center; font-size: 20px; font-weight: 700; letter-spacing: 0.3em; color: #1a1a1a; text-transform: uppercase; margin-bottom: 8px; }
    .header-sub { text-align: center; font-size: 13px; color: #86868b; letter-spacing: 0.05em; margin-bottom: 60px; }
    .title { text-align: center; font-size: 32px; font-weight: 600; color: #1d1d1f; line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.02em; }
    .subtitle { text-align: center; font-size: 16px; color: #515154; margin-bottom: 50px; line-height: 1.5; }
    .card { background-color: #f5f5f7; border-radius: 24px; padding: 40px; margin-bottom: 40px; text-align: center; }
    .label { font-size: 11px; font-weight: 700; color: #86868b; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; }
    .tracking-number { font-size: 28px; font-weight: 700; color: #1d1d1f; letter-spacing: 0.05em; margin-bottom: 12px; }
    .tracking-hint { font-size: 13px; color: #86868b; }
    .summary-card { padding: 8px 0; margin-bottom: 50px; border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; }
    .row { display: block; padding: 16px 0; overflow: hidden; }
    .row-label { float: left; font-size: 14px; color: #86868b; font-weight: 400; }
    .row-value { float: right; font-size: 14px; color: #1d1d1f; font-weight: 600; text-align: right; }
    .total-row { border-top: 1px solid #eeeeee; margin-top: 8px; padding-top: 24px; }
    .total-label { float: left; font-size: 16px; color: #1d1d1f; font-weight: 600; }
    .total-value { float: right; font-size: 22px; color: #1d1d1f; font-weight: 700; }
    .btn-container { text-align: center; margin: 50px 0; }
    .btn { background-color: #1d1d1f; color: #ffffff !important; text-decoration: none; padding: 22px 50px; border-radius: 999px; font-weight: 600; font-size: 14px; display: inline-block; letter-spacing: 0.08em; transition: opacity 0.2s; }
    .trust-section { text-align: center; padding-top: 20px; margin-bottom: 60px; }
    .trust-item { display: inline-block; font-size: 12px; color: #86868b; margin: 0 12px; }
    .footer { text-align: center; border-top: 1px solid #eeeeee; padding-top: 50px; }
    .footer-text { font-size: 13px; color: #86868b; line-height: 1.8; margin-bottom: 24px; }
    .signature { font-size: 14px; font-weight: 600; color: #1d1d1f; }
    @media only screen and (max-width: 480px) {
      .title { font-size: 26px; }
      .card { padding: 30px 20px; }
      .tracking-number { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Sleep Tape</div>
    <div class="header-sub">Dziękujemy za Twoje zamówienie</div>

    <h1 class="title">Twoje zamówienie zostało potwierdzone</h1>
    <p class="subtitle">Dziękujemy za zaufanie. Twoje zamówienie jest właśnie przygotowywane do wysyłki.</p>

    <div class="card">
      <div class="label">Numer śledzenia</div>
      <div class="tracking-number">${order.trackingNumber}</div>
      <div class="tracking-hint">Status przesyłki możesz sprawdzić w dowolnym momencie</div>
    </div>

    <div class="summary-card">
      <div class="row">
        <span class="row-label">Produkt</span>
        <span class="row-value">${order.packageName}</span>
      </div>
      <div class="row">
        <span class="row-label">Ilość</span>
        <span class="row-value">${order.quantity} szt.</span>
      </div>
      <div class="row">
        <span class="row-label">Dostawa</span>
        <span class="row-value">${order.deliveryMethod}</span>
      </div>
      <div class="row total-row">
        <span class="total-label">Razem</span>
        <span class="total-value">${order.totalAmount.toFixed(2).replace('.', ',')} zł</span>
      </div>
      <div style="clear: both;"></div>
    </div>

    <div class="btn-container">
      <a href="${trackUrl}" class="btn">ŚLEDŹ PACZKĘ</a>
    </div>

    <div class="trust-section">
      <span class="trust-item">✔ Bezpieczne płatności</span>
      <span class="trust-item">✔ Wysyłka w 24h</span>
      <span class="trust-item">✔ 14 dni na zwrot</span>
    </div>

    <div class="footer">
      <p class="footer-text">Masz pytania? Odpowiedz na tego maila – chętnie pomożemy. Przyjemnej regeneracji!</p>
      <div class="signature">Zespół Sleep Tape</div>
    </div>
  </div>
</body>
</html>
    `;

    console.log('[RESEND] Attempting to send email...');
    const result = await resend.emails.send({
      from: fromAddress,
      to: [order.email],
      subject: 'Dziękujemy za zamówienie – Sleep Tape',
      html: html,
    });

    console.log('[RESEND] Success Response:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('[RESEND] API returned an error:', JSON.stringify(result.error, null, 2));
    } else {
      console.log('[RESEND] Email sent successfully, ID:', result.data?.id);
    }

  } catch (error) {
    console.error('[RESEND] FATAL ERROR during sending process:');
    console.error(error);
    if (error.response) {
      console.error('[RESEND] Error Response Body:', error.response.body);
    }
  }
  console.log('[RESEND] --- Email Sending Step Finished ---');
}

async function sendDiscordNotification(embed) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
    console.log('[DISCORD] Notification sent');
  } catch (error) {
    console.error('[DISCORD] Notification failed:', error);
  }
}
