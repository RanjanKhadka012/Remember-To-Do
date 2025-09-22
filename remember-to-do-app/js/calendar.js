class RememberToDoCalendar {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.selectedDate = null;
        this.events = this.loadEvents();
        this.isEditMode = false;
        this.editingEventId = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        // Ensure month view is active by default
        this.switchView('month');
        this.renderMiniCalendar();
    }
    
    setupEventListeners() {
        // Navigation buttons - will be dynamically updated based on view
        this.updateNavigationForView(this.currentView);
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
        
        // Mini calendar navigation
        document.getElementById('miniPrevBtn').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('miniNextBtn').addEventListener('click', () => this.navigateMonth(1));
        
        // View selector
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });
        
        // Create event button
        document.getElementById('createEventBtn').addEventListener('click', () => this.openEventModal());
        
        // Modal event listeners
        document.getElementById('closeModal').addEventListener('click', () => this.closeEventModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeEventModal());
        document.getElementById('saveEventBtn').addEventListener('click', () => this.saveEvent());
        document.getElementById('deleteEventBtn').addEventListener('click', () => this.deleteEvent());
        
        // Close modal when clicking outside
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeEventModal();
            }
        });
        
        // Form submission
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
    }
    
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date);
            calendarGrid.appendChild(dayElement);
        }
    }
    
    createDayElement(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
        const isToday = this.isToday(date);
        const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);
        
        if (!isCurrentMonth) {
            dayElement.classList.add('other-month');
        }
        if (isToday) {
            dayElement.classList.add('today');
        }
        if (isSelected) {
            dayElement.classList.add('selected');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        // Add events for this day
        const dayEvents = this.getEventsForDate(date);
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `event ${event.calendar}`;
            eventElement.textContent = event.title;
            eventElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editEvent(event);
            });
            dayElement.appendChild(eventElement);
        });
        
        // Add click listener for day
        dayElement.addEventListener('click', () => {
            this.selectDate(date);
        });
        
        // Add double-click listener to create event
        dayElement.addEventListener('dblclick', () => {
            this.openEventModal(date);
        });
        
        return dayElement;
    }
    
    renderMiniCalendar() {
        const miniCalendarGrid = document.getElementById('miniCalendarGrid');
        miniCalendarGrid.innerHTML = '';
        
        // Add day headers for mini calendar
        const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'mini-day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = 'text-align: center; font-size: 11px; color: #5f6368; padding: 4px 0;';
            miniCalendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Generate 42 days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const miniDay = document.createElement('div');
            miniDay.className = 'mini-day';
            miniDay.textContent = date.getDate();
            
            const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
            const isToday = this.isToday(date);
            const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);
            
            if (!isCurrentMonth) {
                miniDay.classList.add('other-month');
            }
            if (isToday) {
                miniDay.classList.add('today');
            }
            if (isSelected) {
                miniDay.classList.add('selected');
            }
            
            miniDay.addEventListener('click', () => {
                this.selectDate(date);
            });
            
            miniCalendarGrid.appendChild(miniDay);
        }
    }
    
    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.updateCurrentMonthDisplay();
    }
    
    navigateDay(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.updateCurrentMonthDisplay();
    }
    
    navigateWeek(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.updateCurrentMonthDisplay();
    }
    
    navigateYear(direction) {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + direction);
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.updateCurrentMonthDisplay();
    }
    
    goToToday() {
        this.currentDate = new Date();
        this.selectDate(new Date());
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.updateCurrentMonthDisplay();
    }
    
    updateCurrentMonthDisplay() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        let displayText;
        
        switch(this.currentView) {
            case 'day':
                const dayOptions = { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                };
                displayText = this.currentDate.toLocaleDateString('en-US', dayOptions);
                break;
            case 'week':
                const startOfWeek = new Date(this.currentDate);
                startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                
                if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
                    displayText = `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
                } else {
                    displayText = `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
                }
                break;
            case 'year':
                displayText = this.currentDate.getFullYear().toString();
                break;
            default: // month
                displayText = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
        
        document.getElementById('currentMonth').textContent = displayText;
        
        // Mini calendar always shows month view
        const miniMonthYear = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('miniMonth').textContent = miniMonthYear;
    }
    
    selectDate(date) {
        this.selectedDate = new Date(date);
        this.renderCurrentView();
        this.renderMiniCalendar();
    }
    
    renderCurrentView() {
        switch(this.currentView) {
            case 'day':
                this.renderDayView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'month':
                this.renderCalendar();
                break;
            case 'year':
                this.renderYearView();
                break;
            default:
                this.renderCalendar();
        }
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Hide all views
        document.querySelectorAll('.month-view, .day-view, .week-view, .year-view').forEach(viewEl => {
            viewEl.classList.remove('active');
        });
        
        // Show selected view
        document.getElementById(view + 'View').classList.add('active');
        
        // Update navigation logic based on view
        this.updateNavigationForView(view);
        
        // Render the selected view
        this.renderCurrentView();
        this.updateCurrentMonthDisplay();
    }
    
    updateNavigationForView(view) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Remove existing event listeners
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        
        // Get new references and add appropriate listeners
        const newPrevBtn = document.getElementById('prevBtn');
        const newNextBtn = document.getElementById('nextBtn');
        
        switch(view) {
            case 'day':
                newPrevBtn.addEventListener('click', () => this.navigateDay(-1));
                newNextBtn.addEventListener('click', () => this.navigateDay(1));
                break;
            case 'week':
                newPrevBtn.addEventListener('click', () => this.navigateWeek(-1));
                newNextBtn.addEventListener('click', () => this.navigateWeek(1));
                break;
            case 'month':
                newPrevBtn.addEventListener('click', () => this.navigateMonth(-1));
                newNextBtn.addEventListener('click', () => this.navigateMonth(1));
                break;
            case 'year':
                newPrevBtn.addEventListener('click', () => this.navigateYear(-1));
                newNextBtn.addEventListener('click', () => this.navigateYear(1));
                break;
        }
    }
    
    openEventModal(date = null) {
        this.isEditMode = false;
        this.editingEventId = null;
        
        document.getElementById('modalTitle').textContent = 'Add Event';
        document.getElementById('deleteEventBtn').style.display = 'none';
        
        // Clear form
        document.getElementById('eventForm').reset();
        
        // Set date if provided
        if (date) {
            document.getElementById('eventDate').value = this.formatDateForInput(date);
        } else if (this.selectedDate) {
            document.getElementById('eventDate').value = this.formatDateForInput(this.selectedDate);
        }
        
        // Set default times
        const now = new Date();
        const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
        
        document.getElementById('eventStartTime').value = this.formatTimeForInput(startTime);
        document.getElementById('eventEndTime').value = this.formatTimeForInput(endTime);
        
        document.getElementById('eventModal').classList.add('active');
        document.getElementById('eventTitle').focus();
    }
    
    editEvent(event) {
        this.isEditMode = true;
        this.editingEventId = event.id;
        
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('deleteEventBtn').style.display = 'inline-block';
        
        // Populate form with event data
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = this.formatDateForInput(new Date(event.date));
        document.getElementById('eventStartTime').value = event.startTime || '';
        document.getElementById('eventEndTime').value = event.endTime || '';
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventCalendar').value = event.calendar;
        
        document.getElementById('eventModal').classList.add('active');
        document.getElementById('eventTitle').focus();
    }
    
    closeEventModal() {
        document.getElementById('eventModal').classList.remove('active');
    }
    
    saveEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const date = document.getElementById('eventDate').value;
        const startTime = document.getElementById('eventStartTime').value;
        const endTime = document.getElementById('eventEndTime').value;
        const description = document.getElementById('eventDescription').value.trim();
        const calendar = document.getElementById('eventCalendar').value;
        
        if (!title || !date) {
            alert('Please fill in the title and date.');
            return;
        }
        
        const event = {
            id: this.isEditMode ? this.editingEventId : this.generateEventId(),
            title,
            date,
            startTime,
            endTime,
            description,
            calendar
        };
        
        if (this.isEditMode) {
            const index = this.events.findIndex(e => e.id === this.editingEventId);
            if (index !== -1) {
                this.events[index] = event;
            }
        } else {
            this.events.push(event);
        }
        
        this.saveEvents();
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.closeEventModal();
    }
    
    renderDayView() {
        const dayViewDate = document.getElementById('dayViewDate');
        const dayTimeColumn = document.getElementById('dayTimeColumn');
        const dayEventsColumn = document.getElementById('dayEventsColumn');
        
        // Update day view date header
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dayViewDate.textContent = this.currentDate.toLocaleDateString('en-US', options);
        
        // Generate time slots
        dayTimeColumn.innerHTML = '';
        dayEventsColumn.innerHTML = '';
        
        for (let hour = 0; hour < 24; hour++) {
            // Time slot
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            if (hour === 0) {
                timeSlot.textContent = '12 AM';
            } else if (hour < 12) {
                timeSlot.textContent = hour + ' AM';
            } else if (hour === 12) {
                timeSlot.textContent = '12 PM';
            } else {
                timeSlot.textContent = (hour - 12) + ' PM';
            }
            dayTimeColumn.appendChild(timeSlot);
            
            // Hour slot for events
            const hourSlot = document.createElement('div');
            hourSlot.className = 'hour-slot';
            hourSlot.dataset.hour = hour;
            
            // Add click listener for creating events
            hourSlot.addEventListener('click', () => {
                const eventDate = new Date(this.currentDate);
                this.openEventModal(eventDate);
                
                // Set default time based on clicked hour
                const defaultStartTime = String(hour).padStart(2, '0') + ':00';
                const defaultEndTime = String(hour + 1).padStart(2, '0') + ':00';
                document.getElementById('eventStartTime').value = defaultStartTime;
                document.getElementById('eventEndTime').value = defaultEndTime;
            });
            
            dayEventsColumn.appendChild(hourSlot);
        }
        
        // Add events to day view
        this.renderDayEvents();
    }
    
    renderDayEvents() {
        const dayEvents = this.getEventsForDate(this.currentDate);
        const dayEventsColumn = document.getElementById('dayEventsColumn');
        
        dayEvents.forEach(event => {
            if (event.startTime && event.endTime) {
                const startHour = parseInt(event.startTime.split(':')[0]);
                const startMinute = parseInt(event.startTime.split(':')[1]);
                const endHour = parseInt(event.endTime.split(':')[0]);
                const endMinute = parseInt(event.endTime.split(':')[1]);
                
                const eventElement = document.createElement('div');
                eventElement.className = `day-event ${event.calendar}`;
                eventElement.textContent = event.title;
                
                // Calculate position and height
                const topPercent = ((startHour * 60 + startMinute) / (24 * 60)) * 100;
                const heightPercent = (((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / (24 * 60)) * 100;
                
                eventElement.style.top = topPercent + '%';
                eventElement.style.height = heightPercent + '%';
                eventElement.style.left = '4px';
                eventElement.style.right = '4px';
                
                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editEvent(event);
                });
                
                dayEventsColumn.appendChild(eventElement);
            }
        });
    }
    
    renderWeekView() {
        const weekViewHeader = document.getElementById('weekViewHeader');
        const weekTimeColumn = document.getElementById('weekTimeColumn');
        const weekDaysContainer = document.getElementById('weekDaysContainer');
        
        // Clear existing content
        weekViewHeader.innerHTML = '';
        weekTimeColumn.innerHTML = '';
        weekDaysContainer.innerHTML = '';
        
        // Get start of week (Sunday)
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
        
        // Create week header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'week-time-header';
        timeHeader.textContent = 'GMT-7';
        weekViewHeader.appendChild(timeHeader);
        
        const dayHeaders = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'week-day-header';
            
            const dayName = document.createElement('div');
            dayName.className = 'week-day-name';
            dayName.textContent = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'week-day-number';
            if (this.isToday(day)) {
                dayNumber.classList.add('today');
            }
            dayNumber.textContent = day.getDate();
            
            dayHeader.appendChild(dayName);
            dayHeader.appendChild(dayNumber);
            weekViewHeader.appendChild(dayHeader);
            
            dayHeaders.push(day);
        }
        
        // Create time column
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            if (hour === 0) {
                timeSlot.textContent = '12 AM';
            } else if (hour < 12) {
                timeSlot.textContent = hour + ' AM';
            } else if (hour === 12) {
                timeSlot.textContent = '12 PM';
            } else {
                timeSlot.textContent = (hour - 12) + ' PM';
            }
            weekTimeColumn.appendChild(timeSlot);
        }
        
        // Create day columns
        dayHeaders.forEach((day, dayIndex) => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'week-day-column';
            
            for (let hour = 0; hour < 24; hour++) {
                const hourSlot = document.createElement('div');
                hourSlot.className = 'week-hour-slot';
                hourSlot.dataset.hour = hour;
                hourSlot.dataset.day = dayIndex;
                
                hourSlot.addEventListener('click', () => {
                    this.openEventModal(day);
                    const defaultStartTime = String(hour).padStart(2, '0') + ':00';
                    const defaultEndTime = String(hour + 1).padStart(2, '0') + ':00';
                    document.getElementById('eventStartTime').value = defaultStartTime;
                    document.getElementById('eventEndTime').value = defaultEndTime;
                });
                
                dayColumn.appendChild(hourSlot);
            }
            
            weekDaysContainer.appendChild(dayColumn);
            
            // Add events for this day
            this.renderWeekDayEvents(day, dayColumn);
        });
    }
    
    renderWeekDayEvents(day, dayColumn) {
        const dayEvents = this.getEventsForDate(day);
        
        dayEvents.forEach(event => {
            if (event.startTime && event.endTime) {
                const startHour = parseInt(event.startTime.split(':')[0]);
                const startMinute = parseInt(event.startTime.split(':')[1]);
                const endHour = parseInt(event.endTime.split(':')[0]);
                const endMinute = parseInt(event.endTime.split(':')[1]);
                
                const eventElement = document.createElement('div');
                eventElement.className = `week-event ${event.calendar}`;
                eventElement.textContent = event.title;
                
                const topPercent = ((startHour * 60 + startMinute) / (24 * 60)) * 100;
                const heightPercent = (((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / (24 * 60)) * 100;
                
                eventElement.style.top = topPercent + '%';
                eventElement.style.height = heightPercent + '%';
                eventElement.style.left = '2px';
                eventElement.style.right = '2px';
                
                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editEvent(event);
                });
                
                dayColumn.appendChild(eventElement);
            }
        });
    }
    
    renderYearView() {
        const yearTitle = document.getElementById('yearTitle');
        const yearGrid = document.getElementById('yearGrid');
        
        yearTitle.textContent = this.currentDate.getFullYear();
        yearGrid.innerHTML = '';
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        for (let month = 0; month < 12; month++) {
            const yearMonth = document.createElement('div');
            yearMonth.className = 'year-month';
            
            const monthName = document.createElement('div');
            monthName.className = 'year-month-name';
            monthName.textContent = monthNames[month];
            yearMonth.appendChild(monthName);
            
            const monthGrid = document.createElement('div');
            monthGrid.className = 'year-month-grid';
            
            // Add day headers
            const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            dayHeaders.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'year-day-header';
                dayHeader.textContent = day;
                monthGrid.appendChild(dayHeader);
            });
            
            // Generate month days
            const firstDay = new Date(this.currentDate.getFullYear(), month, 1);
            const lastDay = new Date(this.currentDate.getFullYear(), month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());
            
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                const yearDay = document.createElement('div');
                yearDay.className = 'year-day';
                yearDay.textContent = date.getDate();
                
                const isCurrentMonth = date.getMonth() === month;
                const isToday = this.isToday(date);
                const hasEvents = this.getEventsForDate(date).length > 0;
                
                if (!isCurrentMonth) {
                    yearDay.classList.add('other-month');
                }
                if (isToday) {
                    yearDay.classList.add('today');
                }
                if (hasEvents) {
                    yearDay.classList.add('has-events');
                }
                
                yearDay.addEventListener('click', () => {
                    this.currentDate = new Date(date);
                    this.selectDate(date);
                    this.switchView('month');
                });
                
                monthGrid.appendChild(yearDay);
            }
            
            yearMonth.appendChild(monthGrid);
            
            // Add click listener to month header
            monthName.addEventListener('click', () => {
                this.currentDate = new Date(this.currentDate.getFullYear(), month, 1);
                this.switchView('month');
            });
            
            yearGrid.appendChild(yearMonth);
        }
    }
    
    deleteEvent() {
        if (this.editingEventId && confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== this.editingEventId);
            this.saveEvents();
            this.renderCurrentView();
            this.renderMiniCalendar();
            this.closeEventModal();
        }
    }
    
    getEventsForDate(date) {
        const dateString = this.formatDateForInput(date);
        return this.events.filter(event => event.date === dateString);
    }
    
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }
    
    formatTimeForInput(date) {
        return date.toTimeString().slice(0, 5);
    }
    
    isToday(date) {
        const today = new Date();
        return this.isSameDay(date, today);
    }
    
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    loadEvents() {
        const saved = localStorage.getItem('rememberToDoEvents');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Return some sample events
        return [
            {
                id: 'sample1',
                title: 'Team Meeting',
                date: '2025-09-25',
                startTime: '10:00',
                endTime: '11:00',
                description: 'Weekly team sync',
                calendar: 'work'
            },
            {
                id: 'sample2',
                title: 'Lunch with Mom',
                date: '2025-09-26',
                startTime: '12:00',
                endTime: '13:00',
                description: '',
                calendar: 'family'
            },
            {
                id: 'sample3',
                title: 'Gym Session',
                date: '2025-09-27',
                startTime: '18:00',
                endTime: '19:30',
                description: 'Leg day',
                calendar: 'personal'
            }
        ];
    }
    
    saveEvents() {
        localStorage.setItem('rememberToDoEvents', JSON.stringify(this.events));
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RememberToDoCalendar();
});