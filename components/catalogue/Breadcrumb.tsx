import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center space-x-2 text-xs text-[#5C4D41]">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#1E4D2B] transition-colors focus-accessible rounded-sm"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#DDD4C4]" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#201A15]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#1E4D2B] transition-colors focus-accessible rounded-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
