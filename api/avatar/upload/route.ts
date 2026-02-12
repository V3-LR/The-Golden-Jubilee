
/**
 * Neutralized route to prevent Edge runtime build errors.
 * Logic moved to /api/upload.ts which uses the Node.js runtime.
 */
export default function handler() {
  return new Response(JSON.stringify({ 
    error: "Endpoint moved", 
    message: "Please use /api/upload" 
  }), { 
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  });
}
