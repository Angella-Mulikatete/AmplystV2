// convex/influencers.ts
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const filterInfluencers = query({
  args: {
    niche: v.optional(v.string()),
    minFollowers: v.optional(v.number()),
    maxFollowers: v.optional(v.number()),
    minEngagement: v.optional(v.number()),
    maxEngagement: v.optional(v.number()),
    location: v.optional(v.string()),
    search: v.optional(v.string()),
    sortBy: v.optional(v.string()), // "followers", "engagement", etc.
    sortOrder: v.optional(v.string()), // "asc" or "desc"
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("profiles").filter(q => q.eq(q.field("role"), "influencer"));

    if (args.niche) {
      q = q.filter(q => q.eq(q.field("niche"), args.niche));
    }
    if (args.location) {
      q = q.filter(q => q.eq(q.field("location"), args.location));
    }
    if (args.minFollowers) {
      q = q.filter(q => q.gte(q.field("followerCount"), args.minFollowers!));
    }
    if (args.maxFollowers) {
      q = q.filter(q => q.lte(q.field("followerCount"), args.maxFollowers!));
    }

    let influencers = await q.collect();

    // Apply engagement rate filtering after collecting results
    if (args.minEngagement || args.maxEngagement) {
      influencers = influencers.filter(influencer => {
        const engagementRate = influencer.engagementRate || 0;
        if (args.minEngagement && engagementRate < args.minEngagement) return false;
        if (args.maxEngagement && engagementRate > args.maxEngagement) return false;
        return true;
      });
    }

    // Apply search filter after collecting results
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      influencers = influencers.filter(influencer => 
        influencer.name?.toLowerCase().includes(searchLower) ||
        influencer.handle?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (args.sortBy) {
      influencers = influencers.sort((a, b) => {
        const actualSortField = args.sortBy === "followers" ? "followerCount" : args.sortBy;

        // Cast 'a' and 'b' to a type that allows string indexing for dynamic property access
        const aIndexed = a as Record<string, unknown>;
        const bIndexed = b as Record<string, unknown>;

        const aValRaw = aIndexed[actualSortField!];
        const bValRaw = bIndexed[actualSortField!];

        // Convert values to numbers for comparison, handling undefined and string numbers
        const aVal = typeof aValRaw === 'string' ? parseFloat(aValRaw) : (aValRaw as number || 0);
        const bVal = typeof bValRaw === 'string' ? parseFloat(bValRaw) : (bValRaw as number || 0);

        if (args.sortOrder === "asc") return aVal - bVal;
        return bVal - aVal;
      });
    }

    return influencers;
  }
});


export const listInfluencers = query({
      args: {}, // Add filters later: niche, location, etc.
      handler: async (ctx) => {
        const influencers = await ctx.db
          .query("profiles")
          .filter((q) => q.eq(q.field("role"), "influencer"))
          .collect();
        return influencers;
      },
});

export const getInfluencerProfileByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Find the profile with the given userId and role === "influencer"
    const [profile] = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("role"), "influencer"))
      .collect();

    // Return the profile or null if not found
    return profile ?? null;
  },
});