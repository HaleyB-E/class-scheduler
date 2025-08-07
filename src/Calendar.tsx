import React, { useRef, useEffect, MutableRefObject, useState, useCallback } from 'react';
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import './CalendarStyles.css';
import Schedule from './Schedule';
import { convertToDayPilotDate, ISchedule } from './types';
import { getBoulderingProjectSchedule } from './data/BoulderingProjectSchedule';
import { getEshSchedule } from './data/EshSchedule';
import { getFlyTogetherSchedule } from './data/FlyTogetherSchedule';

const Calendar = () => {
  const calendarRef: MutableRefObject<DayPilotCalendar|null> = useRef(null)
  const [enabledSchedules, setEnabledSchedules] = useState<string[]>([]);
  const [allSchedules, setAllSchedules] = useState<ISchedule[]>([]);
  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState(DayPilot.Date.today());

  useEffect(() => {
    // TODO: make one-by-one loading instead of all at once
    getParsedData().then(resp => setAllSchedules(resp));
  },[])

  const getParsedData = async (): Promise<ISchedule[]> => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const boulderingProjectSchedule = await getBoulderingProjectSchedule(startDate, endDate);
    const eshSchedule = await getEshSchedule(startDate, endDate);
    const flyTogetherSchedule = await getFlyTogetherSchedule(endDate);
    return [boulderingProjectSchedule, eshSchedule, flyTogetherSchedule];
  }

  const getCalendar = (): DayPilot.Calendar => calendarRef.current!.control;

  const toggleScheduleVisibility = (source: string) => {
    const newArray = enabledSchedules.filter((x) => x !== source)
    if (newArray.length === enabledSchedules.length) {
      setEnabledSchedules([...enabledSchedules, source ]);
    } else {
      setEnabledSchedules(newArray)
    }
  }

  // swap between day and week view, focusing on the clicked day
  const onHeaderClicked = (h: {column: DayPilot.CalendarColumnData}) => {
    if (days === 7) {
      setStartDate(convertToDayPilotDate(h.column.name));
      setDays(1);
    } else {
      setStartDate(DayPilot.Date.today());
      setDays(7);
    }
  }

  const onEventClicked = (c: {e: DayPilot.Event}) => window.open(c.e.data.tags,'_blank');

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
      return sch.events.map(ev => {return {...ev, backColor: sch.color, tags: sch.scheduleLink}});
    });

    getCalendar().update({events: eventList});
  }, [isScheduleVisible, allSchedules]);

  return (
    <div className='body-wrapper'>
      <div className='schedule-list-wrapper'>
        {allSchedules.length === 0 &&
          <h2>
            Loading...
          </h2>
        }
        {allSchedules.length > 0 &&
          <>
            {allSchedules.map(sch => (
              <Schedule
                data={sch}
                key={sch.source}
                isVisible={isScheduleVisible(sch.source)}
                setIsVisible={() => toggleScheduleVisibility(sch.source)}/>
            ))}
          </>
        }

      </div>
      <div className='calendar-wrapper'>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
          onHeaderClicked={onHeaderClicked}
          onEventClick={onEventClicked}
          days={days}
          startDate={startDate}
        />
      </div>
    </div>
  );
}

export default Calendar;
