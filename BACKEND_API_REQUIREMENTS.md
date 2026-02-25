# Backend API Requirements - Subscription Control Feature

## Overview
New feature to allow Super Admin to enable/disable subscription functionality system-wide.

## Required API Endpoints

### 1. Get System Settings
**Endpoint**: `GET /api/SystemSettings/GetSettings`

**Description**: Retrieves current system settings including subscription status

**Response**:
```json
{
  "status": true,
  "data": {
    "subscriptionEnabled": false
  }
}
```

**Error Response**:
```json
{
  "status": false,
  "message": "Settings not found"
}
```

---

### 2. Update System Setting
**Endpoint**: `POST /api/SystemSettings/UpdateSetting`

**Description**: Updates a specific system setting (currently subscription toggle)

**Request Body**:
```json
{
  "settingKey": "subscriptionEnabled",
  "settingValue": true,
  "updatedBy": "userId123"
}
```

**Response**:
```json
{
  "status": true,
  "message": "Setting updated successfully"
}
```

**Error Response**:
```json
{
  "status": false,
  "message": "Failed to update setting"
}
```

---

### 3. Get User Subscription (Existing - Enhanced)
**Endpoint**: `GET /api/InternshipJobs/GetSubscriberByUserId/{userId}`

**Description**: Retrieves subscription details for a specific user

**Response**:
```json
{
  "status": true,
  "data": [
    {
      "subscriber_id": 123,
      "user_id": "user123",
      "subscription_type_id": 2,
      "subscription_name": "Gold",
      "start_date": "2025-01-01",
      "expired_date": "2025-01-31",
      "is_active": true,
      "jobs_count": 20,
      "internships_count": 15,
      "startups_count": 5
    }
  ]
}
```

---

### 4. Assign Subscription (Admin)
**Endpoint**: `POST /api/InternshipJobs/InsertSubscriber`

**Description**: Admin assigns a subscription to a user

**Request Body**:
```json
{
  "user_id": "user123",
  "subscription_type_id": 2,
  "start_date": "2025-01-01",
  "expired_date": "2025-01-31",
  "jobs_count": 20,
  "internships_count": 15,
  "startups_count": 5,
  "assigned_by": "admin123"
}
```

**Response**:
```json
{
  "status": true,
  "message": "Subscription assigned successfully"
}
```

---

### 5. Extend Subscription (NEW)
**Endpoint**: `POST /api/InternshipJobs/ExtendSubscription`

**Description**: Extends an existing subscription by specified days

**Request Body**:
```json
{
  "subscriber_id": 123,
  "expired_date": "2025-02-28",
  "extended_by": "admin123"
}
```

**Response**:
```json
{
  "status": true,
  "message": "Subscription extended successfully"
}
```

---

### 6. Cancel Subscription (NEW)
**Endpoint**: `POST /api/InternshipJobs/CancelSubscription`

**Description**: Cancels/deactivates a user's subscription

**Request Body**:
```json
{
  "subscriber_id": 123,
  "cancelled_by": "admin123"
}
```

**Response**:
```json
{
  "status": true,
  "message": "Subscription cancelled successfully"
}
```

---

### 7. Get All Subscription Packages (Existing)
**Endpoint**: `GET /api/InternshipJobs/GetAllSubscriptionPackage`

**Description**: Retrieves all available subscription plans

**Response**:
```json
{
  "status": true,
  "data": [
    {
      "subscription_type_id": 1,
      "name": "Silver",
      "amount": 1000,
      "jobs_count": 10,
      "internships_count": 5,
      "startups_count": 2,
      "subscription_type": "Student",
      "bg_colour": "#C0C0C0"
    }
  ]
}
```

---

### 8. Get Tenant Subscription Status (NEW)
**Endpoint**: `GET /api/SystemSettings/GetTenantSubscriptionStatus/{tenantCode}`

**Description**: Retrieves subscription status for a specific tenant

**Response**:
```json
{
  "status": true,
  "data": {
    "tenantCode": "KARON",
    "tenantName": "Karon University",
    "subscriptionEnabled": true
  }
}
```

---

### 9. Update Tenant Subscription (NEW)
**Endpoint**: `POST /api/SystemSettings/UpdateTenantSubscription`

**Description**: Enable/disable subscription for a specific tenant

**Request Body**:
```json
{
  "tenantCode": "KARON",
  "subscriptionEnabled": false,
  "updatedBy": "admin123"
}
```

