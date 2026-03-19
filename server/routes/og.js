const { Router } = require('express');
const cheerio = require('cheerio');

const router = Router();

// GET /api/og?url=https://...
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url is required' });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WishListBot/1.0)',
        'Accept': 'text/html',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.json({ image: null, title: null });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      null;

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="og:title"]').attr('content') ||
      $('title').text() ||
      null;

    res.json({ image, title });
  } catch (err) {
    console.warn('OG fetch error:', err.message);
    res.json({ image: null, title: null });
  }
});

module.exports = router;
