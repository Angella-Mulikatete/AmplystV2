// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import { OpenAI } from 'openai';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const app = express();
// app.use(cors());
// app.use(express.json());


// const OPENAI_API_KEY = "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";
// const GEMINI_API_KEY = "AIzaSyCCbHxYHatc8c6jNWvwW3EBxsy47YUXh24";
// const openaiClient = new OpenAI({
//   apiKey: OPENAI_API_KEY
// });
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// app.post('/api/ai-match', async (req, res) => {
//   const { campaign, influencers } = req.body;
  
//     const prompt = `
//     You are an influencer marketing assistant.
//     Given this campaign:
//     ${JSON.stringify(campaign, null, 2)}
//     And these influencers:
//     ${JSON.stringify(influencers, null, 2)}
//     Rank and recommend the top 5 most relevant influencers for this campaign, considering niche, audience, engagement, and location.
//     Return an array of influencer IDs.
// `;
  
//   const completion = await openaiClient.chat.completions.create({
//     model: 'gpt-4-turbo',
//     messages: [{ role: 'user', content: prompt }],
//     max_tokens: 512
//   });

//   // Parse response
//   const ids = JSON.parse(completion.choices[0].message.content || '[]');
//   res.json({ influencerIds: ids });
// });

// app.listen(3001, () => {
//   console.log('AI Server running on port 3001');
// });



import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const app = express();
app.use(cors());
app.use(express.json());

// Configure Genkit with Gemini model
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash', // or 'googleai/gemini-1.5-pro-preview-0409'
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

  try {
    // Run the prompt using Genkit
    const result = await ai.run(prompt);
    // Genkit returns a string, so parse as needed
    let ids = [];
    try {
      ids = JSON.parse(result);
    } catch (e) {
      // Try to extract array from text
      const match = result.match(/\[.*\]/s);
      if (match) ids = JSON.parse(match[0]);
    }
    res.json({ influencerIds: ids });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Genkit Gemini AI Server running on port 3001');
});
