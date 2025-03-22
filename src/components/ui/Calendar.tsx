// components/ui/Calendar.tsx

import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Event {
  title: string;
  start: Date;
  end: Date;
  tag?: string;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events: Event[] = [
  {
    title: "Schedule AI Post",
    start: new Date(2025, 2, 25, 10, 0),
    end: new Date(2025, 2, 25, 11, 0),
    tag: "AI",
  },
  {
    title: "Design Marketing Image",
    start: new Date(2025, 2, 26, 13, 0),
    end: new Date(2025, 2, 26, 14, 0),
    tag: "Marketing",
  },
];

const MyCalendar: React.FC = () => {
  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default MyCalendar;
