# System Settings - Subscription Control

## Overview
This component provides Super Admin controls to enable/disable the subscription feature system-wide.

## Features

### Subscription Toggle
- **Enable/Disable**: Super Admin can toggle subscription feature on/off
- **Real-time Effect**: When disabled, users cannot access subscription plans or make payments
- **Warning Messages**: Users see appropriate messages when feature is disabled

## Access Control
- **Super Admin Only**: RoleId = 4
- Unauthorized users are redirected back with error message

## API Endpoints Required

### Backend Implementation Needed:

1. **GET /api/SystemSettings/GetSettings**
   - Returns current system settings
   - Response format:
   ```json
   {
     "status": true,
     "data": {
       "subscriptionEnabled": true
     }
   }
   ```

2. **POST /api/SystemSettings/UpdateSetting**
   - Updates a specific setting
   - Request payload:
   ```json
   {
     "settingKey": "subscriptionEnabled",
     "settingValue": true,
     "updatedBy": "userId"
   }
   ```
   - Response format:
   ```json
   {
     "status": true,
     "message": "Setting updated successfully"
   }
   ```

## Database Schema Suggestion

```sql
CREATE TABLE SystemSettings (
    SettingId INT PRIMARY KEY IDENTITY(1,1),
    SettingKey NVARCHAR(100) UNIQUE NOT NULL,
    SettingValue NVARCHAR(MAX) NOT NULL,
    UpdatedBy NVARCHAR(50),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

-- Insert default value
INSERT INTO SystemSettings (SettingKey, SettingValue, UpdatedBy)
VALUES ('subscriptionEnabled', 'false', 'system');
```

## Usage

### For Super Admin:
1. Navigate to `/HOME/system-settings`
2. Toggle the subscription switch
3. Confirm the action

### For Regular Users:
- When subscription is disabled, they see a warning message on the subscribe page
- Subscription cards are hidden
- Payment button is disabled

## Integration Points

### Subscribe Component
- Checks subscription status on load
- Disables payment functionality when feature is off
- Shows appropriate warning messages

### Future Enhancements
- Add more system-wide settings (e.g., job posting limits, course enrollment)
- Add audit log for setting changes
- Add email notifications when settings change
