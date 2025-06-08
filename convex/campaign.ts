import { mutation, query } from "./_generated/server";
    import { v } from "convex/values";
    import { getAuthUserId } from "@convex-dev/auth/server";
    import { Doc, Id } from "./_generated/dataModel";

    export const createCampaign = mutation({
      args: {
        role: v.union(
          v.literal("influencer"),
          v.literal("brand"),
          v.literal("agency"),
        ),
        title: v.string(),
        description: v.string(),
        budget: v.optional(v.number()),
        status: v.string(), // e.g., "draft", "active"
        targetAudience: v.optional(v.string()),
        contentTypes: v.optional(v.array(v.string())),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        duration: v.optional(v.string()),
      },
      handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log("Creating campaign with args:", args);

        if (!identity) throw new Error("Not authenticated");

        let user = await ctx.db
          .query("users")
          .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
          .unique();
       

         // 3. If user doesn't exist, create them
        if (!user) {
          const newUserId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email!,
            role: args.role,
          });

          console.log("New user created in campaign with ID:", newUserId);

          user = await ctx.db.get(newUserId);
          if (!user) {
            throw new Error("Failed to retrieve newly created user");
          }
        }

       // if (!user) throw new Error("User not found");

        return await ctx.db.insert("campaigns", {
          creatorUserId: user._id,
          ...args,
        });
      },
    });

  export const listMyCampaigns = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!user) return [];
      return await ctx.db
        .query("campaigns")
        .withIndex("by_creatorUserId", q => q.eq("creatorUserId", user._id))
        .collect();
    }
  });

  export const getCampaignDetails = query({
      args: { campaignId: v.id("campaigns") },
      handler: async (ctx, args): Promise<Doc<"campaigns"> | null> => {
        return await ctx.db.get(args.campaignId);
      },
  });
