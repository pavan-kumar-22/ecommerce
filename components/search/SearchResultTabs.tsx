import React from 'react';

export type SearchTabType = 'all' | 'products' | 'services';

interface SearchResultTabsProps {
  activeTab: SearchTabType;
  counts: {
    all: number;
    products: number;
    services: number;
  };
  onSelectTab: (tab: SearchTabType) => void;
}

export const SearchResultTabs: React.FC<SearchResultTabsProps> = ({
  activeTab,
  counts,
  onSelectTab,
}) => {
  const tabs: { id: SearchTabType; label: string; count: number }[] = [
    { id: 'all', label: 'All Results', count: counts.all },
    { id: 'products', label: 'Products', count: counts.products },
    { id: 'services', label: 'Services & Joinery', count: counts.services },
  ];

  return (
    <div
      className="flex items-center gap-2 border-b border-[#E5DDD1] pb-px overflow-x-auto no-scrollbar"
      role="tablist"
      aria-label="Filter results by item type"
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectTab(tab.id)}
            className={`whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all focus-accessible flex items-center gap-2 ${
              isSelected
                ? 'border-[#1E4D2B] text-[#1E4D2B]'
                : 'border-transparent text-[#5C4D41] hover:text-[#201A15] hover:border-[#DDD4C4]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                isSelected ? 'bg-[#E8F2EC] text-[#1E4D2B]' : 'bg-[#EFE8DC] text-[#6B3F23]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
