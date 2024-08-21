import React, { useRef, useEffect, MutableRefObject, useState, useCallback } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import Schedule from './Schedule';
import { ISchedule } from './types';

const styles = {
  wrap: {
    display: "flex",
    marginTop: "10px"
  },
  left: {
    marginRight: "10px",
    width: "25%"
  },
  main: {
    width: "70%"
  }
};

const testData: ISchedule[] =
[{
    source: "Gym",
    color: "#3498db",
    events: [
      {
        id: 1,
        text: "Test",
        start: "2024-07-30T10:30:00",
        end: "2024-07-30T12:30:00"
      },
      {
        id: 2,
        text: "Test2",
        start: "2024-08-03T10:30:00",
        end: "2024-08-03T12:30:00"
      },
    ]
  },
  {
    source: "Esh",
    color: "#eb984e",
    events: [
      {
        id: 3,
        text: "Test3",
        start: "2024-07-31T10:30:00",
        end: "2024-07-31T12:30:00"
      },
      {
        id: 4,
        text: "Test4",
        start: "2024-08-02T10:30:00",
        end: "2024-08-02T11:00:00"
      },
    ]
  }
]

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
    const startDate = "2024-07-28";

    calendarRef.current!.control.update({startDate, events: eventList});
  }, [isScheduleVisible]);

  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        {testData.map(sch => (
          <Schedule
            data={sch}
            key={sch.source}
            isVisible={isScheduleVisible(sch.source)}
            setIsVisible={() => toggleScheduleVisibility(sch.source)}/>
        ))}
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default Calendar;
