// convex/stats.ts
import { query } from "./_generated/server";

export const getStats = query({
  handler: async (ctx) => {
    // Influencers count
    const influencers = await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("role"), "influencer"))
      .collect();
    const influencerCount = influencers.length;

    // Campaigns count
    const campaigns = await ctx.db.query("campaigns").collect();
    const campaignsCount = campaigns.length;

    // Total paid out
    // const payments = await ctx.db
    //   .query("payments")
    //   .filter(q => q.eq(q.field("status"), "paid"))
    //   .collect();
    // const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Average rating (not in schema, so we'll mock)
    // If you add a ratings table, calculate the average here
    const avgRating = 4.8; // Placeholder

    return {
      influencerCount,
      campaignsCount,
      //totalPaid,
      avgRating,
      // You can add more stats as needed
    };
  }
});
