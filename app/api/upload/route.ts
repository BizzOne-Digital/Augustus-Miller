import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuthRequest } from '@/lib/auth/auth';
import { saveStoredUpload, getStoredUploads, deleteStoredUpload } from '@/lib/db/db';

const ALLOWED_FOLDERS = ['products', 'gallery', 'pages', 'misc', 'team', 'blog'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

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
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'misc';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: 'Invalid upload destination folder' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum 8MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    
    // Generate secure unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const randomHex = Math.random().toString(36).substring(2, 10);
    const filename = `${Date.now()}-${randomHex}.${ext}`;
    const url = `/api/uploads/${folder}/${filename}`;

    const record = await saveStoredUpload({
      folder,
      filename,
      mimeType: file.type,
      size: file.size,
      url,
      dataBase64: base64Data
    });

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      folder,
      id: record.id
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Upload ID required' }, { status: 400 });

    const success = await deleteStoredUpload(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Delete upload error:', error);
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 });
  }
}
