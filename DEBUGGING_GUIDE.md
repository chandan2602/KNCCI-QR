# Angular API Debugging Guide - Apprenticeships vs Internships

## Problem Analysis

**Internships API**: ✅ Works  
**Apprenticeships API**: ❌ Fails in Angular (works in Postman)

### Possible Root Causes

1. **Response Structure Mismatch**
   - Internships returns: `[{...}, {...}]` (array)
   - Apprenticeships might return: `{"message": "..."}` (object) when no results
   - `Array.isArray(response)` fails for object responses

2. **HTTP Status Code Handling**
   - Backend returns `404` when no apprenticeships match (score > 70%)
   - Angular HttpClient treats 404 as an error, not a success response
   - Internships might return 200 with empty array instead

3. **CORS Issues**
   - Apprenticeships endpoint might have different CORS headers
   - Check if preflight OPTIONS request is failing

4. **Payload Validation (422 Error)**
   - FastAPI validates `UserTraits` model strictly
   - If payload format differs, you get 422 Unprocessable Entity
   - Check if `holland_codes` field name matches exactly

5. **Content-Type Header**
   - Angular might not be sending `Content-Type: application/json`
   - Backend might expect specific header

## Debugging Steps

### Step 1: Check Network Tab
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Click on Apprenticeships tab in your app
4. Look for the POST request to `apprenticeship-recommendations/`
5. Check:
   - **Status Code**: 200, 404, 422, 500?
   - **Request Headers**: Is `Content-Type: application/json` present?
   - **Request Body**: Is payload correct?
   - **Response**: What's the actual response body?

### Step 2: Check Browser Console
1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Click on Apprenticeships tab
4. Look for logs starting with `=== APPRENTICESHIPS REQUEST ===`
5. Compare with internships logs

**Expected logs:**
```
=== APPRENTICESHIPS REQUEST ===
URL: http://127.0.0.1:8000/hollandcode/apprenticeship-recommendations/
Payload: {"holland_codes":["R","E","S"]}
Payload type: object

=== APPRENTICESHIPS RESPONSE ===
Response: [...]  // or {"message": "..."}
Response type: object
Is Array: true/false
```

### Step 3: Compare Internships vs Apprenticeships
1. Click Internships tab, check console logs
2. Click Apprenticeships tab, check console logs
3. Compare:
   - Request payload format
   - Response structure
   - Status codes

### Step 4: Test in Postman
1. Send POST to `http://127.0.0.1:8000/hollandcode/apprenticeship-recommendations/`
2. Body (raw JSON):
```json
{
  "holland_codes": ["R", "E", "S"]
}
```
3. Note the response status and body
4. Compare with what Angular receives

## Common Issues & Solutions

### Issue 1: 404 Response
**Symptom**: Console shows `Status: 404`  
**Cause**: No apprenticeships found with match score > 70%  
**Solution**: Already handled in code - shows info toast instead of error

### Issue 2: 422 Response
**Symptom**: Console shows `Status: 422`  
**Cause**: Invalid payload format  
**Solution**: Check if `holland_codes` field name is correct (case-sensitive)

### Issue 3: 0 Status (Network Error)
**Symptom**: Console shows `Status: 0`  
**Cause**: Cannot reach server or CORS blocked  
**Solution**: 
- Verify backend is running on `http://127.0.0.1:8000`
- Check CORS headers in backend response

### Issue 4: Response is Object, Not Array
**Symptom**: `Is Array: false` but no error  
**Cause**: Backend returns `{"message": "..."}` on 404  
**Solution**: Code now handles this - checks if response is object with message

## Code Changes Made

Enhanced error logging in `loadApprenticeships()`:
- Logs full request URL and payload
- Logs response type and structure
- Handles both array and object responses
- Detailed error messages for different status codes
- Logs full error object for debugging

## Next Steps

1. **Run the app and click Apprenticeships tab**
2. **Open Chrome DevTools Console**
3. **Share the logs** - especially:
   - The full `=== APPRENTICESHIPS REQUEST ===` section
   - The full `=== APPRENTICESHIPS RESPONSE ===` or `=== APPRENTICESHIPS ERROR ===` section
4. **Also check Network tab** and share:
   - Status code of the request
   - Response body shown in Network tab

This will help identify the exact issue.
