import React, { useRef, useEffect, MutableRefObject, useState } from 'react';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
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
    events: [
      {
        id: 3,
        text: "Test3",
        start: "2024-07-30T10:30:00",
        end: "2024-07-30T12:30:00"
      },
      {
        id: 4,
        text: "Test4",
        start: "2024-08-03T10:30:00",
        end: "2024-08-03T12:30:00"
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

  const isScheduleVisible = (source: string) => {
    return enabledSchedules.findIndex(sc => sc === source) >= 0;
  }

  const editEvent = async (e: DayPilot.Event) => {
    const dp = calendarRef.current!.control;
    const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
    if (!modal.result) { return; }
    e.data.text = modal.result;
    dp.events.update(e);
  };

  const calendarConfig = {
    viewType: "Week" as const,
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled" as const,
    onTimeRangeSelected: async (args: {start: DayPilot.Date, end: DayPilot.Date}) => {
      const dp = calendarRef.current!.control;
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      dp.clearSelection();
      if (!modal.result) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      });
    },
    onEventClick: async (args: {e: DayPilot.Event}) => {
      await editEvent(args.e);
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Delete",
          onClick: async args => {
            const dp = calendarRef.current!.control;
            dp.events.remove(args.source);
          },
        },
        {
          text: "-"
        },
        {
          text: "Edit...",
          onClick: async args => {
            await editEvent(args.source);
          }
        }
      ]
    }),
    onBeforeEventRender: (args: any) => {
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          toolTip: "Delete event",
          onClick: async (args: any) => {
            const dp = calendarRef.current!.control;
            dp.events.remove(args.source);
          }
        }
      ];
    }
  };

  useEffect(() => {
    //TODO: get visible schedules, assign each unique color (do in list maybe?), alter visibility
    const events = testData[0].events;

    const startDate = "2024-07-28";

    calendarRef.current!.control.update({startDate, events});
  }, []);

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
