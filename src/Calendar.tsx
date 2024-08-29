import React, { useRef, useEffect, MutableRefObject, useState, useCallback } from 'react';
import { DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import './CalendarStyles.css';
import Schedule from './Schedule';
import { getParsedData } from './data/Data';
import { ISchedule } from './types';

const Calendar = () => {
  const calendarRef: MutableRefObject<DayPilotCalendar|null> = useRef(null)
  const [enabledSchedules, setEnabledSchedules] = useState<string[]>([]);
  const [allSchedules, setAllSchedules] = useState<ISchedule[]>([]);

  useEffect(() => {
    getParsedData().then(resp => setAllSchedules(resp));
  },[])

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
    viewType: 'Days' as const,
    days: 7,
    durationBarVisible: false
  };

  useEffect(() => {
    const visibleSchedules = allSchedules.filter(sch => isScheduleVisible(sch.source));

    const eventList = visibleSchedules.flatMap(sch => {
      return sch.events.map(ev => {return {...ev, backColor: sch.color}});
    });

    calendarRef.current!.control.update({events: eventList});
  }, [isScheduleVisible, allSchedules]);

  return (
    <div className='body-wrapper'>
      <div className='schedule-list-wrapper'>
        {allSchedules.map(sch => (
          <Schedule
            data={sch}
            key={sch.source}
            isVisible={isScheduleVisible(sch.source)}
            setIsVisible={() => toggleScheduleVisibility(sch.source)}/>
        ))}
      </div>
      <div className='calendar-wrapper'>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default Calendar;
