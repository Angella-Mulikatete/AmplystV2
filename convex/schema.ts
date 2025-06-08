import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define potential statuses for an email
const emailStatus = v.union(
  v.literal("draft"),
  v.literal("scheduled"),
  v.literal("sending"), // Optional: If sending can take time and needs tracking
  v.literal("sent"),
  v.literal("failed")
);

const applicationTables = {
  users: defineTable({
    tokenIdentifier:v.optional(v.string()), // Identifier from auth provider
    email: v.string(),                 // User's email address
    username: v.optional(v.string()),  // User's chosen username
    passwordHash: v.optional(v.string()), // Hashed password (never store plain passwords!)
    // firstName: v.optional(v.string()), // Optional first name
    // lastName: v.optional(v.string()),  // Optional last name
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency")
    ),
  })
  .index("by_token", ["tokenIdentifier"]) // Essential for auth lookup
  .index("by_email", ["email"]),  
      
  profiles : defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency")
    ),
    name: v.string(),
    bio: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    // Influencer-specific fields
    niche: v.optional(v.string()),
    location: v.optional(v.string()),
    followerCount: v.optional(v.number()), // Changed to number
    engagementRate: v.optional(v.number()), // Added engagementRate
    socialAccounts: v.optional(
      v.object({
        instagram: v.string(),
        tiktok: v.string(),
        youtube: v.string(),
        twitter: v.string(),
      })
    ),
    portfolio: v.optional(v.array(v.any())),
    primaryPlatform: v.optional(v.string()), // Add this line
    // Brand/agency-specific fields
    companyName: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  campaigns : defineTable({
    creatorUserId: v.id("users"), // Brand or agency user
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency")
    ),
    title: v.string(),
    description: v.string(),
    budget: v.optional(v.number()),
    status: v.string(), // "draft", "active", "completed", "archived"
    targetAudience: v.optional(v.string()),
    contentTypes: v.optional(v.array(v.string())),
    duration: v.optional(v.string()),
    platform: v.optional(v.string()), // e.g., "instagram", "tiktok"
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    requirements: v.optional(v.string()),
    
    // Add more campaign fields as needed
  }).index("by_creatorUserId", ["creatorUserId"]),

  campaignApplications : defineTable({
    campaignId: v.id("campaigns"),
    influencerUserId: v.id("users"),
    status: v.string(), // "pending", "accepted", "rejected", etc.
    pitch: v.optional(v.string()),
    createdAt: v.string(),
  })
  .index("by_campaignId", ["campaignId"])
  .index("by_influencerUserId", ["influencerUserId"]),

  // Messaging
  messages :defineTable({
    conversationId: v.id("conversations"),
    senderUserId: v.id("users"),
    content: v.string(),
    sentAt: v.string(),
  }).index("by_conversationId", ["conversationId"]),

  // Analytics
  analytics : defineTable({
    campaignId: v.id("campaigns"),
    influencerUserId: v.id("users"),
    platform: v.string(),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    likes: v.optional(v.number()),
    comments: v.optional(v.number()),
    shares: v.optional(v.number()),
    conversions: v.optional(v.number()),
    engagementRate: v.optional(v.number()),
    fetchedAt: v.string(),
  }).index("by_campaignId", ["campaignId"]),

  // Payments
  payments : defineTable({
    campaignId: v.id("campaigns"),
    influencerUserId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: v.string(), // "pending", "paid", "failed"
    paidAt: v.optional(v.string()),
    method: v.optional(v.string()),
  }).index("by_influencerUserId", ["influencerUserId"]),

  //brands
  brands: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
  }).index("by_userId", ["userId"])

};

  export default defineSchema({
    ...applicationTables
  });
