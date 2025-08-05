import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/ai-match', async (req, res) => {
  const { campaign, influencers } = req.body;
  
    const prompt = `
    You are an influencer marketing assistant.
    Given this campaign:
    ${JSON.stringify(campaign, null, 2)}
    And these influencers:
    ${JSON.stringify(influencers, null, 2)}
    Rank and recommend the top 5 most relevant influencers for this campaign, considering niche, audience, engagement, and location.
    Return an array of influencer IDs.
`;
  
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 512
  });

  // Parse response
  const ids = JSON.parse(completion.choices[0].message.content || '[]');
  res.json({ influencerIds: ids });
});

app.listen(3000, () => {
  console.log('AI Server running on port 3001');
});
