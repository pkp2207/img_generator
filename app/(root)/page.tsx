"use client";
import PodcastCard from '@/components/PodcastCard';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from '@/components/LoaderSpinner';
import { Id } from '@/convex/_generated/dataModel';

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

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
  ];

  if (!trendingPodcasts) {
    return <LoaderSpinner />;
  }

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className='flex flex-col gap-5'>
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {examplePodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
            <PodcastCard
              key={_id}
              imgUrl={imageUrl}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
