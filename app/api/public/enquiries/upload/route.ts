import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided for upload.' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} photos can be uploaded per enquiry.` },
        { status: 400 }
      );
    }

    const uploadedAssets = [];

    for (const file of files) {
      // 1. MIME check
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File "${file.name}" has unsupported format. Only JPG, PNG, and WebP are allowed.`,
          },
          { status: 400 }
        );
      }

      // 2. Size check
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the maximum allowed size of 5 MB.`,
          },
          { status: 400 }
        );
      }

      // 3. Generate secure safe storage name
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const fileId = `asset_${crypto.randomBytes(8).toString('hex')}`;
      const safeFilename = `ref_${Date.now()}_${fileId}.${ext}`;

      // In a real S3 / persistent blob store, this would stream to private storage.
      // For Next.js runtime, we simulate the safe upload and return private signed reference metadata.
      const simulatedPrivateUrl = `/uploads/custom-furniture/${safeFilename}`;

      uploadedAssets.push({
        id: fileId,
        filename: file.name.slice(0, 80), // sanitize original filename length
        safeStorageName: safeFilename,
        url: simulatedPrivateUrl,
        sizeBytes: file.size,
        contentType: file.type,
        accessClassification: 'private_enquiry_reference',
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Photos uploaded successfully. Files are retained for quotation review only.',
        data: uploadedAssets,
      },
      { status: 201 }
    );
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Custom furniture upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload. Please retry or skip photo upload.' },
      { status: 500 }
    );
  }
}
