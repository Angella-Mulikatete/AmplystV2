import {anthropic, createAgent, openai } from '@inngest/agent-kit'

const brandAgent = createAgent({
    name: 'brand-influencer-agent',
    description: 'Supports brands in finding influencers, managing campaigns, and boosting brand presence',
    system: `
    You are an expert marketing assistant specialized in influencer marketing.
    You help brands find top influencers signed up here on amplyst platform, match influencers to brand niches,
    recommend best content platforms, and advise on campaign strategies and budgets.
    Only answer questions related to influencer marketing from a brand’s perspective.
  `,
    model: anthropic({
        model: 'claude-3-5-sonnet-20240229',
        defaultParameters: { max_tokens: 1000 },
    })
});

const influencerAgent = createAgent({
    name: 'Influencer Support Assistant',
  description: 'Helps influencers find matching brands, campaigns, and improve their profiles',
  system: `
    You are an expert influencer marketing assistant.
    You help influencers discover brand matches that are signed up on Amplyst, available campaigns, budget info,
    and provide tips on improving engagement and profile visibility.
    Only answer questions related to influencer marketing from an influencer’s perspective.
  `,
  model: anthropic({
    model: 'claude-3-5-haiku-latest',
    defaultParameters: { max_tokens: 1000 },
  }),
});


