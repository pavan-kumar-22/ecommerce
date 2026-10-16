import { Suspense } from 'react';
import { ProductDetailClient } from './ProductDetailClient';

export function generateStaticParams() {
  return [
    { slug: 'krishna-solid-teak-king-bed' },
    { slug: 'godavari-seasoned-teak-queen-bed' },
    { slug: 'handcrafted-heritage-pooja-mandir' },
    { slug: 'amaravati-6-seater-solid-wood-dining-set' },
    { slug: 'ergonomic-teak-study-desk' },
    { slug: '4-door-modular-wardrobe-with-loft' },
    { slug: 'contemporary-2-track-sliding-wardrobe' },
    { slug: 'grand-carved-teak-main-entrance-door' },
    { slug: 'bwp-marine-ply-modular-kitchen' },
    { slug: 'heritage-glass-teak-crockery-cabinet' },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function ProductDetailLoader({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] p-12 text-center text-sm font-semibold text-[#5C4D41]">
          Loading product specifications...
        </div>
      }
    >
      <ProductDetailLoader params={params} />
    </Suspense>
  );
}
