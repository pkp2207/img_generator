export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/discover.svg",
    route: "/discover",
    label: "Discover",
  },
  {
    imgURL: "/icons/profile.svg",
    route: "/create-image",
    label: "Generate Image",
  },
  {
    imgURL: "/icons/profile.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/icons/chart.svg",
    route: "/plans",
    label: "Billing & Usage",
  }
];

export const voiceDetails = [
  {
    id: 1,
    name: "Anime",
  },
  {
    id: 2,
    name: "Bokeh",
  },
  {
    id: 3,
    name: "Blur",
  },
  {
    id: 4,
    name: "Cyberpunk",
  },
];

// This block maps over the pricingPlans array to generate pricing plan cards.
// Each card displays information based on whether the 'annual' state is true or false,
// which toggles between showing monthly and annual prices.
// Features and unavailable features are listed with icons indicating their availability.
export const pricingPlans = [
  {
    // Name of the pricing plan.
    name: "Free",
    // Monthly price of the plan as a string.
    monthlyPrice: "0",
    // Annual price of the plan as a string, representing cost per month when billed annually.
    annualPrice: "0",
    // A short description for your pricing table
    description:
      "This plan is ideal for individual users and hobbyists who are looking for essential functionalities to get started and explore the platform.",
    // Tailwind CSS classes for styling the card's background.
    cardBgClass: "bg-[#0003] backdrop-blur-3xl",
    // Tailwind CSS classes for styling the button within the card.
    buttonClass: "text-white-1 bg-[#ffffff1a] hover:bg-[#ffffff0d] ",
    // Array of features included in the plan.
    features: [
      "Create upto 500 images per month",
      "Unlimited Viewing",
      "2 AI image models",
    ],
    // Array of features not available in the plan.
    unavailableFeatures: [
      "Unlimited Downloading",
      "Generate more than 500 images",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "15",
    annualPrice: "10",
    description:
      "If you're a small business or a startup, this plan is designed to cater to your needs. It offers a balance of essential features.",
    cardBgClass: "bg-[#00000080] backdrop-blur-3xl",
    buttonClass:
      "text-black-1 bg-[#ffffff] hover:bg-[#ffffff0d] hover:text-white-1 ",
    features: [
      "Create upto 3000 images per month",
      "Up to 6 AI image models",
      "Unlimited Viewing",
    ],
    unavailableFeatures: [
      "Unlimited Images per month",
      "Unlimited Downloading",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: "55",
    annualPrice: "50",
    description:
      "Tailored for medium-sized businesses, this plan offers advanced tools and features to support your growing demands.",
    cardBgClass: "bg-[#0003] backdrop-blur-3xl",
    buttonClass: "text-white-1 bg-[#ffffff1a] hover:bg-[#ffffff0d] ",
    features: [
      "Unlimited Images per month",
      "AI image model selection",
      "Image stats and analytics",
      "Unlimited Viewing and Downloading",
    ],
    // The third plan does not have any unavailable features, hence an empty array.
    unavailableFeatures: [],
  },
];