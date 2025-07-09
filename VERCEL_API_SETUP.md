# Vercel API Setup Guide

## Overview
This guide explains how to set up API calls to work properly through Vercel deployment, addressing CORS issues and providing multiple solutions.

## Current CORS Issues

### Problem
- Browser blocks cross-origin requests from your domain to `uat-platform.bankkaro.com`
- CORS policy prevents direct API calls from frontend to external APIs
- Public CORS proxies (like cors-anywhere) are unreliable and rate-limited

### Why This Happens
- Same-origin policy: Browser security prevents requests to different domains
- External APIs don't include your domain in their CORS allowlist
- Frontend JavaScript cannot bypass CORS restrictions

## Solutions

### 1. **Vercel Serverless Functions (Recommended)**

Create API routes in Vercel that act as a proxy to external APIs.

#### Step 1: Create API Routes
Create `api/proxy/[...path].js` in your project:

```javascript
// api/proxy/[...path].js
export default async function handler(req, res) {
  const { path } = req.query;
  const targetUrl = `https://uat-platform.bankkaro.com/${path.join('/')}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Step 2: Update Frontend API Calls
Modify your API calls to use the proxy:

```javascript
// Instead of: https://uat-platform.bankkaro.com/partner/token
// Use: /api/proxy/partner/token

const makeApiCall = async () => {
  const proxyUrl = `/api/proxy${api.endpoint}`;
  // ... rest of your API call logic
};
```

### 2. **Environment-Specific Configuration**

#### Step 1: Update Environment Configuration
Modify `src/config/environments.js`:

```javascript
export const getEnvironmentUrl = (environment, isV1 = false) => {
  const isLocal = window.location.hostname === 'localhost';
  
  if (isLocal) {
    // Local development - use direct URLs
    return environment === 'production' 
      ? 'https://prod-platform.bankkaro.com'
      : 'https://uat-platform.bankkaro.com';
  } else {
    // Production (Vercel) - use proxy
    return '/api/proxy';
  }
};
```

#### Step 2: Update API Sandbox
Modify the API call logic in `ApiSandbox.jsx`:

```javascript
const makeApiCall = async () => {
  const baseUrl = getEnvironmentUrl(selectedEnvironment, api.endpoint?.startsWith('v1-'));
  const url = isLocal 
    ? `${baseUrl}${api.endpoint}`  // Direct call for local
    : `${baseUrl}${api.endpoint}`; // Proxy call for production
  
  // ... rest of the logic
};
```

### 3. **Alternative: Backend Proxy Service**

If you have a backend service, create a proxy endpoint:

```javascript
// Backend proxy endpoint
app.post('/api/proxy/*', async (req, res) => {
  const targetPath = req.params[0];
  const targetUrl = `https://uat-platform.bankkaro.com/${targetPath}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4. **CORS Headers in External API (If You Control It)**

If you have control over the external API, add CORS headers:

```javascript
// In your external API
app.use(cors({
  origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Implementation Steps

### Option A: Vercel Serverless Functions (Recommended)

1. **Create the API directory structure:**
   ```
   api/
   ├── proxy/
   │   └── [...path].js
   └── update-api-data.js (existing)
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Test the proxy:**
   - Visit your Vercel domain
   - Try making API calls
   - Check that responses come through the proxy

### Option B: Environment Detection

1. **Update your environment configuration**
2. **Modify API calls to use proxy in production**
3. **Test locally and on Vercel**

## Testing

### Local Testing
```bash
npm run dev
# API calls will go directly to external APIs
```

### Production Testing
```bash
vercel --prod
# API calls will go through Vercel proxy
```

## Benefits of Vercel Proxy Approach

1. **✅ Solves CORS Issues**: Server-side requests aren't subject to CORS
2. **✅ Reliable**: No dependency on external CORS proxies
3. **✅ Secure**: API keys can be stored server-side
4. **✅ Fast**: Vercel's edge network provides low latency
5. **✅ Scalable**: Automatic scaling with Vercel

## Fallback Strategy

Keep the current fallback system for development:

```javascript
// Current fallback chain:
// 1. Direct API call (local only)
// 2. CORS proxy (fallback)
// 3. Mock data (final fallback)

// New fallback chain:
// 1. Vercel proxy (production)
// 2. Direct API call (local)
// 3. Mock data (final fallback)
```

## Security Considerations

1. **API Key Protection**: Store sensitive keys in Vercel environment variables
2. **Rate Limiting**: Implement rate limiting in your proxy
3. **Validation**: Validate requests before proxying
4. **Logging**: Log proxy requests for monitoring

## Environment Variables

Add to your Vercel project:

```bash
# Vercel Dashboard > Settings > Environment Variables
API_BASE_URL=https://uat-platform.bankkaro.com
API_KEY=your_api_key_here
```

## Troubleshooting

### Common Issues

1. **404 on API routes**: Ensure `api/` directory is in project root
2. **CORS still failing**: Check that proxy is being used in production
3. **Environment variables not working**: Verify they're set in Vercel dashboard

### Debug Steps

1. Check browser network tab for request URLs
2. Verify environment detection is working
3. Test proxy endpoint directly
4. Check Vercel function logs

## Next Steps

1. Implement Vercel serverless proxy
2. Update environment configuration
3. Test thoroughly in both local and production
4. Monitor API performance and errors
5. Consider implementing caching for better performance 