import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Brand } from "./useMatchedBrands";

interface MatchedBrandsListProps {
  brands: Brand[];
  show: boolean;
}

export function MatchedBrandsList({ brands, show }: MatchedBrandsListProps) {
  if (!show || brands.length === 0) return null;

  return (
    <div>
      <div className="mt-4 mb-2 font-semibold text-primary-800 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-secondary-600" />
        Brands in your niche
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {brands.map((brand) => (
          <Card key={brand.id} className="bg-accent-50 border-accent-200 flex flex-row items-center p-2">
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-10 h-10 rounded-full border border-gray-200 mr-3"
            />
            <div>
              <div className="font-semibold text-primary-700">{brand.name}</div>
              <div className="text-xs text-primary-600">{brand.description}</div>
            </div>
          </Card>
        ))}
      </div>
      <div className="text-xs text-gray-600 mt-2">
        <span>
          These brands are looking for creators in your niche! AI-powered matches will improve with more data.
        </span>
      </div>
    </div>
  );
}
