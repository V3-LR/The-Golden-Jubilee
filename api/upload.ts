
import { put } from '@vercel/blob';

/**
 * Node.js Serverless Function (Vercel)
 * Using standard Request/Response APIs but running on Node.js runtime.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `upload-${Date.now()}.jpg`;

    if (!request.body) {
      return new Response(JSON.stringify({ error: 'No file body provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Upload to Vercel Blob using the Node.js compatible library
    // The BLOB_READ_WRITE_TOKEN environment variable must be set in Vercel
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
