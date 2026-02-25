# Tenant-Level Subscription Control

## Overview
This feature allows Super Admin to control subscription access at two levels:
1. **Global Level**: Enable/disable for all tenants
2. **Tenant Level**: Enable/disable for specific tenant (affects all users in that tenant)

---

## How It Works

### Hierarchy of Control

```
┌─────────────────────────────────────────────────┐
│  Global Subscription Control                     │
│  (Affects ALL tenants)                          │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  Tenant 1: Karon                         │   │
│  │  Subscription: Enabled ✓                 │   │
│  │  → All users can subscribe               │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  Tenant 2: SANDV CAPITALS                │   │
│  │  Subscription: Disabled ✗                │   │
│  │  → No users can subscribe                │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  Tenant 3: Dr. Mahesh Chandra            │   │
│  │  Subscription: Enabled ✓                 │   │
│  │  → All users can subscribe               │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Control Logic

### Scenario 1: Global Enabled, Tenant Enabled
```
Global: ✓ Enabled
Tenant: ✓ Enabled
Result: Users CAN subscribe ✓
```

### Scenario 2: Global Enabled, Tenant Disabled
```
Global: ✓ Enabled
Tenant: ✗ Disabled
Result: Users CANNOT subscribe ✗
```

### Scenario 3: Global Disabled, Tenant Enabled
```
Global: ✗ Disabled
Tenant: ✓ Enabled (doesn't matter)
Result: Users CANNOT subscribe ✗
```

### Scenario 4: Global Disabled, Tenant Disabled
```
Global: ✗ Disabled
Tenant: ✗ Disabled
Result: Users CANNOT subscribe ✗
```

**Rule**: Both Global AND Tenant must be enabled for users to access subscriptions.

---

## User Interface

### Subscription Settings Card

```
╔═══════════════════════════════════════════════════════════╗
║  👑 Subscription Settings                                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  🌐 Global Subscription Feature Control                   ║
║  Enable or disable for all tenants          [●────] Enabled║
║  ─────────────────────────────────────────────────────────║
║                                                            ║
║  🏢 Tenant Subscription Control                           ║
║  Enable or disable for "Karon" tenant       [●────] Enabled║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### Visual Indicators

**Global Control:**
- Icon: 🌐 (Globe)
- Enabled: Green badge
- Disabled: Gray badge

**Tenant Control:**
- Icon: 🏢 (Building)
- Enabled: Blue badge
- Disabled: Orange badge
- Disabled state: When global is off

---

## Usage Guide

### For Super Admin

#### Step 1: Enable Global Subscription
1. Go to Manage Users page
2. See "Subscription Settings" card at top
3. Toggle "Global Subscription Feature Control" to ON
4. Confirm action
5. Badge turns green "Enabled"

#### Step 2: Control Tenant Subscription
1. Select a tenant from "Tenant Name" dropdown
2. Tenant subscription control appears
3. Toggle "Tenant Subscription Control" to ON/OFF
4. Confirm action
5. Badge turns blue (enabled) or orange (disabled)

#### Step 3: Verify User Access
1. Users in enabled tenants can view subscriptions
2. Users in disabled tenants see "disabled" message
3. Individual user subscriptions can still be managed

---

## Use Cases

### Use Case 1: Trial Period for New Tenant
**Scenario**: New tenant "ABC Corp" joins, wants to try before enabling subscriptions

**Steps**:
1. Global subscription: Enabled
2. ABC Corp tenant: Disabled
3. Users can use platform but not subscribe
4. After trial, enable tenant subscription
5. Users can now subscribe

### Use Case 2: Suspend Problematic Tenant
**Scenario**: Tenant "XYZ Ltd" has payment issues

**Steps**:
1. Super Admin disables XYZ Ltd tenant subscription
2. All XYZ Ltd users lose subscription access
3. Existing subscriptions remain but cannot be renewed
4. Other tenants unaffected
5. Re-enable when issue resolved

### Use Case 3: Maintenance Mode
**Scenario**: Subscription system needs maintenance

**Steps**:
1. Disable global subscription
2. All tenants lose subscription access
3. Perform maintenance
4. Re-enable global subscription
5. All tenants regain access (if tenant-level enabled)

### Use Case 4: Selective Rollout
**Scenario**: New subscription feature, rollout gradually

**Steps**:
1. Enable global subscription
2. Enable for Tenant A (pilot)
3. Monitor usage
4. Enable for Tenant B, C, D
5. Eventually enable for all

---

## API Integration

### Check if User Can Subscribe

**Logic**:
```javascript
function canUserSubscribe(userId) {
  // 1. Check global setting
  const globalEnabled = getGlobalSubscriptionStatus();
  if (!globalEnabled) return false;
  
  // 2. Get user's tenant
  const tenantCode = getUserTenant(userId);
  
  // 3. Check tenant setting
  const tenantEnabled = getTenantSubscriptionStatus(tenantCode);
  if (!tenantEnabled) return false;
  
  // 4. Both enabled
  return true;
}
```

### Backend Validation

```csharp
public async Task<bool> CanUserSubscribe(string userId)
{
    // Check global setting
    var globalSettings = await _settingsService.GetGlobalSettings();
    if (!globalSettings.SubscriptionEnabled)
        return false;
    
    // Get user's tenant
    var user = await _userService.GetUser(userId);
    var tenantCode = user.TenantCode;
    
    // Check tenant setting
    var tenantSettings = await _settingsService.GetTenantSettings(tenantCode);
    if (!tenantSettings.SubscriptionEnabled)
        return false;
    
    return true;
}
```

---

## Database Schema

### TenantSubscriptionSettings Table

```sql
CREATE TABLE TenantSubscriptionSettings (
    TenantSettingId INT PRIMARY KEY IDENTITY(1,1),
    TenantCode NVARCHAR(50) NOT NULL UNIQUE,
    SubscriptionEnabled BIT DEFAULT 1,
    UpdatedBy NVARCHAR(50),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    CreatedDate DATETIME DEFAULT GETDATE()
);
```

### Sample Data

```sql
-- Karon tenant: Enabled
INSERT INTO TenantSubscriptionSettings 
VALUES ('KARON', 1, 'admin', GETDATE(), GETDATE());

-- SANDV tenant: Disabled
INSERT INTO TenantSubscriptionSettings 
VALUES ('SANDV', 0, 'admin', GETDATE(), GETDATE());

-- Dr. Mahesh tenant: Enabled
INSERT INTO TenantSubscriptionSettings 
VALUES ('MAHESH', 1, 'admin', GETDATE(), GETDATE());
```

---

## Workflow Examples

### Example 1: Disable Tenant Subscription

**Before**:
- Global: Enabled ✓
- Karon Tenant: Enabled ✓
- Karon Users: Can subscribe ✓

**Action**: Super Admin disables Karon tenant subscription

**After**:
- Global: Enabled ✓
- Karon Tenant: Disabled ✗
- Karon Users: Cannot subscribe ✗
- Other Tenants: Unaffected

### Example 2: Re-enable After Maintenance

**Before**:
- Global: Disabled ✗ (maintenance)
- All Tenants: Cannot subscribe ✗

**Action**: Super Admin enables global subscription

**After**:
- Global: Enabled ✓
- Tenants with enabled setting: Can subscribe ✓
- Tenants with disabled setting: Still cannot subscribe ✗

---

## User Experience

### For Users in Enabled Tenant
1. Navigate to subscription page
2. See available plans
3. Can purchase subscriptions
4. Normal experience

### For Users in Disabled Tenant
1. Navigate to subscription page
2. See warning message:
   > "Subscription feature is currently disabled for your organization. Please contact your administrator."
3. Cannot view plans
4. Cannot purchase subscriptions

---

## Notifications

### When Tenant Subscription Disabled
**Recommended**: Send email to all tenant users
```
Subject: Subscription Access Temporarily Disabled

Dear User,

Subscription access has been temporarily disabled for your organization.
You will not be able to view or purchase subscription plans during this time.

Existing subscriptions remain active but cannot be renewed.

For questions, please contact your administrator.

Best regards,
System Administrator
```

### When Tenant Subscription Re-enabled
**Recommended**: Send email to all tenant users
```
Subject: Subscription Access Restored

Dear User,

Subscription access has been restored for your organization.
You can now view and purchase subscription plans.

Visit the subscription page to explore available plans.

Best regards,
System Administrator
```

---

## Reporting

### Subscription Status Report

```sql
-- Get subscription status for all tenants
SELECT 
    t.TNT_CODE,
    t.TNT_NAME,
    CASE WHEN tss.SubscriptionEnabled = 1 THEN 'Enabled' ELSE 'Disabled' END AS TenantStatus,
    COUNT(DISTINCT u.UserId) AS TotalUsers,
    COUNT(DISTINCT s.SubscriberId) AS ActiveSubscriptions
FROM Tenants t
LEFT JOIN TenantSubscriptionSettings tss ON t.TNT_CODE = tss.TenantCode
LEFT JOIN Users u ON t.TNT_CODE = u.TenantCode
LEFT JOIN Subscribers s ON u.UserId = s.UserId AND s.IsActive = 1
GROUP BY t.TNT_CODE, t.TNT_NAME, tss.SubscriptionEnabled
ORDER BY t.TNT_NAME;
```

---

## Testing Checklist

### Global Control
- [ ] Enable global subscription
- [ ] Disable global subscription
- [ ] Verify all tenants affected
- [ ] Confirmation dialog appears
- [ ] Toast notification shows

### Tenant Control
- [ ] Select tenant
- [ ] Enable tenant subscription
- [ ] Disable tenant subscription
- [ ] Verify only selected tenant affected
- [ ] Other tenants unaffected
- [ ] Cannot enable when global disabled

### User Experience
- [ ] User in enabled tenant can subscribe
- [ ] User in disabled tenant sees warning
- [ ] User in disabled tenant cannot view plans
- [ ] Existing subscriptions remain active
- [ ] Cannot renew in disabled tenant

### Edge Cases
- [ ] Disable global while tenant enabled
- [ ] Enable tenant while global disabled
- [ ] Switch between tenants
- [ ] Multiple admins changing settings
- [ ] Network error handling

---

## Troubleshooting

### Issue: Tenant control not appearing
**Solution**: Select a tenant from dropdown first

### Issue: Cannot enable tenant subscription
**Solution**: Enable global subscription first

### Issue: Users still see subscriptions after disabling
**Solution**: Users need to refresh page or re-login

### Issue: Tenant setting not saving
**Solution**: Check backend API, verify tenant code exists

---

## Best Practices

1. **Communication**: Notify users before disabling
2. **Gradual Rollout**: Enable for pilot tenants first
3. **Monitoring**: Track usage after enabling
4. **Documentation**: Keep record of why disabled
5. **Regular Review**: Audit tenant settings monthly

---

## Future Enhancements

- [ ] Scheduled enable/disable (time-based)
- [ ] Bulk tenant operations
- [ ] Tenant subscription analytics
- [ ] Auto-disable on payment failure
- [ ] Tenant-specific subscription plans
- [ ] Usage limits per tenant
- [ ] Tenant subscription history
- [ ] Email notifications on status change

---

## Version History

**v1.0** - Initial Implementation
- Global subscription control
- Tenant-level subscription control
- Two-level hierarchy
- Super Admin UI
- Complete documentation
