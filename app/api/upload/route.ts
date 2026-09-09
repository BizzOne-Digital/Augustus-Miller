import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { checkAdminAuthRequest } from '@/lib/auth/auth';
import {
  UPLOAD_FOLDERS,
  deleteStoredUpload,
  deleteStoredUploadByUrl,
  getStoredUploads,
  saveStoredUpload
} from '@/lib/db/db';

// Buffer, crypto, and Mongoose all need the Node runtime - not Edge.
export const runtime = 'nodejs';
// Uploads mutate state; never cache or prerender this route.
export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

/** Canonical extension per mime type - never trust the client's filename. */
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

export async function GET(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uploads = await getStoredUploads();
  return NextResponse.json(uploads);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'misc');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) {
      return NextResponse.json(
        { error: `Invalid upload folder. Allowed: ${UPLOAD_FOLDERS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 8MB limit' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Re-check the real byte length: file.size is client-reported metadata.
    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty' }, { status: 400 });
    }
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 8MB limit' }, { status: 413 });
    }

    // Extension comes from the validated mime type, so a hostile filename
    // cannot influence the stored path.
    const ext = EXTENSION_BY_MIME[file.type];
    const filename = `${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;
    const url = `/api/uploads/${folder}/${filename}`;

    const record = await saveStoredUpload({
      folder,
      filename,
      mimeType: file.type,
      size: buffer.length,
      url,
      data: buffer
    });

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: buffer.length,
      folder,
      id: record.id
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}

/**
 * Delete an upload by `?id=` (admin media library) or by `?url=` (called when an
 * image field is replaced or cleared).
 */
export async function DELETE(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    if (!id && !url) {
      return NextResponse.json({ error: 'Provide either an upload id or url' }, { status: 400 });
    }

    const success = url ? await deleteStoredUploadByUrl(url) : await deleteStoredUpload(id!);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Delete upload error:', error);
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 });
  }
}
