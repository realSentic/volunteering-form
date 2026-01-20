// config.js

// ====================================================================
// ⚠️ THIS IS THE ONLY FILE YOU EVER NEED TO EDIT
// Update this string with your current Cloudflare Quick Tunnel URL
// ====================================================================
export const CLOUDFLARE_TUNNEL_BASE = 'https://requests-thought-achieve-relations.trycloudflare.com';

// Export all the full endpoints needed across your application
export const N8N_FETCH_JOBS_URL = `${CLOUDFLARE_TUNNEL_BASE}/webhook/get-available-jobs`;
export const N8N_SUBMIT_FORM_URL = `${CLOUDFLARE_TUNNEL_BASE}/webhook/volunteer-form`;
export const N8N_TIME_IN_URL = `${CLOUDFLARE_TUNNEL_BASE}/webhook/time-in`;
// Add any other endpoints here...
