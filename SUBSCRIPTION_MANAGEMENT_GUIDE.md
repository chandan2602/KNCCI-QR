# Subscription Management Guide

## Overview
This guide covers the complete subscription management system that allows Super Admin to control subscription features and manage user subscriptions.

---

## Features Implemented

### 1. System-Wide Subscription Control
**Location**: Manage Users Page (`/HOME/usersRegistrationList`) - Top Section
**Access**: Super Admin only (RoleId = 4)

**Functionality**:
- Toggle subscription feature on/off globally
- Displayed as a prominent card at the top of Manage Users page
- When disabled, users cannot view or purchase subscriptions
- Real-time effect on all users

**How to Use**:
1. Login as Super Admin
2. Navigate to "Manage Users" page
3. See "Subscription Settings" card at the top
4. Toggle the subscription switch
5. Confirm the action

**Visual Design**:
- Purple gradient header with crown icon
- Large toggle switch (Enabled/Disabled)
- Green badge when enabled, gray when disabled
- Informative description text

---

### 2. User Subscription Management
**Location**: Manage Users Page (`/HOME/usersRegistrationList`)
**Access**: Admin and Super Admin

**Functionality**:
- View user subscription status
- Assign new subscriptions to users
- Extend existing subscriptions
- Cancel active subscriptions
- Full audit trail of all actions

**How to Use**:

#### View User Subscription
1. Go to "Manage Users" page
2. Find the user in the table
3. Click "Subscription" button in their row
4. Modal opens showing current subscription details

#### Assign New Subscription
1. Open user's subscription modal
2. In "Assign New Subscription" section:
   - Select subscription plan (Silver/Gold/Platinum)
   - Enter duration in days (default: 30)
3. Click "Assign Subscription"
4. User immediately gets access to selected plan

#### Extend Subscription
1. Open user's subscription modal (must have active subscription)
2. In "Extend Current Subscription" section:
   - Enter number of days to extend (default: 30)
3. Click "Extend Subscription"
4. Expiry date is extended by specified days

#### Cancel Subscription
1. Open user's subscription modal (must have active subscription)
2. In "Cancel Subscription" section:
3. Click "Cancel Subscription"
4. Confirm the action
5. Subscription is immediately deactivated

---

## User Interface

### Manage Users Page Layout

**For Super Admin:**
1. **Subscription Settings Card** (Top of page)
   - Purple gradient header
   - Toggle switch for enable/disable
   - Status badge (Enabled/Disabled)
   - Only visible to Super Admin

2. **Filters Section**
   - Tenant selection (if Super Admin)
   - Role selection
   - Add User button

3. **Users Table**
   - Standard user columns
   - New "Subscription" column with management button
   - Action buttons (Edit, etc.)

### Subscription Settings Card
**Header**: Purple gradient with crown icon and "Subscription Settings" title

**Content**:
- Left side: Description of feature
- Right side: Large toggle switch with status badge
- Hover effect: Card lifts slightly

**Toggle States**:
- **Enabled**: Green toggle, green badge with checkmark
- **Disabled**: Gray toggle, gray badge with X icon

### Manage Users Table
New column added: "Subscription"
- Shows subscription management button for each user
- Purple button with crown icon
- Click to open subscription management modal

### Subscription Modal
**Header**: Shows user's name with crown icon

**Current Subscription Card** (if exists):
- Purple gradient background
- Shows plan name, status, dates
- Lists access limits (jobs, internships, startups)

**Action Cards**:
1. **Assign New Subscription** (Green)
   - Dropdown for plan selection
   - Input for duration
   - Assign button

2. **Extend Subscription** (Blue)
   - Only visible if user has active subscription
   - Input for extension days
   - Extend button

3. **Cancel Subscription** (Red)
   - Only visible if user has active subscription
   - Warning message
   - Cancel button

---

## API Integration

### Required Backend Endpoints

1. **GET** `/api/InternshipJobs/GetSubscriberByUserId/{userId}`
   - Retrieves user's current subscription

2. **GET** `/api/InternshipJobs/GetAllSubscriptionPackage`
   - Gets all available subscription plans

3. **POST** `/api/InternshipJobs/InsertSubscriber`
   - Assigns new subscription to user

4. **POST** `/api/InternshipJobs/ExtendSubscription`
   - Extends existing subscription

5. **POST** `/api/InternshipJobs/CancelSubscription`
   - Cancels active subscription

See `BACKEND_API_REQUIREMENTS.md` for detailed API specifications.

---

## Subscription Plans

### Default Plans (configurable via backend)

