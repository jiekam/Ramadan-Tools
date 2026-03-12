import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

const PORT = process.env.PORT || 8787;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn(
    '[server] Missing GROQ_API_KEY. Create a .env with GROQ_API_KEY=... to enable AI Todo.'
  );
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/news', async (req, res) => {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=ramadhan+OR+puasa+OR+islam+OR+masjid&hl=id&gl=ID&ceid=ID:id';
    const response = await fetch(RSS_URL);
    if (!response.ok) throw new Error('API fetch failed');
    const text = await response.text();
    res.type('application/xml');
    res.send(text);
  } catch (error) {
    console.error('[server] /api/news error:', error);
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
});

app.post('/api/ai-todo', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Server missing GROQ_API_KEY' });
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            `Kamu adalah asisten AI yang membuat todo list khusus (Ramadhan diutamakan).`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = (response.choices?.[0]?.message?.content || '').trim();
    const jsonMatch = content.match(/\[.*\]/s);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    if (!Array.isArray(parsed)) {
      return res.status(500).json({ error: 'AI response is not an array' });
    }

    const cleaned = parsed
      .filter((x) => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 6);

    return res.json({ todos: cleaned });
  } catch (err) {
    console.error('[server] /api/ai-todo error:', err);
    return res.status(500).json({
      error: 'Failed to generate todo list',
    });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});


