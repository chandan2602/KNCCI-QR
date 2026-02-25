# Manage Users Page Layout

## Page Structure (Super Admin View)

```
┌─────────────────────────────────────────────────────────────────┐
│  User Registration                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  👑 Subscription Settings                                        │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Global Subscription Feature Control                  [●─────]  │
│  ℹ Enable or disable the subscription feature         ✓ Enabled │
│     system-wide. When disabled, users cannot                    │
│     view or purchase subscription plans.                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Filters                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Tenant Name  │  │  User Role   │  │  + Add User  │         │
│  │ [Select...▼] │  │ [Select...▼] │  └──────────────┘         │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Users Table                                                     │
│  ═══════════════════════════════════════════════════════════════│
│  S.No │ User Name │ First Name │ Role │ Status │ Subscription │ Action │
│  ─────┼───────────┼────────────┼──────┼────────┼──────────────┼────────│
│   1   │ john@...  │ John       │Admin │Active  │ 👑 Subscription│  ✏️   │
│   2   │ jane@...  │ Jane       │User  │Active  │ 👑 Subscription│  ✏️   │
│   3   │ bob@...   │ Bob        │User  │Inactive│ 👑 Subscription│  ✏️   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Subscription Settings Card (Super Admin Only)

**Visual Design:**
```
╔═══════════════════════════════════════════════════════════╗
║  👑 Subscription Settings                                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  Global Subscription Feature Control                      ║
║                                                            ║
║  ℹ Enable or disable the subscription feature      [●────]║
║    system-wide. When disabled, users cannot         Enabled║
║    view or purchase subscription plans.                   ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

**Colors:**
- Header: Purple gradient (#667eea → #764ba2)
- Body: White background
- Toggle ON: Green (#28a745)
- Toggle OFF: Gray (#6c757d)
- Badge ON: Green with checkmark
- Badge OFF: Gray with X

**Behavior:**
- Hover: Card lifts with shadow
- Click toggle: Confirmation dialog appears
- After confirm: Badge updates, toast notification

---

### 2. Subscription Management Modal

**Triggered by:** Clicking "👑 Subscription" button in user row

**Modal Structure:**
```
╔═══════════════════════════════════════════════════════════╗
║  👑 Manage Subscription - John Doe                    [X] ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │ Current Subscription                                │  ║
║  │ ─────────────────────────────────────────────────── │  ║
║  │ Plan: Gold                Status: ✓ Active          │  ║
║  │ Start: 01-01-2025         Expiry: 31-01-2025       │  ║
║  │                                                      │  ║
║  │ Access: ✓ 20 Jobs  ✓ 15 Internships  ✓ 5 Startups │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                            ║
║  Subscription Actions                                     ║
║  ─────────────────────────────────────────────────────    ║
║                                                            ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │ ➕ Assign New Subscription                          │  ║
║  │ Plan: [Select...▼]    Duration: [30] days          │  ║
║  │ [Assign Subscription]                               │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                            ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │ 📅 Extend Current Subscription                      │  ║
║  │ Extend By: [30] days                                │  ║
║  │ [Extend Subscription]                               │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                            ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │ ❌ Cancel Subscription                              │  ║
║  │ This will immediately deactivate the subscription   │  ║
║  │ [Cancel Subscription]                               │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                            ║
║                                          [Close]          ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Responsive Behavior

### Desktop (> 768px)
- Subscription card: Full width with side-by-side layout
- Toggle on right side
- Table: All columns visible

### Tablet (768px - 1024px)
- Subscription card: Stacked layout
- Toggle below description
- Table: Horizontal scroll

### Mobile (< 768px)
- Subscription card: Full stacked
- Toggle full width
- Table: Vertical cards instead of table

---

## User Flow Diagram

```
Super Admin Login
       ↓
Navigate to Manage Users
       ↓
┌──────────────────────────────┐
│ See Subscription Settings    │
│ Card at Top                  │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Toggle Subscription          │
│ Enable/Disable               │
└──────────────────────────────┘
       ↓
Confirmation Dialog
       ↓
┌──────────────────────────────┐
│ Setting Saved                │
│ Toast Notification           │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Scroll to Users Table        │
└──────────────────────────────┘
       ↓
Click "Subscription" Button
       ↓
┌──────────────────────────────┐
│ Modal Opens                  │
│ - View Current Subscription  │
│ - Assign New                 │
│ - Extend Existing            │
│ - Cancel Active              │
└──────────────────────────────┘
       ↓
Perform Action
       ↓
┌──────────────────────────────┐
│ Success Message              │
│ Modal Updates                │
└──────────────────────────────┘
```

---

## Color Scheme

### Subscription Settings Card
- **Header Background**: Linear gradient
  - Start: #667eea (Purple)
  - End: #764ba2 (Dark Purple)
- **Header Text**: White (#ffffff)
- **Body Background**: White (#ffffff)
- **Border**: Light gray (#e0e0e0)

### Toggle Switch
- **Enabled**: Green (#28a745)
- **Disabled**: Gray (#6c757d)
- **Handle**: White (#ffffff)

### Status Badges
- **Enabled**: 
  - Background: Green (#28a745)
  - Text: White
  - Icon: Check circle
- **Disabled**: 
  - Background: Gray (#6c757d)
  - Text: White
  - Icon: Times circle

### Subscription Button
- **Background**: Purple (#9c27b0)
- **Hover**: Dark Purple (#7b1fa2)
- **Icon**: Gold crown (#ffd700)

---

## Accessibility Features

1. **Keyboard Navigation**
   - Tab through toggle switch
   - Enter/Space to toggle
   - Escape to close modal

2. **Screen Reader Support**
   - Toggle labeled "Subscription Feature Toggle"
   - Status announced on change
   - Modal title announced on open

3. **Visual Indicators**
   - High contrast colors
   - Clear enabled/disabled states
   - Icon + text for status

4. **Focus Management**
   - Focus on toggle when card loads
   - Focus trapped in modal
   - Focus returns to button on close

---

## Animation & Transitions

1. **Card Hover**: 
   - Transform: translateY(-2px)
   - Shadow: 0 6px 20px rgba(0,0,0,0.15)
   - Duration: 0.3s

2. **Toggle Switch**:
   - Slide animation: 0.2s ease
   - Color transition: 0.3s

3. **Badge Change**:
   - Fade out old badge: 0.15s
   - Fade in new badge: 0.15s

4. **Modal**:
   - Fade in backdrop: 0.15s
   - Slide down modal: 0.3s

---

## Implementation Notes

### HTML Structure
- Card uses Bootstrap 5 card component
- Toggle uses Bootstrap 5 form-switch
- Modal uses Bootstrap 5 modal

### CSS Classes
- `.subscription-control-card` - Main wrapper
- `.bg-gradient-purple` - Header gradient
- `.subscription-toggle` - Toggle switch
- `.badge-lg` - Large badge style

### JavaScript Events
- `(change)` on toggle - Triggers confirmation
- `(click)` on subscription button - Opens modal
- Confirmation uses native `confirm()` dialog

---

## Testing Checklist

- [ ] Card visible only to Super Admin
- [ ] Toggle works correctly
- [ ] Confirmation dialog appears
- [ ] Setting persists after page refresh
- [ ] Toast notification shows
- [ ] Badge updates correctly
- [ ] Responsive on mobile
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Modal opens from subscription button
- [ ] All subscription actions work
