import { NextRequest, NextResponse } from 'next/server';
import { getStoredUploadByPath } from '@/lib/db/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await context.params;

  // Security: Prevent path traversal attacks
  if (
    folder.includes('..') ||
    filename.includes('..') ||
    folder.includes('/') ||
    filename.includes('/') ||
    folder.includes('\\') ||
    filename.includes('\\')
  ) {
    return new NextResponse('Invalid file path request', { status: 400 });
  }

  const upload = await getStoredUploadByPath(folder, filename);

  if (!upload || !upload.dataBase64) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const buffer = Buffer.from(upload.dataBase64, 'base64');

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': upload.mimeType,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
