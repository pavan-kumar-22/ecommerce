import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPublicProjectBySlug, queryPublicProjects } from '@/lib/public-data';
import { PublicProject } from '@/types/api';
import { ProjectDetailClient } from './ProjectDetailClient';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = queryPublicProjects({ limit: 50 });
  return result.items.map((project: PublicProject) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Vuyyuru Carpentry',
      description: 'The requested project could not be found or is not approved for public display.',
    };
  }

  const primaryImage =
    project.images && project.images.length > 0 ? project.images[0].url : project.coverImage?.url;

  return {
    title: `${project.title} | Completed Woodwork | Vuyyuru Carpentry`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Vuyyuru Carpentry Portfolio`,
      description: project.summary,
      images: primaryImage ? [{ url: primaryImage, alt: project.title }] : undefined,
    },
  };
}

export default async function ProjectPage(props: ProjectPageProps) {
  const { slug } = await props.params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E4D2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5C4D41] font-medium">Loading project details...</p>
          </div>
        </div>
      }
    >
      <ProjectDetailClient slug={slug} />
    </Suspense>
  );
}
