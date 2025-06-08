import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import bcrypt from "bcryptjs";
import { api } from "./_generated/api";


export const getMyProfile = query({
  handler: async (ctx): Promise<Doc<"profiles"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
      return profile;
  },
});


export const insertProfile = mutation({
  args: {
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency"),
    ),
    name: v.string(),
    bio: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    niche: v.optional(v.string()),
    location: v.optional(v.string()),
    followerCount: v.optional(v.number()),
    socialAccounts: v.optional(
      v.object({
        instagram: v.string(),
        tiktok: v.string(),
        youtube: v.string(),
        twitter: v.string(),
      })
    ),
    portfolio: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    try {

      // 1. Get Clerk identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("User not authenticated");
      console.log("User identity:", identity);

      // 2. Find user by email
      let user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email!))
        .unique();

      // 3. If user doesn't exist, create them
      if (!user) {
        const newUserId = await ctx.db.insert("users", {
          tokenIdentifier: identity.tokenIdentifier,
          email: identity.email!,
          role: args.role,
        });
        user = await ctx.db.get(newUserId);
        if (!user) {
          throw new Error("Failed to retrieve newly created user");
        }
      }

      // 4. Query profile by userId (_id)
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();

      console.log("Existing profile:", existingProfile);

      if (existingProfile) {
        await ctx.db.patch(existingProfile._id, {
          ...args,
          userId: user._id,
        });
        return existingProfile._id;
      } else {
        console.log("Creating new profile for user:", user._id);
        const profileId = await ctx.db.insert("profiles", {
          userId: user._id,
          ...args,
        });
        console.log("New profile created with ID:", profileId);
        return profileId;
      }
    } catch (error) {
      console.error("Error inserting profile:", error);
      throw error; 
    }
  },
});



export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

    // Extract role from Clerk public metadata
    if (typeof identity.publicMetadata !== 'object' || identity.publicMetadata === null) {
      throw new Error("User identity public metadata is missing or malformed");
    }

    const publicMetadata = (identity.unsafeMetadata ?? identity.publicMetadata) as { role?: "influencer" | "brand" | "agency" };

    if (!publicMetadata.role) {
      throw new Error("User role is missing in public metadata");
    }

    const role = publicMetadata.role;

    // Check if the user already exists
    console.log("createOrGetUser: Checking for existing user with tokenIdentifier:", identity.tokenIdentifier);
    const user = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();

    if (user) {
      console.log("createOrGetUser: User already exists, returning ID:", user._id);
      return user._id;
    }

    // If the user doesn't exist, create a new one
    console.log("createOrGetUser: Creating new user with tokenIdentifier:", identity.tokenIdentifier);
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      role
    });

    return userId;
  },
});

export const getInfluencerProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("getInfluencerProfile identity in the getInfluencerProfile:", identity);
    if (!identity) return null;
    
    // Get user
    console.log("getInfluencerProfile: Querying user with tokenIdentifier:", identity.tokenIdentifier);
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
      
    console.log("getInfluencerProfile: User found:", user);
    if (!user) {
      console.log("getInfluencerProfile: User not found for tokenIdentifier:", identity.tokenIdentifier);
      return null;
    }
    
    
    // Get profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();
      console.log("profile in the getInfluencerProfile:", profile);
      
    return profile;
  }
});

export const getMyRole = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    return user?.role ?? null;
  }
});

export const hasCompletedOnboarding = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return false;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();
    return !!profile;
  }
});


export const checkInfluencerProfile = mutation({
  args: { identifier: v.string() }, // username or email
  handler: async (ctx, { identifier }) => {
    // Find user by username or email
    const user = await ctx.db
      .query("users")
      .filter(q =>
        q.or(
          q.eq(q.field("username"), identifier),
          q.eq(q.field("email"), identifier)
        )
      )
      .unique();
    if (!user) return false;

    // Check if profile exists for this user
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();

    return !!profile;
  }
});

export const getUserByIdentifier = query({
  args: { identifier: v.string() },
  handler: async (ctx, { identifier }) => {
    const user = await ctx.db
      .query("users")
      .filter(q =>
        q.or(
          q.eq(q.field("username"), identifier),
          q.eq(q.field("email"), identifier)
        )
      )
      .unique();
    return user;
  }
});

export const getUserRoleByIdentifier = action({
  args: { identifier: v.string() }, // username or email
  handler: async (
    ctx,
    { identifier }
  ): Promise<{ role: "influencer" | "brand" | "agency"; exists: boolean } | null> => {
    const user = await ctx.runQuery(api.users.getUserByIdentifier, { identifier });
    if (!user) return null;
    return { role: user.role, exists: true };
  },
});