**Silver Plan**
- Price: KES 1,000/month
- Access: 10 Jobs, 5 Internships, 2 Startups
- Color: Silver (#C0C0C0)

**Gold Plan**
- Price: KES 1,500/month
- Access: 20 Jobs, 15 Internships, 5 Startups
- Color: Gold (#FFD700)

**Platinum Plan**
- Price: KES 2,000/month
- Access: 35 Jobs, 18 Internships, 10 Startups
- Color: Platinum (#E5E4E2)

---

## User Roles & Permissions

### Super Admin (RoleId = 4)
- Full access to system settings
- Can enable/disable subscription feature
- Can manage all user subscriptions
- Can view all tenants

### Admin (RoleId = 1)
- Can manage user subscriptions within their tenant
- Cannot access system settings
- Cannot enable/disable subscription feature

### Regular Users (Students, Companies)
- Can view and purchase subscriptions (if enabled)
- Cannot manage other users' subscriptions

---

## Workflow Examples

### Example 1: New User Needs Subscription
1. Admin goes to Manage Users
2. Finds the new user
3. Clicks "Subscription" button
4. Sees "No active subscription" message
5. Selects "Gold" plan, 30 days
6. Clicks "Assign Subscription"
7. User immediately gets Gold plan access for 30 days

### Example 2: Extend Expiring Subscription
1. Admin receives notification about expiring subscription
2. Goes to Manage Users
3. Finds the user
4. Clicks "Subscription" button
5. Sees current subscription expires in 2 days
6. Enters "30" in extend days field
7. Clicks "Extend Subscription"
8. Expiry date extended by 30 days from current expiry

### Example 3: Cancel Problematic User
1. Admin identifies user violating terms
2. Goes to Manage Users
3. Finds the user
4. Clicks "Subscription" button
5. Clicks "Cancel Subscription"
6. Confirms cancellation
7. User loses subscription access immediately

### Example 4: Disable Subscription Feature
1. Super Admin goes to Manage Users page
2. Sees "Subscription Settings" card at the top
3. Toggles subscription switch to OFF
4. Confirms action
5. Badge changes to gray "Disabled"
6. All users see "Subscription disabled" message on subscribe page
7. No new subscriptions can be purchased
8. Existing subscriptions remain but cannot be extended

---

## Audit Trail

All subscription actions are logged with:
- Action type (ASSIGNED, EXTENDED, CANCELLED)
- User who performed the action
- Timestamp
- Old and new values (for extensions)

This ensures full accountability and traceability.

---

## Best Practices

### For Admins:
1. **Regular Monitoring**: Check subscription expiry dates weekly
2. **Proactive Extension**: Extend subscriptions before they expire
3. **Clear Communication**: Inform users before cancelling subscriptions
4. **Documentation**: Keep notes on why subscriptions were cancelled

### For Super Admins:
1. **Planned Maintenance**: Announce before disabling subscription feature
2. **Testing**: Test subscription toggle in non-production first
3. **Backup**: Ensure subscription data is backed up before major changes
4. **Monitoring**: Watch for issues after enabling/disabling feature

---

## Troubleshooting

### Issue: Subscription button not showing
**Solution**: Ensure user has Admin or Super Admin role

### Issue: Cannot assign subscription
**Solution**: 
- Check if subscription feature is enabled in System Settings
- Verify subscription plans are loaded from backend
- Check user doesn't already have active subscription

### Issue: Modal not opening
**Solution**: 
- Check browser console for errors
- Ensure Bootstrap 5 is loaded
- Clear browser cache

### Issue: Subscription not reflecting immediately
**Solution**:
- Refresh the page
- Check backend API response
- Verify database was updated

---

## Security Considerations

1. **Authorization**: All subscription management endpoints must verify admin role
2. **Validation**: Validate all input data (dates, IDs, durations)
3. **Audit Logging**: Log all subscription changes for compliance
4. **Rate Limiting**: Prevent abuse of subscription assignment
5. **Data Privacy**: Ensure subscription data is only visible to authorized users

---

## Future Enhancements

Potential features to add:
- Bulk subscription assignment
- Subscription usage analytics
- Automated expiry notifications
- Subscription renewal reminders
- Custom subscription plans per tenant
- Subscription payment integration
- Subscription upgrade/downgrade
- Subscription history view
- Export subscription reports

---

## Support

For issues or questions:
1. Check this documentation
2. Review `BACKEND_API_REQUIREMENTS.md`
3. Check `TESTING_GUIDE.md`
4. Contact development team

---

## Version History

**v1.0** (Current)
- System-wide subscription toggle
- User subscription management
- Assign, extend, cancel functionality
- Audit trail support
- Admin interface in Manage Users
