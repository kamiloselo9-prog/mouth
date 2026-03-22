export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  const debugInfo = {
    webhookConfigured: !!webhookUrl,
    message: ''
  };

  if (!webhookUrl) {
    debugInfo.message = 'DISCORD_WEBHOOK_URL is missing in environment variables.';
    return res.status(500).json(debugInfo);
  }

  const embed = {
    title: "🔧 Testowe zamówienie (Test Discord Webhook)",
    color: 0x00FF00,
    description: "Jeśli widzisz tę wiadomość, webhook na Discordzie działa poprawnie!",
    fields: [
      {
        name: "Wiadomość testowa",
        value: "Zmienne środowiskowe odczytywane są bez przeszkód.",
        inline: false
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!response.ok) {
      const text = await response.text();
      debugInfo.message = `Discord returned ${response.status}: ${text}`;
      return res.status(500).json(debugInfo);
    }

    debugInfo.message = 'Successfully sent test message to Discord.';
    return res.status(200).json(debugInfo);
  } catch (err) {
    debugInfo.message = `Fetch error: ${err.message}`;
    return res.status(500).json(debugInfo);
  }
}
