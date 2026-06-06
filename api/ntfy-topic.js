// Vercel serverless function — returns the ntfy topic for the admin panel setup UI
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json({ topic: process.env.NTFY_TOPIC || '' });
};
