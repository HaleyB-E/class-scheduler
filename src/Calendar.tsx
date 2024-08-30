import React, { useRef, useEffect, MutableRefObject, useState, useCallback } from 'react';
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import './CalendarStyles.css';
import Schedule from './Schedule';
import { convertToDayPilotDate, getParsedData } from './data/Data';
import { ISchedule } from './types';

const Calendar = () => {
  const calendarRef: MutableRefObject<DayPilotCalendar|null> = useRef(null)
  const [enabledSchedules, setEnabledSchedules] = useState<string[]>([]);
  const [allSchedules, setAllSchedules] = useState<ISchedule[]>([]);
  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState(DayPilot.Date.today());

  useEffect(() => {
    getParsedData().then(resp => setAllSchedules(resp));
  },[])

  const getCalendar = (): DayPilot.Calendar => calendarRef.current!.control;

  const toggleScheduleVisibility = (source: string) => {
    const newArray = enabledSchedules.filter((x) => x !== source)
    if (newArray.length === enabledSchedules.length) {
      setEnabledSchedules([...enabledSchedules, source ]);
    } else {
      setEnabledSchedules(newArray)
    }
  }

  const onHeaderClicked = (h: {column: DayPilot.CalendarColumnData}) => {
    if (days === 7) {
      setStartDate(convertToDayPilotDate(h.column.name));
      setDays(1);
    } else {
      setStartDate(DayPilot.Date.today());
      setDays(7);
    }
  }

  const isScheduleVisible = useCallback((source: string) => {
    return enabledSchedules.findIndex(sc => sc === source) >= 0;
  }, [enabledSchedules])

  const calendarConfig = {
    viewType: 'Days' as const,
    durationBarVisible: false,
  };

  useEffect(() => {
    const visibleSchedules = allSchedules.filter(sch => isScheduleVisible(sch.source));

    const eventList = visibleSchedules.flatMap(sch => {
      return sch.events.map(ev => {return {...ev, backColor: sch.color}});
    });

    getCalendar().update({events: eventList});
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
          onHeaderClicked={onHeaderClicked}
          days={days}
          startDate={startDate}
        />
      </div>
    </div>
  );
}

export default Calendar;