**Response**:
```json
{
  "status": true,
  "message": "Tenant subscription updated successfully"
}
```

---

## Database Implementation

### Suggested Table Structure

```sql
CREATE TABLE SystemSettings (
    SettingId INT PRIMARY KEY IDENTITY(1,1),
    SettingKey NVARCHAR(100) UNIQUE NOT NULL,
    SettingValue NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(500),
    UpdatedBy NVARCHAR(50),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Create index for faster lookups
CREATE INDEX IX_SystemSettings_SettingKey ON SystemSettings(SettingKey);

-- Insert default subscription setting
INSERT INTO SystemSettings (SettingKey, SettingValue, Description, UpdatedBy)
VALUES ('subscriptionEnabled', 'false', 'Controls whether subscription feature is available to users', 'system');
```

### Subscription Tables Enhancement

```sql
-- Add audit columns to existing Subscribers table
ALTER TABLE Subscribers ADD AssignedBy NVARCHAR(50);
ALTER TABLE Subscribers ADD ExtendedBy NVARCHAR(50);
ALTER TABLE Subscribers ADD CancelledBy NVARCHAR(50);
ALTER TABLE Subscribers ADD CancelledDate DATETIME;
ALTER TABLE Subscribers ADD IsActive BIT DEFAULT 1;

-- Or create new table if doesn't exist
CREATE TABLE Subscribers (
    SubscriberId INT PRIMARY KEY IDENTITY(1,1),
    UserId NVARCHAR(50) NOT NULL,
    SubscriptionTypeId INT NOT NULL,
    StartDate DATETIME NOT NULL,
    ExpiredDate DATETIME NOT NULL,
    JobsCount INT,
    InternshipsCount INT,
    StartupsCount INT,
    IsActive BIT DEFAULT 1,
    AssignedBy NVARCHAR(50),
    ExtendedBy NVARCHAR(50),
    CancelledBy NVARCHAR(50),
    CancelledDate DATETIME,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);
```

### Tenant Subscription Settings Table (NEW)

```sql
-- Table to store tenant-level subscription settings
CREATE TABLE TenantSubscriptionSettings (
    TenantSettingId INT PRIMARY KEY IDENTITY(1,1),
    TenantCode NVARCHAR(50) NOT NULL UNIQUE,
    SubscriptionEnabled BIT DEFAULT 1,
    UpdatedBy NVARCHAR(50),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Create index for faster lookups
CREATE INDEX IX_TenantSubscriptionSettings_TenantCode 
ON TenantSubscriptionSettings(TenantCode);

-- Insert default settings for existing tenants
INSERT INTO TenantSubscriptionSettings (TenantCode, SubscriptionEnabled, UpdatedBy)
SELECT TNT_CODE, 1, 'system'
FROM Tenants
WHERE TNT_CODE NOT IN (SELECT TenantCode FROM TenantSubscriptionSettings);
```

### Optional: Audit Table

```sql
CREATE TABLE SystemSettingsAudit (
    AuditId INT PRIMARY KEY IDENTITY(1,1),
    SettingKey NVARCHAR(100) NOT NULL,
    OldValue NVARCHAR(MAX),
    NewValue NVARCHAR(MAX),
    ChangedBy NVARCHAR(50),
    ChangedDate DATETIME DEFAULT GETDATE()
);

-- Subscription Management Audit
CREATE TABLE SubscriptionAudit (
    AuditId INT PRIMARY KEY IDENTITY(1,1),
    SubscriberId INT NOT NULL,
    UserId NVARCHAR(50) NOT NULL,
    Action NVARCHAR(50) NOT NULL, -- 'ASSIGNED', 'EXTENDED', 'CANCELLED'
    OldExpiryDate DATETIME,
    NewExpiryDate DATETIME,
    PerformedBy NVARCHAR(50),
    PerformedDate DATETIME DEFAULT GETDATE(),
    Notes NVARCHAR(500)
);
```

---

