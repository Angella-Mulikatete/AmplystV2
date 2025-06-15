
import { useMemo } from "react";

type Brand = {
  id: number;
  name: string;
  niche: string;
  logo: string;
  description: string;
};

const mockBrands: Brand[] = [
  {
    id: 1,
    name: "ActiveWear Pro",
    niche: "fitness",
    logo: "/placeholder.svg",
    description: "Premium athletic wear for fitness enthusiasts.",
  },
  {
    id: 2,
    name: "TravelGo",
    niche: "travel",
    logo: "/placeholder.svg",
    description: "Adventure travel gear and experiences.",
  },
  {
    id: 3,
    name: "BeautyBliss",
    niche: "beauty",
    logo: "/placeholder.svg",
    description: "Innovative beauty & skincare essentials.",
  },
  {
    id: 4,
    name: "TechFlow",
    niche: "tech",
    logo: "/placeholder.svg",
    description: "Smart gadgets for the modern creator.",
  },
  {
    id: 5,
    name: "StyleLane",
    niche: "fashion",
    logo: "/placeholder.svg",
    description: "Trendy fashion for the influencer generation.",
  },
  {
    id: 6,
    name: "EduMinds",
    niche: "education",
    logo: "/placeholder.svg",
    description: "Edtech brand revolutionizing online learning.",
  }
];

export function useMatchedBrands(niche: string | undefined) {
  return useMemo(() => {
    if (!niche) return [];
    return mockBrands.filter(b => b.niche === niche);
  }, [niche]);
}

export type { Brand };