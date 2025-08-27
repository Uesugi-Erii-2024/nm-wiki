// filepath: d:\other_project\my-wiki\my-wiki\docs\js\calendar.js
document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    // 优化后的事件格式，支持时间范围
    let backendEvents = [];

    fetch('data/calendar.json')
        .then(response => response.json())
        .then(events => {
            backendEvents = events;
            renderCalendar(currentYear, currentMonth);
        });

    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthViewButton = document.getElementById('month-view');
    const weekViewButton = document.getElementById('week-view');

    renderCalendar(currentYear, currentMonth);

    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    monthViewButton.addEventListener('click', () => {
        renderCalendar(currentYear, currentMonth);
    });

    weekViewButton.addEventListener('click', () => {
        renderWeekView(currentYear, currentMonth);
    });

    function renderCalendar(year, month) {
        currentMonthElement.textContent = `${year}年${month + 1}月`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        calendarGrid.innerHTML = '';

        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        weekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dayCell = createDayCell(day, true);
            calendarGrid.appendChild(dayCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = isSameDay(date, new Date());
            const dayCell = createDayCell(day, false, isToday);

            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            // 判断该日期是否在事件范围内
            const dayEvents = backendEvents.filter(event => {
                return isDateInRange(formattedDate, event.start_date, event.end_date);
            });

            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.style.backgroundColor = event.color;
                eventElement.style.borderLeftColor = darkenColor(event.color, 30);

                const eventTime = event.time ? `<small>${event.time}</small> ` : '';
                eventElement.innerHTML = `${eventTime}${event.title}`;
                eventElement.title = event.desc || '';
                dayCell.appendChild(eventElement);
            });

            calendarGrid.appendChild(dayCell);
        }

        const totalCells = 42;
        const cellsUsed = firstDayOfWeek + daysInMonth;
        const nextMonthDays = totalCells - cellsUsed;

        for (let day = 1; day <= nextMonthDays; day++) {
            const dayCell = createDayCell(day, true);
            calendarGrid.appendChild(dayCell);
        }
    }

    function createDayCell(day, isOtherMonth, isToday = false) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';

        if (isOtherMonth) {
            dayCell.classList.add('other-month');
        }

        if (isToday) {
            dayCell.classList.add('today');
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        return dayCell;
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;

        return '#' + (
            0x1000000 +
            (R < 0 ? 0 : R) * 0x10000 +
            (G < 0 ? 0 : G) * 0x100 +
            (B < 0 ? 0 : B)
        ).toString(16).slice(1);
    }

    // 判断某天是否在事件范围内
    function isDateInRange(dateStr, startStr, endStr) {
        const date = new Date(dateStr);
        const start = new Date(startStr);
        const end = new Date(endStr);
        return date >= start && date <= end;
    }

    function renderWeekView(year, month) {
        currentMonthElement.textContent = `${year}年${month + 1}月（周视图）`;
        calendarGrid.innerHTML = '';
        const today = new Date();
        const weekDay = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - weekDay);
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayCell = createDayCell(date.getDate(), false, isSameDay(date, today));
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dayEvents = backendEvents.filter(event => {
                return isDateInRange(formattedDate, event.start_date, event.end_date);
            });
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.style.backgroundColor = event.color;
                eventElement.style.borderLeftColor = darkenColor(event.color, 30);
                const eventTime = event.time ? `<small>${event.time}</small> ` : '';
                eventElement.innerHTML = `${eventTime}${event.title}`;
                eventElement.title = event.desc || '';
                dayCell.appendChild(eventElement);
            });
            calendarGrid.appendChild(dayCell);
        }
    }
});