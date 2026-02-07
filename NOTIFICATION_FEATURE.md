# Notification System - Implementation Guide

## Overview

A comprehensive notification component has been implemented with a dropdown panel that displays all notifications with various features and actions.

## Components Created

### 1. **NotificationPanel.tsx**

- Main notification dropdown component
- Displays all notifications in a scrollable list
- Located at: `src/components/notification/NotificationPanel.tsx`

**Features:**

- Shows unread notification count in header
- "Mark all as read" button (appears only when unread notifications exist)
- "Clear all" button with confirmation dialog
- Click outside to close the panel
- Empty state message when no notifications exist
- Responsive design that scales to fit the viewport

### 2. **NotificationItem.tsx**

- Individual notification item component
- Located at: `src/components/notification/NotificationItem.tsx`

**Features:**

- Color-coded by notification type (notice, event, announcement, alert)
- Priority badge (high, medium, low) with color coding
- Relative timestamp (e.g., "2m ago", "1h ago")
- Mark as read button with checkmark icon
- Delete button for individual notifications
- Shows unread indicator (blue dot)
- Hover effects for better UX
- Responsive and compact design

### 3. **Topbar.component.tsx** (Updated)

- Integration point for the notification system
- Located at: `src/components/dashboard/topBar/Topbar.component.tsx`

**Changes:**

- Imported `useNotificationContext` hook
- Imported `NotificationPanel` component
- Added `isNotificationOpen` state to manage panel visibility
- Updated bell icon to be clickable and opens/closes the panel
- Dynamic badge showing unread count (displays "9+" for counts > 9)
- Notification panel renders conditionally

## How It Works

### Opening Notifications

1. Click the bell icon in the top-right corner of the Topbar
2. The notification panel opens as a dropdown
3. Click the bell icon again or click outside the panel to close it

### Features in Action

**Mark Single Notification as Read:**

- Hover over a notification
- Click the checkmark icon (appears only if notification is unread)
- Notification immediately marks as read

**Mark All as Read:**

- Click the "Mark all as read" button at the bottom of the panel
- All notifications instantly mark as read
- Button disappears when no unread notifications exist

**Delete Individual Notification:**

- Hover over a notification
- Click the trash icon
- Notification is immediately removed

**Clear All Notifications:**

- Click the "Clear all" button at the bottom of the panel
- A confirmation dialog appears
- Click "Delete All" to confirm or "Cancel" to abort
- All notifications are removed from the panel

### Notification Types & Colors

- **Notice**: Blue background with blue left border
- **Event**: Purple background with purple left border
- **Announcement**: Green background with green left border
- **Alert**: Red background with red left border

### Priority Levels

- **High**: Red text and badge
- **Medium**: Orange text and badge
- **Low**: Green text and badge

## Context Integration

The notification system uses the existing **NotificationContext** with the following methods:

```typescript
interface INotificationContext {
  notifications: INotification[]; // Array of all notifications
  unreadCount: number; // Count of unread notifications
  addNotification: (notification) => void; // Add a new notification
  markAsRead: (notificationId) => void; // Mark single notification as read
  markAllAsRead: () => void; // Mark all notifications as read
  removeNotification: (notificationId) => void; // Delete a notification
  clearAll: () => void; // Clear all notifications
}
```

The provider automatically listens to WebSocket events for:

- `notice:new` - New notice notifications
- `event:new` - New event notifications
- `announcement:new` - New announcement notifications

## Notification Data Structure

```typescript
interface INotification {
  id: string;
  type: "notice" | "event" | "announcement" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: "low" | "medium" | "high";
  metadata?: {
    noticeId?: string;
    eventId?: string;
    link?: string;
    [key: string]: unknown;
  };
}
```

## Styling

All components use **Tailwind CSS** for styling:

- Responsive design with proper breakpoints
- Smooth transitions and hover effects
- Color-coded UI elements
- Proper spacing and padding

## Usage Example

To add a notification programmatically:

```typescript
import { useNotificationContext } from "src/context/notification/useNotificationContext";

function MyComponent() {
  const { addNotification } = useNotificationContext();

  const handleClick = () => {
    addNotification({
      id: "notification-1",
      type: "notice",
      title: "New Notice",
      message: "This is a sample notification message",
      timestamp: new Date(),
      read: false,
      priority: "high",
      metadata: {
        noticeId: "123",
      },
    });
  };

  return <button onClick={handleClick}>Notify</button>;
}
```

## Browser Compatibility

The notification system works in all modern browsers that support:

- React 18+
- CSS Flexbox and Grid
- ES6+ JavaScript features

## Performance Considerations

- Maximum of 50 notifications are stored (configurable via `MAX_NOTIFICATIONS` in the provider)
- Old notifications are automatically removed when limit is exceeded
- Notifications are stored in state, not persisted to local storage
- Panel closes on logout and when user is unauthenticated
