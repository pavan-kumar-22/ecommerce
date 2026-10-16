import { NextRequest, NextResponse } from 'next/server';
import { queryPublicProjects } from '@/lib/public-data';
import { PublicProject } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const result = queryPublicProjects({
      category,
      search,
      page,
      limit,
    });

    // Security & Privacy Sanitize: Guarantee customer details & quotes are strictly omitted
    const sanitizedItems = result.items.map((project: PublicProject) => ({
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
    }));

    return NextResponse.json({
      items: sanitizedItems,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      filters: result.filters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Unable to retrieve projects at this time',
        },
        items: [],
      },
      { status: 500 }
    );
  }
}
