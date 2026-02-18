# Public Header Component

A reusable header component for all public-facing pages in the KNCCI Portal application.

## Features

- Fixed header with KNCCI logo (45px height - smaller and more proportional)
- Navigation links (Home, Courses, Jobs, Internships, Start-Ups, About, Contact)
- Login and Sign Up buttons
- Fully responsive design
- Mobile-friendly with offcanvas menu
- Smooth animations and hover effects

## Usage

Simply add the component selector to any page template:

```html
<app-public-header></app-public-header>

<!-- Your page content here -->
```

## Example Implementation

### In Login Page (already implemented):
```html
<app-public-header></app-public-header>

<div class="login-container">
  <!-- Login content -->
</div>
```

### In Any Other Public Page:
```html
<app-public-header></app-public-header>

<div class="page-content">
  <!-- Your page content -->
</div>
```

## Styling Notes

- The header is fixed at the top with `position: fixed`
- Add `padding-top: 70px` to your page content to account for the fixed header
- The component includes its own responsive styles
- Logo size: 45px (desktop), 40px (tablet), 35px (mobile), 30px (small mobile)

## Navigation Routes

The header uses Angular routing with the following routes:
- Home: `/default`
- Courses: `/corporate`
- Jobs: `/job`
- Internships: `/internship`
- Start-Ups: `/corporate`
- About: `/about`
- Contact: `/contacts`
- Login: `/login`
- Sign Up: Opens modal with `#signupModal`

## Responsive Behavior

- **Desktop (>1024px)**: Full navigation menu visible
- **Tablet (768px-1024px)**: Slightly smaller logo and spacing
- **Mobile (<768px)**: Navigation hidden, hamburger menu shown
- **Small Mobile (<480px)**: Compact buttons and smallest logo

## Customization

To customize the header, edit the following files:
- `public-header.component.html` - Structure and content
- `public-header.component.css` - Styling and responsive design
- `public-header.component.ts` - Logic and navigation
