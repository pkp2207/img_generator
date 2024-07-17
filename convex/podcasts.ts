import { ConvexError, v } from "convex/values";

import { MutationCtx, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { rateLimit } from "@/lib/rateLimits";

type User = {
  _id: string;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  subscriptionId?: string;
  endsOn?: number;
  plan?: string;
  totalPodcasts?: number; // Ensure totalPodcasts can be optional and nullable
};

const userSchema = v.object({
  _id: v.string(),
  email: v.string(),
  imageUrl: v.string(),
  clerkId: v.string(),
  name: v.string(),
  subscriptionId: v.optional(v.string()),
  endsOn: v.optional(v.number()),
  plan: v.optional(v.string()),
  totalPodcasts: v.optional(v.number()),
});

const INCREMENTPODCASTVIEWS = "incrementPodcastViews";

// create podcast mutation
export const createPodcast = mutation({
  args: {
    audioStorageId: v.id("_storage"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    const isSubscribed =
      user[0].subscriptionId && user[0].endsOn && user[0].endsOn > new Date().getTime();

    const voiceType = isSubscribed ? args.voiceType : "alloy";

    await handlePodcastSubscription(ctx, user[0]);

    const newPodcast = await ctx.db.insert("podcasts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });

    // update the totalPodcasts of the user
    await ctx.db.patch(user[0]._id, {
      totalPodcasts: user[0].totalPodcasts + 1,
    });

    return newPodcast;
  },
});

// function to handle the podcasts based on user subscription
export const handlePodcastSubscription = async (ctx: MutationCtx,
  user: User
) => {

  const plan = user.plan? user.plan : "FREE";

  switch (plan.toUpperCase()) {
    case "FREE":
      if (user.totalPodcasts >= 5) {
        throw new ConvexError("You have exceeded the limit of podcasts for this month");
      }
      break;
    case "PRO":
      if (user.totalPodcasts >= 30) {
        throw new ConvexError("You have exceeded the limit of podcasts for this month");
      }
      break;
    case "ENTERPRISE":
      if (user.totalPodcasts >= 100) {
        throw new ConvexError("You have exceeded the limit of podcasts for this month");
      }
      break;
    default:
      if (user.totalPodcasts >= 5) {
        throw new ConvexError("You have exceeded the limit of podcasts for this month");
      }
      break;
  }

};

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
export const getPodcastByVoiceType = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), args.podcastId)
        )
      )
      .collect();
  },
});

// this query will get all the podcasts.
export const getAllPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

// this query will get the podcast by the podcastId.
export const getPodcastById = query({
  args: {
    podcastId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const podcast = await ctx.db.get(args.podcastId as Id<"podcasts">);

      if (!podcast) {
        throw new Error("Podcast not found");
      }

      return podcast;
    } catch (error) {
      throw new Error("Podcast not found");
    }
  },
});

// this query will get the podcasts based on the views of the podcast , which we are showing in the Trending Podcasts section.
export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query("podcasts").collect();

    return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// this query will get the podcast by the authorId.
export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    );

    return { podcasts, listeners: totalListeners };
  },
});

export const incrementPodcastViews = mutation({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    // TODO: Scale this with a distributed counter
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    const newRateLimit = await rateLimit(ctx, {
      name: INCREMENTPODCASTVIEWS,
      key: args.podcastId,
      throws: false,
    });

    if (!newRateLimit || !newRateLimit.ok) {
      return;
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

// this query will get the podcast by the search query.
export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("podcasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_title", (q) =>
        q.search("podcastTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("search_body", (q) =>
        q.search("podcastDescription" || "podcastTitle", args.search)
      )
      .take(10);
  },
});

// this mutation will update the views of the podcast.
export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

// this mutation will delete the podcast.
export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});
