// // convex/brands.ts
// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // Create or update brand profile
// export const insertBrandProfile = mutation({
//   args: {
//     companyName: v.string(), // Changed from brandName to companyName
//     industry: v.string(),
//     website: v.optional(v.string()),
//     businessEmail: v.string(),
//     contactPerson: v.string(),
//     location: v.optional(v.string()),
//     description: v.optional(v.string()),
//     campaignGoal: v.optional(v.string()),
//     targetAudience: v.optional(v.string()),
//     influencerType: v.optional(v.string()),
//     influencerNiche: v.optional(v.string()),
//     budgetRange: v.optional(v.string()),
//     contentType: v.optional(v.string()),
//     campaignDescription: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Not authenticated");

//     // Find or create user
//     let user = await ctx.db
//       .query("users")
//       .withIndex("by_email", (q) => q.eq("email", identity.email!))
//       .unique();
//     if (!user) {
//       const newUserId = await ctx.db.insert("users", {
//         tokenIdentifier: identity.tokenIdentifier,
//         email: identity.email!,
//         role: "brand",
//       });
//       user = await ctx.db.get(newUserId);
//       if (!user) throw new Error("Failed to create user");
//     }

//     // Upsert brand profile
//     const existing = await ctx.db
//       .query("brands")
//       .withIndex("by_userId", (q) => q.eq("userId", user._id))
//       .first();

//     if (existing) {
//       await ctx.db.patch(existing._id, { ...args });
//       return existing._id;
//     } else {
//       return await ctx.db.insert("brands", {
//           userId: user._id,
//           ...args,
//       });
//     }
//   },
// });

// // Query to get current brand profile
// export const getMyBrandProfile = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_email", (q) => q.eq("email", identity.email!))
//       .unique();
//     if (!user) return null;
//     return await ctx.db
//       .query("brands")
//       .withIndex("by_userId", (q) => q.eq("userId", user._id))
//       .first(); // Changed to .first() to handle potential existing duplicates
//   },
// });




// convex/brands.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Insert or update a brand profile for the current user
export const upsertBrandProfile = mutation({
  args: {
    companyName: v.string(),
    industry: v.string(),
    website: v.optional(v.string()),
    businessEmail: v.string(),
    contactPerson: v.string(),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    campaignGoal: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    influencerType: v.optional(v.string()),
    influencerNiche: v.optional(v.string()),
    budgetRange: v.optional(v.string()),
    contentType: v.optional(v.string()),
    campaignDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email!,
        role: "brand",
      });
      user = await ctx.db.get(newUserId);
      if (!user) throw new Error("Failed to create user");
    }

    // Upsert brand profile: patch if exists, insert if not
    const existing = await ctx.db
      .query("brands")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
      return existing._id;
    } else {
      return await ctx.db.insert("brands", {
        userId: user._id,
        ...args,
      });
    }
  },
});

// Query to get the current user's brand profile
export const getMyBrandProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    if (!user) return null;
    return await ctx.db
      .query("brands")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});
