# Production Debug Guide

## 🚀 Current Fix Status
- ✅ **Fixed Proxy URL Structure**: Changed from `POST /api/proxy` to `GET/POST /api/proxy{endpoint}`
- ✅ **Enhanced Logging**: Added comprehensive console logging for debugging
- ✅ **Better Error Handling**: Detailed error messages with diagnostic information
- ✅ **Header Forwarding**: Proper forwarding of Authorization, partner-token, and x-api-key headers

## 🔍 How to Debug Production Issues

### 1. **Open Browser Console**
1. Go to your Vercel domain (e.g., `bank-karo-api-documentation.vercel.app`)
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try making an API call
5. Look for logs starting with: 🚀, 🔗, 📡, ✅, ❌, 💥, 🔍, 🎯

### 2. **Expected Log Flow**
```
🚀 Production API Call Debug Info: {apiEndpoint, method, environment, etc.}
🔗 Proxy URL: /api/proxy/partner/api/partner-auth
📡 Proxy Response Status: 200 OK
📡 Proxy Response Data: {status: "success", ...}
✅ API Call Successful
```

### 3. **Common Error Patterns**

#### **401 Unauthorized**
```
❌ API Call Failed: HTTP 401: Unauthorized
```
**Diagnosis**: Authentication issue
**Check**: 
- Is the Authorization header being sent?
- Is the partner token valid?
- Does the UAT API require different authentication?

#### **404 Not Found**
```
❌ API Call Failed: HTTP 404: Not Found
```
**Diagnosis**: Wrong endpoint or proxy routing issue
**Check**:
- Is the API endpoint correct in `apiData.js`?
- Is the proxy URL structure correct?

#### **500 Internal Server Error**
```
💥 Proxy Error: {error details}
```
**Diagnosis**: Server-side proxy error
**Check**:
- Vercel function logs
- Target API availability
- Request format issues

### 4. **Debug Information Available**

#### **Frontend Logs** (Browser Console)
- API endpoint being called
- Request method and headers
- Proxy URL being used
- Response status and data
- Detailed error messages

#### **Backend Logs** (Vercel Function)
- Incoming request details
- Target URL being called
- Headers being forwarded
- Response from target API
- Any errors during proxy execution

### 5. **Quick Diagnostic Commands**

#### **Test Proxy Directly**
```bash
# Test the proxy endpoint directly
curl -X POST "https://your-vercel-domain.vercel.app/api/proxy/partner/api/partner-auth" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{"mobile":"9999999999","otp":"123456"}'
```

#### **Check Vercel Function Logs**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Look for `/api/proxy/[...path]` function
5. Check recent invocations and logs

### 6. **Common Fixes Without Redeployment**

#### **Authentication Issues**
If you get 401 errors, the issue is likely:
1. **Missing Authorization Header**: Check if `Bearer token` is being sent
2. **Invalid Token**: The UAT API might require a real partner token
3. **Wrong Header Format**: Some APIs expect different header names

#### **CORS Issues**
If you get CORS errors, the proxy should handle this, but check:
1. **Proxy Function**: Ensure `/api/proxy/[...path].js` exists
2. **Vercel Configuration**: Check `vercel.json` has correct rewrites
3. **Function Deployment**: Ensure the function is deployed

#### **Routing Issues**
If you get 404 errors:
1. **API Endpoint**: Verify the endpoint in `apiData.js` is correct
2. **Proxy URL**: Ensure the proxy URL matches the endpoint
3. **Target URL**: Check if the UAT API endpoint exists

### 7. **Emergency Fallback**
If the proxy completely fails, the system will:
1. Fall back to mock data
2. Show detailed error information
3. Log all diagnostic data to console
4. Display error message with debug info

### 8. **What to Share for Debugging**
If you need help debugging, share:
1. **Browser Console Logs**: All logs starting with emojis
2. **Error Message**: The exact error shown in the UI
3. **API Endpoint**: Which API you were testing
4. **Request Data**: What data you entered
5. **Environment**: UAT or Production

### 9. **Expected Success Flow**
```
1. User clicks "Send Request"
2. Frontend logs: 🚀 Production API Call Debug Info
3. Frontend logs: 🔗 Proxy URL: /api/proxy/partner/api/partner-auth
4. Proxy receives request and logs: 🔍 Proxy Debug Info
5. Proxy logs: 🎯 Target URL: https://uat-platform.bankkaro.com/partner/api/partner-auth
6. Proxy logs: 📤 Request Details
7. Proxy logs: 📥 Response Details
8. Proxy logs: 📥 Response Data
9. Frontend logs: 📡 Proxy Response Status: 200 OK
10. Frontend logs: ✅ API Call Successful
```

### 10. **Troubleshooting Checklist**
- [ ] Browser console shows detailed logs
- [ ] Proxy URL is correctly formatted
- [ ] Authorization header is being sent
- [ ] Target API endpoint exists
- [ ] UAT API is accessible
- [ ] Vercel function is deployed
- [ ] No CORS errors in network tab
- [ ] Response contains expected data

This guide should help diagnose any issues without requiring additional deployments. 