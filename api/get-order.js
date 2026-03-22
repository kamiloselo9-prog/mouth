import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, tracking } = req.query;

  if (!id && !tracking) {
    return res.status(400).json({ error: 'Missing order ID or tracking number' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let query = supabase.from('orders').select('*');

    if (id) {
      query = query.eq('orderId', id);
    } else {
      query = query.eq('trackingNumber', tracking);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return only public data for tracking if it's not a full session retrieval,
    // but for the success page it's usually fine to show more.
    return res.status(200).json(data);

  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
