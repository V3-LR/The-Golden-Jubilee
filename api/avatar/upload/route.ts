
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * Vercel Blob Upload Route
 * This handles POST requests from the frontend, uploads the image to Vercel's global CDN,
 * and returns the public URL. This prevents LocalStorage "Quota Exceeded" errors.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'upload.jpg';

    if (!request.body) {
      return NextResponse.json({ error: 'No file body provided' }, { status: 400 });
    }

    // Upload the file stream directly to Vercel Blob storage
    // Ensure you have BLOB_READ_WRITE_TOKEN in your Vercel Environment Variables
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Vercel Blob Upload Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
