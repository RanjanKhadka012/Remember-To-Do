# Remember-To-Do

A fully functional calendar and task management application built with HTML, CSS, and JavaScript, inspired by Google Calendar design.

## Features

✅ **Calendar Grid Layout**
- Month view with proper day headers
- Current date highlighting
- Navigation between months
- Mini calendar in sidebar

✅ **Event Management**
- Create new events by clicking "Create" button or double-clicking on a day
- Edit existing events by clicking on them
- Delete events with confirmation
- Multiple calendar categories (Personal, Work, Family)
- Event persistence using localStorage

✅ **Google Calendar Design**
- Authentic Google Calendar styling with Remember-To-Do branding
- Material Design icons and colors
- Responsive design for mobile devices
- Professional typography (Roboto font)

✅ **Interactive Features**
- Click on dates to select them
- Navigate between periods with arrow buttons (adapts to current view)
- "Today" button to jump to current date
- Full view switching between Day, Week, Month, and Year views
- Click on time slots to create events at specific times

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The calendar will display the current month
3. Today's date is highlighted in blue

### Creating Events
1. Click the "Create" button in the sidebar, OR
2. Double-click on any calendar day
3. Fill in event details:
   - Title (required)
   - Date (required)
   - Start and end times
   - Description
   - Calendar category
4. Click "Save" to create the event

### Managing Events
- **View Events**: Events appear as colored bars on calendar days
- **Edit Events**: Click on any event to edit it
- **Delete Events**: Edit an event and click the "Delete" button

### Navigation
- **Previous/Next Navigation**: Use arrow buttons in header (adapts to current view)
  - Month view: Navigate by month
  - Week view: Navigate by week  
  - Day view: Navigate by day
  - Year view: Navigate by year
- **Today**: Click "Today" button to jump to current date
- **View Switching**: Use Day/Week/Month/Year buttons to change views
- **Select Date**: Click on any date to select it
- **Mini Calendar**: Use the small calendar in sidebar for quick navigation

### Calendar Categories
Events are color-coded by category:
- **Personal**: Blue
- **Work**: Orange
- **Family**: Green

### Sample Events
The calendar comes with a few sample events to demonstrate functionality:
- Team Meeting (Work)
- Lunch with Mom (Family)
- Gym Session (Personal)

## Technical Details

### File Structure
```
remember-to-do-app/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
└── js/
    └── calendar.js     # Calendar functionality
```

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Uses localStorage for event persistence

### Dependencies
- Google Fonts (Roboto)
- Material Icons
- No JavaScript frameworks required

## Customization

### Adding New Calendar Categories
1. Edit the HTML in `index.html` to add new checkboxes in the "My calendars" section
2. Add corresponding CSS color classes in `styles.css`
3. Update the select options in the event modal

### Modifying Colors
Edit the CSS custom properties in `styles.css`:
- `.calendar-color.personal` - Personal events color
- `.calendar-color.work` - Work events color
- `.calendar-color.family` - Family events color

### Adding More Views
The infrastructure for Day, Week, and Year views is in place. Implement the rendering logic in the `switchView()` method in `calendar.js`.

## Future Enhancements
- Event time conflicts detection
- Recurring events  
- Event reminders
- Import/Export functionality
- Multiple calendar support
- Drag and drop event moving
- All-day events support
- Event categories and color customization

Enjoy your Remember-To-Do calendar! 🗓️