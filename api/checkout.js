import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items, delivery, customerData, pointData } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: `Sleep Tape - ${item.amount} sztuk (${item.desc})`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (delivery && delivery.price > 0) {
       lineItems.push({
         price_data: {
           currency: 'pln',
           product_data: { name: `Dostawa: ${delivery.name}` },
           unit_amount: Math.round(delivery.price * 100),
         },
         quantity: 1
       });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const metadata = {
      delivery_method: delivery ? delivery.name : 'Nie wybrano',
      first_name: customerData?.firstName || '',
      last_name: customerData?.lastName || '',
      email: customerData?.email || '',
      phone: customerData?.phone || '',
    };

    if (delivery && delivery.id === 'courier') {
      metadata.street = customerData?.street || '';
      metadata.city = customerData?.city || '';
      metadata.postal_code = customerData?.postalCode || '';
    } else if (delivery && delivery.id === 'inpost' && pointData) {
      metadata.paczkomat_name = pointData.name || '';
      metadata.paczkomat_address = pointData.address || '';
      metadata.paczkomat_city = pointData.city || '';
    }

    const session = await stripe.checkout.sessions.create({
      // Using automatic_payment_methods ensures that Stripe only shows 
      // payment methods that are currently enabled in your Stripe Dashboard.
      // This solves the 'p24 is invalid' error when that method is disabled.
      automatic_payment_methods: { enabled: true },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/#success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#cart`,
      payment_intent_data: {
        metadata: metadata
      },
      metadata: metadata
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
