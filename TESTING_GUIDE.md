# Testing Guide - Subscription Control Feature

## Prerequisites
- Backend API endpoints must be implemented (see BACKEND_API_REQUIREMENTS.md)
- Super Admin account with RoleId = 4
- Regular user account (Student or Company)

## Test Scenarios

### 1. Super Admin Access Control

**Test Case 1.1**: Super Admin can access System Settings
- Login as Super Admin (RoleId = 4)
- Navigate to `/HOME/system-settings`
- ✅ Expected: Page loads successfully with subscription toggle

**Test Case 1.2**: Non-Super Admin cannot access System Settings
- Login as regular user (RoleId = 3 or other)
- Try to navigate to `/HOME/system-settings`
- ✅ Expected: Error message "Access denied. Super Admin only." and redirect back

---

### 2. Subscription Toggle Functionality

**Test Case 2.1**: Enable Subscription
- Login as Super Admin
- Go to System Settings
- Toggle subscription switch to ON
- Confirm the action
- ✅ Expected: 
  - Success message: "Subscription feature enabled successfully"
  - Badge shows "Enabled" in green
  - Setting saved to database

**Test Case 2.2**: Disable Subscription
- Login as Super Admin
- Go to System Settings
- Toggle subscription switch to OFF
- Confirm the action
- ✅ Expected:
  - Success message: "Subscription feature disabled successfully"
  - Badge shows "Disabled" in gray
  - Setting saved to database

**Test Case 2.3**: Cancel Toggle Action
- Click toggle switch
- Click "Cancel" on confirmation dialog
- ✅ Expected: Toggle state remains unchanged

---

### 3. User Experience When Subscription is Enabled

**Test Case 3.1**: View Subscription Plans
- Super Admin enables subscription
- Login as regular user
- Navigate to `/HOME/subscribe`
- ✅ Expected:
  - Subscription plans (Silver, Gold, Platinum) are visible
  - All plan cards are clickable
  - "Subscription" buttons are active

**Test Case 3.2**: Complete Subscription Payment
- Click on any plan card
- Modal opens with plan details
- Click "Payment" button
- ✅ Expected:
  - Payment process initiates
  - Subscription is saved successfully
  - User receives confirmation

---

### 4. User Experience When Subscription is Disabled

**Test Case 4.1**: View Subscribe Page When Disabled
- Super Admin disables subscription
- Login as regular user
- Navigate to `/HOME/subscribe`
- ✅ Expected:
  - Warning message displayed: "Subscription feature is currently disabled by administrator"
  - No subscription plans visible
  - Page shows disabled state

**Test Case 4.2**: Attempt Payment When Disabled
- If somehow modal is opened (edge case)
- Click "Payment" button
- ✅ Expected:
  - Error message: "Subscription feature is currently disabled"
  - Payment does not process

---

### 5. Real-time Updates

**Test Case 5.1**: Toggle Effect on Active Users
- User A is viewing subscribe page (enabled state)
- Super Admin disables subscription
- User A refreshes the page
- ✅ Expected: User A now sees disabled state

**Test Case 5.2**: Toggle Effect on New Sessions
- Super Admin disables subscription
- New user logs in
- Navigates to subscribe page
- ✅ Expected: Sees disabled state immediately

---

### 6. API Integration Tests

**Test Case 6.1**: GET Settings API
```bash
curl -X GET http://your-api/api/SystemSettings/GetSettings
```
✅ Expected Response:
```json
{
  "status": true,
  "data": {
    "subscriptionEnabled": false
  }
}
```

**Test Case 6.2**: POST Update Setting API
```bash
curl -X POST http://your-api/api/SystemSettings/UpdateSetting \
  -H "Content-Type: application/json" \
  -d '{
    "settingKey": "subscriptionEnabled",
    "settingValue": true,
    "updatedBy": "admin123"
  }'
```
✅ Expected Response:
```json
{
  "status": true,
  "message": "Setting updated successfully"
}
```

---

### 7. Error Handling

**Test Case 7.1**: API Unavailable
- Stop backend API
- Try to access subscribe page
- ✅ Expected: Warning message about unavailability

**Test Case 7.2**: Network Error During Toggle
- Simulate network failure
- Try to toggle subscription
- ✅ Expected: Error message displayed, state not changed

---

### 8. Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

### 9. Mobile Responsiveness

Test on:
- [ ] Mobile phone (portrait)
- [ ] Mobile phone (landscape)
- [ ] Tablet (portrait)
- [ ] Tablet (landscape)

---

## Regression Testing

After implementing this feature, verify:
- [ ] Existing subscription functionality works when enabled
- [ ] Other admin features are not affected
- [ ] User registration still works
- [ ] Job/Internship posting still works
- [ ] Navigation menu displays correctly

---

## Performance Testing

- [ ] Page load time for system-settings < 2 seconds
- [ ] Toggle action response time < 1 second
- [ ] Subscribe page load time < 3 seconds
- [ ] No memory leaks after multiple toggles

---

## Security Testing

- [ ] Non-admin users cannot access system-settings endpoint
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are sanitized
- [ ] CSRF protection is in place
- [ ] Audit trail records all changes

---

## Sign-off Checklist

- [ ] All test cases passed
- [ ] No console errors
- [ ] No compilation warnings
- [ ] Documentation reviewed
- [ ] Backend APIs tested
- [ ] Frontend UI tested
- [ ] Super Admin trained
- [ ] Rollback plan prepared
