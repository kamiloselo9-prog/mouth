import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];

  if (!adminPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      console.error('Admin fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status, trackingNumber, note } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    try {
      const updateData = {};
      if (status) updateData.status = status;
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
      if (note !== undefined) updateData.note = note;

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('orderId', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      console.error('Admin update error:', err);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
