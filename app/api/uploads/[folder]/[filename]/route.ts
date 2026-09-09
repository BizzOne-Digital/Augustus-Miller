import { NextRequest, NextResponse } from 'next/server';
import { UPLOAD_FOLDERS, getStoredUploadByPath } from '@/lib/db/db';

// Buffer + Mongoose need the Node runtime.
export const runtime = 'nodejs';

/** Reject anything that could escape the (folder, filename) key space. */
function isUnsafeSegment(segment: string): boolean {
  return (
    !segment ||
    segment.includes('..') ||
    segment.includes('/') ||
    segment.includes('\\') ||
    segment.includes('\0')
  );
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder: rawFolder, filename: rawFilename } = await context.params;

  // Next.js gives these URL-encoded; decode before validating so `%2e%2e` and
  // `%2f` are caught rather than smuggled through.
  let folder: string;
  let filename: string;
  try {
    folder = decodeURIComponent(rawFolder);
    filename = decodeURIComponent(rawFilename);
  } catch {
    return new NextResponse('Invalid file path request', { status: 400 });
  }

  if (isUnsafeSegment(folder) || isUnsafeSegment(filename)) {
    return new NextResponse('Invalid file path request', { status: 400 });
  }

  if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) {
    return new NextResponse('Invalid file path request', { status: 400 });
  }

  const upload = await getStoredUploadByPath(folder, filename);
  if (!upload) {
    return new NextResponse('Image not found', { status: 404 });
  }

  // Prefer the Buffer column; fall back to legacy base64 records.
  const buffer = upload.data
    ? Buffer.from(upload.data)
    : upload.dataBase64
      ? Buffer.from(upload.dataBase64, 'base64')
      : null;

  if (!buffer || buffer.length === 0) {
    return new NextResponse('Image not found', { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': upload.mimeType,
      'Content-Length': buffer.length.toString(),
      // Filenames are content-addressed by timestamp + random hex, so a given
      // URL never changes contents. Safe to cache forever.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
