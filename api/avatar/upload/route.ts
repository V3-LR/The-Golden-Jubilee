/**
 * DEPRECATED: This file is no longer used for uploads.
 * Logic moved to /api/upload.ts to avoid Edge Runtime conflicts.
 * Using standard Node.js signature to ensure Vercel doesn't treat this as an Edge function.
 */
export default function handler(req: any, res: any) {
  res.status(410).json({ 
    error: "Endpoint moved", 
    message: "Please use /api/upload" 
  });
}
