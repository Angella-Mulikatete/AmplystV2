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
        requirements: v.optional(v.string()),
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

      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand) return [];

      const campaigns = await ctx.db
        .query("campaigns")
        .withIndex("by_creatorUserId", q => q.eq("creatorUserId", brand._id))
        .collect();

      // Get applications for each campaign
      const campaignsWithApplications = await Promise.all(
        campaigns.map(async (campaign) => {
          const applications = await ctx.db
            .query("campaignApplications")
            .withIndex("by_campaignId", q => q.eq("campaignId", campaign._id))
            .collect();
          return {
            ...campaign,
            applications,
          };
        })
      );

      return campaignsWithApplications;
    },
  });

  export const getCampaignDetails = query({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args): Promise<Doc<"campaigns"> | null> => {
      return await ctx.db.get(args.campaignId);
    },
  });

  export const allCampaigns = query({
    handler: async (ctx) => {
      return await ctx.db.query("campaigns").collect();
    }
  });

  
  export const campaignsForInfluencer = query({
    handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) return [];
      // Assuming you have a campaignApplications table:
      const applications = await ctx.db.query("campaignApplications")
        .withIndex("by_influencerUserId", q => q.eq("influencerUserId", userId))
        .collect();
      const campaignIds = applications.map(app => app.campaignId);
      if (campaignIds.length === 0) {
        return []; // No campaign IDs, so no campaigns to return
      }
      return await ctx.db.query("campaigns")
        .filter(q => q.or(...campaignIds.map(id => q.eq(q.field("_id"), id))))
        .collect();
    }
  });


  export const activeForInfluencer = query({
    handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) return [];
      // Fetch applications where this influencer is 'active' (customize status as needed)
      const activeApplications = await ctx.db
        .query("campaignApplications")
        .withIndex("by_influencerUserId", q => q.eq("influencerUserId", userId))
        .filter(q => q.eq(q.field("status"), "active")) // or "accepted", depending on your schema
        .collect();
      const campaignIds = activeApplications.map(app => app.campaignId);
      if (campaignIds.length === 0) return [];
      // Fetch campaign details for these IDs
      return await ctx.db
        .query("campaigns")
        .filter(q => q.or(...campaignIds.map(id => q.eq(q.field("_id"), id))))
        .collect();
    }
  });

  export const getTotalApplicationsForMyCampaigns = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return 0;
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!user) return 0;

      const myCampaigns = await ctx.db
        .query("campaigns")
        .withIndex("by_creatorUserId", q => q.eq("creatorUserId", user._id))
        .collect();

      let totalApplications = 0;
      for (const campaign of myCampaigns) {
        const applications = await ctx.db
          .query("campaignApplications")
          .withIndex("by_campaignId", q => q.eq("campaignId", campaign._id))
          .collect();
        totalApplications += applications.length;
      }
      return totalApplications;
    }
  });

  export const campaignsByNiche = query({
    args: { niche: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("campaigns")
        .filter(q => q.eq(q.field("targetAudience"), args.niche))
        .collect();
    }
  });

  export const withdrawApplication = mutation({
    args: {
      campaignId: v.id("campaigns"),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Find influencer user
      const influencer = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!influencer) throw new Error("User not found");

      // Find the application
      const application = await ctx.db
        .query("campaignApplications")
        .withIndex("by_campaignId", q => q.eq("campaignId", args.campaignId))
        .filter(q => q.eq(q.field("influencerUserId"), influencer._id))
        .first();

      if (!application) throw new Error("No application found for this campaign");

      // Delete the application
      await ctx.db.delete(application._id);
      return true;
    }
  });

  export const applyToCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
      pitch: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Find influencer user
      const influencer = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!influencer) throw new Error("User not found");

      // Check for existing application
      const existing = await ctx.db
        .query("campaignApplications")
        .withIndex("by_campaignId", q => q.eq("campaignId", args.campaignId))
        .filter(q => q.eq(q.field("influencerUserId"), influencer._id))
        .first();

      if (existing) {
        // If there's an existing application, update it instead of creating a new one
        await ctx.db.patch(existing._id, {
          pitch: args.pitch,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        return existing._id;
      }

      // Create new application
      return await ctx.db.insert("campaignApplications", {
        campaignId: args.campaignId,
        influencerUserId: influencer._id,
        status: "pending",
        pitch: args.pitch,
        createdAt: new Date().toISOString(),
      });
    }
  });

  export const updateApplicationStatus = mutation({
    args: {
      applicationId: v.id("campaignApplications"),
      status: v.string(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Find the application
      const application = await ctx.db.get(args.applicationId);
      if (!application) throw new Error("Application not found");

      // Get the campaign to verify ownership
      const campaign = await ctx.db.get(application.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to update this application");
      }

      // Update the application status
      await ctx.db.patch(args.applicationId, {
        status: args.status,
      });

      return true;
    },
  });

  export const updateCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      budget: v.optional(v.number()),
      status: v.optional(v.string()),
      targetAudience: v.optional(v.string()),
      contentTypes: v.optional(v.array(v.string())),
      duration: v.optional(v.string()),
      requirements: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Get the campaign
      const campaign = await ctx.db.get(args.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to update this campaign");
      }

      // Remove campaignId from args before updating
      const { campaignId, ...updateData } = args;

      // Update the campaign
      await ctx.db.patch(args.campaignId, updateData);
      return true;
    },
  });

  export const deleteCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Get the campaign
      const campaign = await ctx.db.get(args.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to delete this campaign");
      }

      // Delete all applications for this campaign first
      const applications = await ctx.db
        .query("campaignApplications")
        .withIndex("by_campaignId", q => q.eq("campaignId", args.campaignId))
        .collect();

      for (const application of applications) {
        await ctx.db.delete(application._id);
      }

      // Delete the campaign
      await ctx.db.delete(args.campaignId);
      return true;
    },
  });

  export const extendCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
      newEndDate: v.string(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Get the campaign
      const campaign = await ctx.db.get(args.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to extend this campaign");
      }

      // Update the campaign end date
      await ctx.db.patch(args.campaignId, {
        endDate: args.newEndDate,
      });
      return true;
    },
  });

  // Function to check for expired campaigns
  export const checkExpiredCampaigns = mutation({
    handler: async (ctx) => {
      const now = new Date().toISOString();
      
      // Find all active campaigns that have expired
      const expiredCampaigns = await ctx.db
        .query("campaigns")
        .filter(q => 
          q.and(
            q.eq(q.field("status"), "active"),
            q.lt(q.field("endDate"), now)
          )
        )
        .collect();

      // Update expired campaigns to "expired" status
      for (const campaign of expiredCampaigns) {
        await ctx.db.patch(campaign._id, {
          status: "expired"
        });
      }

      return expiredCampaigns.length;
    },
  });