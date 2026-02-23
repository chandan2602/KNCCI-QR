# Public Internships Component

## Overview
This component displays a public-facing list of internship programs with detailed view functionality. Users can browse internships without logging in, but must log in to enroll. Data is loaded dynamically from the API.

## Features
- **Table View**: Browse all internships in a table format
- **Details View**: Click "View Details" to see full internship information
- **Enroll Button**: Requires login to enroll
- **Smart Redirect**: After login, users return to the exact internship they were viewing
- **Dynamic Data**: Internships are loaded from the API in real-time
- **Responsive Design**: Works on all devices

## User Flow

### Not Logged In:
1. User browses internships table (data loaded from API)
2. Clicks "View Details" on any internship
3. Sees full details with image, description, company info
4. Clicks "Enroll Now" button
5. Redirected to login page
6. After successful login, automatically returns to the same internship details
7. Can now enroll

### Logged In:
1. User browses internships table
2. Clicks "View Details"
3. Sees full details
4. Clicks "Enroll Now" to enroll immediately

## Details View Includes:
- Internship image
- Certified/Uncertified badge
- Internship name and description
- Company information
- Duration, Location, Salary
- Deadline and Certification status
- Enroll Now button
- Back to List button

## API Integration

### Endpoint:
- `CourseSchedule/GetAllActiveCoursesByCategoryId/0/0`
  - First 0: Category ID (0 = all categories)
  - Second 0: Company ID (0 = all companies)

### Data Mapping:
- `COURSE_ID` → id
- `COURSE_NAME` → title
- `COMPANY_NAME` → company
- `COURSE_DURATION` → duration
- `LOCATION` → location
- `SALARY` → salary
- `COURSE_END_DATE` → deadline
- `COURSE_DESCRIPTION` → description
- `IS_CERTIFIED` → verified
- `COURSE_IMAGE` → IMAGE_URL

## Technical Implementation

### Session Storage Keys:
- `viewInternshipId`: Stores the internship ID when user needs to login
- `returnUrl`: Stores '/internships' for redirect after login
- `UserId`: Checks if user is logged in

### Routes:
- Public route: `/internships` - Browse and view details (no login required)
- Enrollment: Redirects to `eRP/view-course-details` with internship data

## Files Created
- `public-internships.component.ts` - Component logic with API integration
- `public-internships.component.html` - Table and details view template
- `public-internships.component.css` - Responsive styles

## Files Modified
- `src/app/components/public-header/public-header.component.html` - Added internships link
- `src/app/app-routing.module.ts` - Added route
- `src/app/app.module.ts` - Added component declaration

## Integration
- Works with existing login component
- Uses session storage for state management
- Loads data dynamically from API
- Seamless login/redirect flow
- Matches apprenticeships component behavior