## C# Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class SystemSettingsController : ControllerBase
{
    private readonly ISystemSettingsService _settingsService;

    public SystemSettingsController(ISystemSettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet("GetSettings")]
    public async Task<IActionResult> GetSettings()
    {
        try
        {
            var settings = await _settingsService.GetAllSettingsAsync();
            return Ok(new { status = true, data = settings });
        }
        catch (Exception ex)
        {
            return BadRequest(new { status = false, message = ex.Message });
        }
    }

    [HttpPost("UpdateSetting")]
    public async Task<IActionResult> UpdateSetting([FromBody] UpdateSettingRequest request)
    {
        try
        {
            await _settingsService.UpdateSettingAsync(
                request.SettingKey, 
                request.SettingValue, 
                request.UpdatedBy
            );
            
            return Ok(new { 
                status = true, 
                message = "Setting updated successfully" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { status = false, message = ex.Message });
        }
    }
}

public class UpdateSettingRequest
{
    public string SettingKey { get; set; }
    public bool SettingValue { get; set; }
    public string UpdatedBy { get; set; }
}
```

### Subscription Management Controller

```csharp
[ApiController]
[Route("api/InternshipJobs")]
public class SubscriptionManagementController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionManagementController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpPost("ExtendSubscription")]
    public async Task<IActionResult> ExtendSubscription([FromBody] ExtendSubscriptionRequest request)
    {
        try
        {
            await _subscriptionService.ExtendSubscriptionAsync(
                request.SubscriberId,
                request.ExpiredDate,
                request.ExtendedBy
            );

            // Log audit trail
            await _subscriptionService.LogAuditAsync(
                request.SubscriberId,
                "EXTENDED",
                request.ExtendedBy,
                $"Extended to {request.ExpiredDate}"
            );

            return Ok(new { 
                status = true, 
                message = "Subscription extended successfully" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { status = false, message = ex.Message });
        }
    }

    [HttpPost("CancelSubscription")]
    public async Task<IActionResult> CancelSubscription([FromBody] CancelSubscriptionRequest request)
    {
        try
        {
            await _subscriptionService.CancelSubscriptionAsync(
                request.SubscriberId,
                request.CancelledBy
            );

            // Log audit trail
            await _subscriptionService.LogAuditAsync(
                request.SubscriberId,
                "CANCELLED",
                request.CancelledBy,
                "Subscription cancelled by admin"
            );

            return Ok(new { 
                status = true, 
                message = "Subscription cancelled successfully" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { status = false, message = ex.Message });
        }
    }

    [HttpPost("InsertSubscriber")]
    public async Task<IActionResult> InsertSubscriber([FromBody] InsertSubscriberRequest request)
    {
        try
        {
            var subscriberId = await _subscriptionService.InsertSubscriberAsync(request);

            // Log audit trail
            await _subscriptionService.LogAuditAsync(
                subscriberId,
                "ASSIGNED",
                request.AssignedBy,
                $"Assigned subscription type {request.SubscriptionTypeId}"
            );

            return Ok(new { 
                status = true, 
                message = "Subscription assigned successfully" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { status = false, message = ex.Message });
        }
    }
}

public class ExtendSubscriptionRequest
{
    public int SubscriberId { get; set; }
    public DateTime ExpiredDate { get; set; }
    public string ExtendedBy { get; set; }
}

public class CancelSubscriptionRequest
{
    public int SubscriberId { get; set; }
    public string CancelledBy { get; set; }
}

public class InsertSubscriberRequest
{
    public string UserId { get; set; }
    public int SubscriptionTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime ExpiredDate { get; set; }
    public int JobsCount { get; set; }
    public int InternshipsCount { get; set; }
    public int StartupsCount { get; set; }
    public string AssignedBy { get; set; }
}
```

---

## Testing Checklist

- [ ] Create SystemSettings table
- [ ] Insert default subscriptionEnabled = false
- [ ] Test GET /api/SystemSettings/GetSettings
- [ ] Test POST /api/SystemSettings/UpdateSetting with true
- [ ] Test POST /api/SystemSettings/UpdateSetting with false
- [ ] Verify setting persists after update
- [ ] Test error handling for invalid requests
- [ ] Add authorization check (Super Admin only)

---

## Security Considerations

1. **Authorization**: Only Super Admin (RoleId = 4) should access these endpoints
2. **Validation**: Validate settingKey to prevent SQL injection
3. **Audit Trail**: Log all setting changes with user and timestamp
4. **Default State**: Default to disabled (false) for security

---

## Frontend Integration

The frontend components have been updated:
- `SystemSettingsComponent`: Super Admin UI to toggle subscription
- `SubscribeComponent`: Checks subscription status before showing plans
- Route: `/HOME/system-settings` (Super Admin only)

---

## Deployment Notes

1. Run database migration to create SystemSettings table
2. Deploy backend API changes
3. Deploy frontend changes
4. Verify Super Admin can access system-settings page
5. Test subscription toggle functionality
6. Communicate feature to Super Admin users
