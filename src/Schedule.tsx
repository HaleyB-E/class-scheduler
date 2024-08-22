import React from 'react';
import "./CalendarStyles.css";
import { ISchedule } from './types';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

const Schedule = ({data, isVisible, setIsVisible}: {data: ISchedule, isVisible: boolean, setIsVisible: () => void}) => {
  const getFormattedEventDatetime = (eventDate: Date) => {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const date = weekday[eventDate.getDay()];
    const time = eventDate.toLocaleTimeString().slice(0, -6);
    return `${date} @ ${time}`
  }

  return (
    <div className="schedule-tile" style={{backgroundColor: data.color}}>
      <div className="schedule-tile-header">
        <Toggle className="visibility-toggle" type="checkbox" defaultChecked={isVisible} onChange={setIsVisible}/>
        <h4>{data.source}</h4>
      </div>
      <ul className="schedule-tile-event-wrapper">
        {data.events.map(ev => 
          <li key={ev.id}>
            <b>{getFormattedEventDatetime(new Date(ev.start.toString()))}</b>: {ev.text}
          </li>
        )}
      </ul>
    </div>
  );
}

export default Schedule;
