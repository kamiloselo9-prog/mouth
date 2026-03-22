import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

  const debug = {
    urlPresent: !!supabaseUrl,
    keyPresent: !!supabaseKey,
    error: null,
    data: null
  };

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      message: 'Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY w Vercel.',
      debug
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Prosta próba pobrania 1 wiersza z tabeli 'orders' (lub check czy tabela istnieje)
    const { data, error } = await supabase
      .from('orders')
      .select('count', { count: 'exact', head: true });

    if (error) {
      debug.error = error;
      return res.status(400).json({
        success: false,
        message: 'Połączenie nawiązane, ale wystąpił błąd bazy (prawdopodobnie brak tabeli orders).',
        debug
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase jest poprawnie połączony i widzi tabelę orders!',
      count: data
    });

  } catch (err) {
    debug.error = err.message;
    return res.status(500).json({
      success: false,
      message: 'Błąd krytyczny podczas inicjalizacji Supabase.',
      debug
    });
  }
}
