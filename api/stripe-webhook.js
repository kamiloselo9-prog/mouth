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
  if (!resendApiKey) return;

  const { Resend } = await import('resend');
  const resend = new Resend(resendApiKey);

  const baseUrl = host ? `https://${host}` : 'https://sleeptape.pl';
  const trackUrl = order.deliveryMethod === 'Paczkomat InPost' 
    ? `https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}`
    : `${baseUrl}/#track`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#F7F6F4;color:#1A1A1A;margin:0;padding:0}.container{max-width:600px;margin:0 auto;padding:40px 20px}.header{text-align:center;margin-bottom:40px}.logo{font-size:24px;font-weight:bold;letter-spacing:.2em;color:#1A1A1A;text-decoration:none}.card{background-color:#fff;border-radius:24px;padding:40px;border:1px solid #E6E2DA;box-shadow:0 4px 12px rgba(0,0,0,.03)}h1{font-size:28px;font-weight:300;margin-bottom:16px;color:#1A1A1A}p{font-size:16px;line-height:1.6;color:#737373;margin-bottom:24px}.order-summary{background-color:#F9F8F6;border-radius:16px;padding:24px;margin-bottom:32px;border:1px solid #F0EFE9}.summary-item{display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px}.summary-label{color:#A3A3A3;font-weight:bold;text-transform:uppercase;font-size:10px;letter-spacing:.1em}.summary-value{color:#1A1A1A;font-weight:600}.tracking-box{text-align:center;padding:24px;border:2px dashed #E6E2DA;border-radius:16px;margin-bottom:32px}.tracking-label{font-size:11px;font-weight:bold;text-transform:uppercase;color:#A3A3A3;letter-spacing:.1em;margin-bottom:8px;display:block}.tracking-code{font-family:monospace;font-size:24px;font-weight:bold;color:#1A1A1A;letter-spacing:2px}.btn{display:inline-block;background-color:#1A1A1A;color:#fff!important;text-decoration:none;padding:18px 36px;border-radius:100px;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:.15em;text-align:center;width:100%;box-sizing:border-box}.footer{text-align:center;margin-top:40px;font-size:12px;color:#A3A3A3}</style></head><body><div class="container"><div class="header"><div class="logo">SLEEP TAPE</div></div><div class="card"><h1>Płatność potwierdzona.</h1><p>Cześć ${order.firstName}, dziękujemy za Twoje zaufanie. Twoje zamówienie zostało przyjęte i przekazane do realizacji. Przygotujemy Twoją paczkę Sleep Tape tak szybko, jak to możliwe.</p><div class="tracking-box"><span class="tracking-label">Twój numer śledzenia</span><span class="tracking-code">${order.trackingNumber}</span></div><div class="order-summary"><div class="summary-item"><span class="summary-label">Pakiet</span><span class="summary-value">${order.packageName}</span></div><div class="summary-item"><span class="summary-label">Ilość</span><span class="summary-value">${order.quantity}</span></div><div class="summary-item"><span class="summary-label">Dostawa</span><span class="summary-value">${order.deliveryMethod}</span></div><div class="summary-item" style="border-top:1px solid #EAE6DF;padding-top:12px;margin-top:12px"><span class="summary-label" style="color:#1A1A1A">Razem</span><span class="summary-value" style="font-size:18px">${order.totalAmount.toFixed(2).replace('.',',')} zł</span></div></div><a href="${trackUrl}" class="btn">Śledź paczkę</a></div><div class="footer"><p>Pozdrawiamy,<br>Zespół Sleep Tape</p><p style="font-size:10px">W razie pytań napisz do nas odpowiadając na ten e-mail.</p></div></div></body></html>`;

  try {
    await resend.emails.send({
      from: 'Sleep Tape <zamowienia@sleeptape.pl>',
      to: [order.email],
      subject: 'Dziękujemy za zamówienie – Sleep Tape',
      html: html,
    });
    console.log('[RESEND] Email sent successfully');
  } catch (error) {
    console.error('[RESEND] Failed to send email:', error);
  }
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
