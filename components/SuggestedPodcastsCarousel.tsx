import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Id<T extends string> = any;

interface SuggestedPodcastProps {
  _id: Id<"podcasts">;
  podcastTitle: string;
  podcastDescription: string;
  imageUrl: string;
}

interface SuggestedPodcastsCarouselProps {
  podcasts: SuggestedPodcastProps[];
}

// Helper function to extract the id from Id<"podcasts">
const getPodcastId = (id: Id<"podcasts">) => {
  return (id as unknown as { __tableName: string; id: string }).id;
};

const SuggestedPodcastsCarousel: React.FC<SuggestedPodcastsCarouselProps> = ({ podcasts }) => {
  return (
    <div className="carousel flex flex-col gap-4">
      {podcasts.map(podcast => (
        <Link key={getPodcastId(podcast._id)} href={`/podcast/${getPodcastId(podcast._id)}`} className="flex items-center gap-3">
          <Image
            src={podcast.imageUrl}
            alt={podcast.podcastTitle}
            width={40} // Adjusted size
            height={40} // Adjusted size
            className="aspect-square rounded-lg"
          />
          <span className="text-14 font-semibold text-white-1">{podcast.podcastTitle}</span>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedPodcastsCarousel;
