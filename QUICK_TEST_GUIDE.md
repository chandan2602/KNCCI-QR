# Quick Testing Guide

## Test Scenario 1: Check Console Logs

### Steps:
1. Open your Angular app
2. Press `F12` to open DevTools
3. Click on **Console** tab
4. Click on **Apprenticeships** tab in your app
5. Look for logs starting with `=== APPRENTICESHIPS REQUEST ===`

### What to look for:

**Good logs should show:**
```
=== APPRENTICESHIPS REQUEST ===
URL: http://127.0.0.1:8000/hollandcode/apprenticeship-recommendations/
Payload: {"holland_codes":["S","I","A"]}
Payload type: object

=== APPRENTICESHIPS RESPONSE ===
Response: Array(5)  // or {"message": "..."}
Response type: object
Is Array: true  // or false
Mapped apprenticeships: Array(5)
```

**Bad logs would show:**
```
=== APPRENTICESHIPS ERROR ===
Full error object: HttpErrorResponse {...}
Status: 404  // or 422, 500, 0
Status text: "Not Found"
Error body: {"message": "No available apprenticeships..."}
```

---

## Test Scenario 2: Check Network Tab

### Steps:
1. Open DevTools (F12)
2. Click on **Network** tab
3. Click on **Apprenticeships** tab in your app
4. Look for a POST request to `apprenticeship-recommendations/`
5. Click on it to see details

### What to check:

**Request Tab:**
- URL: `http://127.0.0.1:8000/hollandcode/apprenticeship-recommendations/`
- Method: `POST`
- Headers should include:
  ```
  Content-Type: application/json
  Accept: application/json
  ```

**Request Body:**
```json
{
  "holland_codes": ["S", "I", "A"]
}
```

**Response Tab:**
- Status: `200` (success) or `404` (no results) or `422` (invalid)
- Body: Should show the actual response

---

## Test Scenario 3: Compare Internships vs Apprenticeships

### Steps:
1. Open Console tab
2. Click **Internships** tab → Note the logs
3. Click **Apprenticeships** tab → Note the logs
4. Compare them

### What to compare:

| Aspect | Internships | Apprenticeships |
|--------|-------------|-----------------|
| Request URL | Should be similar | Should be similar |
| Payload | Should be identical | Should be identical |
| Response Status | Usually 200 | Could be 200 or 404 |
| Response Type | Array | Array or Object |
| Error Status | Rarely shows | Might show 404 |

---

## Test Scenario 4: Test Different Holland Codes

### Try these codes:

**Code 1: SIA (default)**
- Payload: `{"holland_codes":["S","I","A"]}`
- Expected: Should return results or 404

**Code 2: RES**
- Payload: `{"holland_codes":["R","E","S"]}`
- Expected: Should return results or 404

**Code 3: Invalid (XYZ)**
- Payload: `{"holland_codes":["X","Y","Z"]}`
- Expected: Should get 422 error (invalid codes)

### How to test:
1. Edit the default holland code in component:
   ```typescript
   this.hollandCode = 'RES'; // Change from 'SIA'
   ```
2. Reload the page
3. Check console logs

---

## Test Scenario 5: Postman Comparison

### In Postman:

1. Create new POST request
2. URL: `http://127.0.0.1:8000/hollandcode/apprenticeship-recommendations/`
3. Body (raw, JSON):
```json
{
  "holland_codes": ["S", "I", "A"]
}
```
4. Click Send
5. Note the Status and Response

### Compare with Angular:
- Does Postman show same status as Angular console?
- Does Postman show same response body?
- If different, backend might be treating requests differently

---

## Troubleshooting Checklist

### If you see Status: 404
- ✅ This is expected when no apprenticeships match (score > 70%)
- ✅ Should show info toast, not error
- ✅ Check if this is the actual issue

### If you see Status: 422
- ❌ Invalid payload format
- Check: Are holland_codes exactly 3 characters?
- Check: Are codes in [R, I, A, S, E, C]?
- Check: Is field name exactly `holland_codes`?

### If you see Status: 500
- ❌ Backend server error
- Check: Is backend running?
- Check: Are there errors in backend logs?

### If you see Status: 0
- ❌ Network error or CORS blocked
- Check: Is backend running on `http://127.0.0.1:8000`?
- Check: Can you reach it in browser?

### If you see no logs at all
- ❌ Component not loading or tab not triggering
- Check: Is component mounted?
- Check: Is click handler working?
- Check: Are there JavaScript errors?

---

## What to Share When Asking for Help

1. **Screenshot of Console logs** - Full `=== APPRENTICESHIPS ===` section
2. **Screenshot of Network tab** - The POST request and response
3. **Status code** - What number appears in console?
4. **Response body** - What does the error/response show?
5. **Postman result** - What does Postman return for same request?

This will help identify the exact issue quickly.
