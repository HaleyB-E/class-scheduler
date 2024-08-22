import React, { useRef, useEffect, MutableRefObject, useState, useCallback } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import Schedule from './Schedule';
import { testData } from './Data';

const Calendar = () => {
  const calendarRef: MutableRefObject<DayPilotCalendar|null> = useRef(null)

  const [enabledSchedules, setEnabledSchedules] = useState<string[]>([])

  const toggleScheduleVisibility = (source: string) => {
    const newArray = enabledSchedules.filter((x) => x !== source)
    if (newArray.length === enabledSchedules.length) {
      setEnabledSchedules([...enabledSchedules, source ]);
    } else {
      setEnabledSchedules(newArray)
    }
  }

  const isScheduleVisible = useCallback((source: string) => {
    return enabledSchedules.findIndex(sc => sc === source) >= 0;
  }, [enabledSchedules])

  const calendarConfig = {
    viewType: "Week" as const,
    durationBarVisible: false
  };

  useEffect(() => {
    const visibleSchedules = testData.filter(sch => isScheduleVisible(sch.source));

    const eventList = visibleSchedules.flatMap(sch => {
      return sch.events.map(ev => {return {...ev, backColor: sch.color}});
    })

    // get today so we can show current week in the calendar
    const startDateAsDate = new Date();
    const month = (startDateAsDate.getMonth() + 1).toString().padStart(2, "0");
    const day = startDateAsDate.getDate().toString().padStart(2, "0");
    const startDate = `${startDateAsDate.getFullYear()}-${month}-${day}`

    calendarRef.current!.control.update({startDate, events: eventList});
  }, [isScheduleVisible]);

  return (
    <div className="body-wrapper">
      <div className="schedule-list-wrapper">
        {testData.map(sch => (
          <Schedule
            data={sch}
            key={sch.source}
            isVisible={isScheduleVisible(sch.source)}
            setIsVisible={() => toggleScheduleVisibility(sch.source)}/>
        ))}
      </div>
      <div className="calendar-wrapper">
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default Calendar;
