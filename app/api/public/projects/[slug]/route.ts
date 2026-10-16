import { NextRequest, NextResponse } from 'next/server';
import { getPublicProjectBySlug } from '@/lib/public-data';

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, props: RouteProps) {
  try {
    const { slug } = await props.params;

    if (!slug) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SLUG',
            message: 'Project slug is required',
          },
        },
        { status: 400 }
      );
    }

    const project = getPublicProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        {
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found or not approved for public portfolio display',
          },
        },
        { status: 404 }
      );
    }

    // Security & Privacy Sanitize
    const sanitizedProject = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      summary: project.summary,
      description: project.description,
      images: project.images,
      coverImage: project.coverImage,
      generalArea: project.generalArea,
      location: project.location,
      year: project.year,
      completedAt: project.completedAt,
      materialsUsed: project.materialsUsed,
      scopeHighlights: project.scopeHighlights,
      clientFeedbackQuote: project.clientFeedbackQuote,
      publicationStatus: project.publicationStatus,
      photoPermissionStatus: project.photoPermissionStatus,
      photoPermissionGranted: project.photoPermissionGranted,
    };

    return NextResponse.json(sanitizedProject);
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Unable to retrieve project details',
        },
      },
      { status: 500 }
    );
  }
}
