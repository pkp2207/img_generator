"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Id } from "@/convex/_generated/dataModel";

const Discover = ({ searchParams: { search } }: { searchParams: { search: string } }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(search || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Example podcasts
  const examplePodcasts = [
    {
      _id: { __tableName: "podcasts", id: "1" } as unknown as Id<"podcasts">,
      podcastTitle: 'The AI Revolution',
      podcastDescription: 'Exploring the latest in AI technology and its impacts.',
      imageUrl: '/images/1.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "2" } as unknown as Id<"podcasts">,
      podcastTitle: 'Tech Talk',
      podcastDescription: 'Discussing the latest trends in technology and innovation.',
      imageUrl: '/images/2.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "3" } as unknown as Id<"podcasts">,
      podcastTitle: 'Health and Wellness',
      podcastDescription: 'Tips and advice on maintaining a healthy lifestyle.',
      imageUrl: '/images/3.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "4" } as unknown as Id<"podcasts">,
      podcastTitle: 'Mindful Living',
      podcastDescription: 'A podcast about mindfulness and living a balanced life.',
      imageUrl: '/images/4.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "5" } as unknown as Id<"podcasts">,
      podcastTitle: 'History Uncovered',
      podcastDescription: 'Delving into lesser-known historical events and figures.',
      imageUrl: '/images/5.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "6" } as unknown as Id<"podcasts">,
      podcastTitle: 'Science Daily',
      podcastDescription: 'The latest news and discoveries in the world of science.',
      imageUrl: '/images/6.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "7" } as unknown as Id<"podcasts">,
      podcastTitle: 'Business Insights',
      podcastDescription: 'Expert advice and analysis on current business trends.',
      imageUrl: '/images/7.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "8" } as unknown as Id<"podcasts">,
      podcastTitle: 'Creative Minds',
      podcastDescription: 'Interviews with artists and creatives from various fields.',
      imageUrl: '/images/8.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "9" } as unknown as Id<"podcasts">,
      podcastTitle: 'Fitness Freaks',
      podcastDescription: 'Workouts, nutrition, and tips for a healthy lifestyle.',
      imageUrl: '/images/9.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "10" } as unknown as Id<"podcasts">,
      podcastTitle: 'Travel Tales',
      podcastDescription: 'Stories and tips from travelers around the world.',
      imageUrl: '/images/10.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "11" } as unknown as Id<"podcasts">,
      podcastTitle: 'Culinary Delights',
      podcastDescription: 'Exploring different cuisines and recipes from around the globe.',
      imageUrl: '/images/11.jpeg',
    },
    {
      _id: { __tableName: "podcasts", id: "12" } as unknown as Id<"podcasts">,
      podcastTitle: 'Literature Lounge',
      podcastDescription: 'Discussing books, authors, and literary trends.',
      imageUrl: '/images/12.jpeg',
    }
  ];

  // Fetched podcasts data
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: debouncedSearchTerm || "" });

  useEffect(() => {
    if (search && searchTerm !== search) {
      setSearchTerm(search);
    }
  }, [search]);

  // Combined podcasts array for filtering
  const allPodcasts = [...examplePodcasts, ...(podcastsData || [])];

  // Filtered podcasts based on search term
  const filteredPodcasts = allPodcasts.filter((podcast) =>
    podcast.podcastTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.podcastDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-9">
      <div className="relative mt-8 block">
        <Input
          className="input-class py-6 pl-12 focus-visible:ring-offset-[--accent-color]"
          placeholder="Search for images"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onLoad={() => setSearchTerm("")}
        />
        <Image src="/icons/search.svg" alt="search" height={20} width={20} className="absolute left-4 top-3.5" />
      </div>

      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!searchTerm ? "Discover Trending Images" : `Search results for "${searchTerm}"`}
        </h1>
        {podcastsData ? (
          filteredPodcasts.length > 0 ? (
            <div className="podcast_grid">
              {filteredPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl || ""}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No results found" />
          )
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
