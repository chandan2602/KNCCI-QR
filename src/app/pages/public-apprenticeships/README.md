# Public Apprenticeships Component

## Overview
This component displays a public-facing list of apprenticeship programs with a detailed view, exactly matching the internal apprenticeships component behavior. Users can browse apprenticeships and view details without logging in, but must log in to enroll.

## Features
- **Table View**: Browse all apprenticeships in a table format
- **Details View**: Click "View Details" to see full apprenticeship information
- **Enroll Button**: Requires login to enroll
- **Smart Redirect**: After login, users return to the exact apprenticeship they were viewing
- **Responsive Design**: Works on all devices

## User Flow

### Not Logged In:
1. User browses apprenticeships table
2. Clicks "View Details" on any apprenticeship
3. Sees full details with image, description, requirements
4. Clicks "Enroll Now" button
5. Redirected to login page
6. After successful login, automatically returns to the same apprenticeship details
7. Can now enroll

### Logged In:
1. User browses apprenticeships table
2. Clicks "View Details"
3. Sees full details
4. Clicks "Enroll Now" to enroll immediately

## Details View Includes:
- Apprenticeship image
- Category badge
- Program name and description
- Company information
- Duration, Location, Stipend
- Start Date and Status
- Requirements list
- Enroll Now button
- Back to List button

## Technical Implementation

### Session Storage Keys:
- `viewApprenticeshipId`: Stores the apprenticeship ID when user needs to login
- `returnUrl`: Stores '/apprenticeships' for redirect after login
- `UserId`: Checks if user is logged in

### Routes:
- Public route: `/apprenticeships` - Browse and view details (no login required)
- Login redirect: Automatically returns to `/apprenticeships` with selected apprenticeship

## Files Modified
- `public-apprenticeships.component.ts` - Added details view logic and enrollment handling
- `public-apprenticeships.component.html` - Added details view template
- `public-apprenticeships.component.css` - Added details view styles

## Integration
- Works with existing login component
- Uses session storage for state management
- Matches internal apprenticeships component behavior
- Seamless login/redirect flow
