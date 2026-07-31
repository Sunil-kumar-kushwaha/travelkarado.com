"use client";
import { useState } from "react";
import "./CalendarModal.css";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function isSameDay(a, b) {
    return (
        a &&
        b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/**
 * Generic calendar picker. Used inside any Input of type="date"
 * across Flights, Hotels, Buses, Holidays — pass minDate/title/onSelect only.
 */
export default function CalendarModal({
    isOpen,
    onClose,
    selectedDate,
    onSelect,
    minDate = new Date(),
    title = "Select Date",
    monthsToShow = 2,
}) {
    const today = new Date();
    const [viewDate, setViewDate] = useState(
        selectedDate
            ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
            : new Date(today.getFullYear(), today.getMonth(), 1)
    );

    if (!isOpen) return null;

    const goPrev = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goNext = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const isDisabled = (date) => {
        const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        return date < min;
    };

    const renderMonth = (year, month) => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${year}-${month}-${i}`} className="tk-cal-cell tk-cal-empty" />);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const disabled = isDisabled(date);
            const selected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);

            cells.push(
                <button
                    key={d}
                    type="button"
                    disabled={disabled}
                    className={`tk-cal-cell tk-cal-day ${selected ? "tk-cal-selected" : ""} ${isToday ? "tk-cal-today" : ""
                        }`}
                    onClick={() => onSelect(date)}
                >
                    {d}
                </button>
            );
        }

        return (
            <div className="tk-cal-month" key={`${year}-${month}`}>
                <div className="tk-cal-month-title">
                    {MONTHS[month]} {year}
                </div>
                <div className="tk-cal-weekdays">
                    {DAYS.map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </div>
                <div className="tk-cal-grid">{cells}</div>
            </div>
        );
    };

    const months = [];
    for (let i = 0; i < monthsToShow; i++) {
        const m = new Date(viewDate.getFullYear(), viewDate.getMonth() + i, 1);
        months.push(renderMonth(m.getFullYear(), m.getMonth()));
    }

    return (
        <div className="tk-cal-overlay" onClick={onClose}>
            <div className="tk-cal-modal" onClick={(e) => e.stopPropagation()}>
                <div className="tk-cal-header">
                    <button type="button" className="tk-cal-nav" onClick={goPrev} aria-label="Previous month">
                        &#8249;
                    </button>
                    <span className="tk-cal-title">{title}</span>
                    <button type="button" className="tk-cal-nav" onClick={goNext} aria-label="Next month">
                        &#8250;
                    </button>
                    <button type="button" className="tk-cal-close" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>
                <div className="tk-cal-body">{months}</div>
            </div>
        </div>
    );
}