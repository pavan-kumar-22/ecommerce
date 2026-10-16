import React from 'react';
import Link from 'next/link';
import { Hammer, Sofa, DoorClosed, Utensils, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceCategory } from '../types/api';

interface ServiceCategoryCardsProps {
  categories: ServiceCategory[];
}

export const ServiceCategoryCards: React.FC<ServiceCategoryCardsProps> = ({ categories }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-[#6B3F23]" aria-hidden="true" />;
      case 'Sofa':
        return <Sofa className="w-6 h-6 text-[#6B3F23]" aria-hidden="true" />;
      case 'DoorClosed':
        return <DoorClosed className="w-6 h-6 text-[#6B3F23]" aria-hidden="true" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6 text-[#6B3F23]" aria-hidden="true" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-[#6B3F23]" aria-hidden="true" />;
    }
  };

  return (
    <section
      className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E5DDD1]"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1E4D2B] block mb-2">
              Carpentry Services
            </span>
            <h2
              id="categories-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15]"
            >
              Services & Custom Craftsmanship
            </h2>
          </div>
          <p className="text-sm text-[#5C4D41] max-w-md">
            From single-door realignments and minor hardware repairs to full-home architectural
            woodwork and modular kitchens.
          </p>
        </div>

        {/* 5-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.route}
              className="group bg-white p-6 rounded-2xl border border-[#E5DDD1] hover-lift flex flex-col justify-between focus-accessible focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] group-hover:bg-[#E8F2EC] flex items-center justify-center transition-colors mb-4">
                  {getIcon(category.iconName)}
                </div>
                <h3 className="text-base font-semibold text-[#201A15] group-hover:text-[#1E4D2B] transition-colors mb-2">
                  {category.name}
                </h3>
                <p className="text-xs text-[#5C4D41] leading-relaxed mb-4">
                  {category.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs font-semibold text-[#1E4D2B]">
                <span>Explore service</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
