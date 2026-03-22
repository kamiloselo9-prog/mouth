import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD || process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  
  // Use regex to parse cookies safely without extra libs if needed (already installed cookie, but here we read it)
  const cookies = (req.headers.cookie || '').split(';').reduce((acc, c) => {
    const [key, val] = c.trim().split('=');
    acc[key] = val;
    return acc;
  }, {});

  const sessionPassword = cookies['admin_session'];

  if (!adminPassword || (providedPassword !== adminPassword && sessionPassword !== adminPassword)) {
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

    const trimmedId = id.trim();
    console.log(`[ADMIN-UPDATE] Attempting to update order: ${trimmedId}`);

    try {
      const updateData = {};
      if (status) updateData.status = status;
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
      if (note !== undefined) updateData.note = note;

      const { data, error, count } = await supabase
        .from('orders')
        .update(updateData)
        .eq('orderId', trimmedId)
        .select();

      if (error) {
        console.error('[SUPABASE-ERROR]', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn(`[ADMIN-UPDATE] No order found with ID: ${trimmedId}`);
        return res.status(404).json({ error: 'Nie znaleziono zamówienia w bazie' });
      }

      console.log(`[ADMIN-UPDATE] Successfully updated ${data.length} row(s)`);
      return res.status(200).json(data[0]);
    } catch (err) {
      console.error('Admin update error:', err);
      return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji zamówienia' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
