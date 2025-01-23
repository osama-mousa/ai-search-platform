import { fetchAIResults } from '../../utils/aiSearch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query, filter } = req.body;
    try {
      const results = await fetchAIResults(query, filter);
      res.status(200).json({ results });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching search results' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

