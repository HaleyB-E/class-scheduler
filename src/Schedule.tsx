import React from 'react';
import "./CalendarStyles.css";
import { ISchedule } from './types';

const Schedule = ({data, isVisible, setIsVisible}: {data: ISchedule, isVisible: boolean, setIsVisible: () => void}) => {
  const getFormattedEventDatetime = (eventDate: Date) => {
    const date = eventDate.toDateString().slice(0,-5);
    const time = eventDate.toLocaleTimeString().slice(0, -6);
    return `${date} @ ${time}`
  }
  console.log(data)
  return (
    <div>
        <div style={{display:"inline-block"}}>
            <h4 style={{display:"inline"}}>{data.source}</h4>
            <input type="checkbox" checked={isVisible} onChange={setIsVisible}/>
        </div>
      <ul>
        {data.events.map(ev => 
          <li key={ev.id}>
            {getFormattedEventDatetime(new Date(ev.start.toString()))}: {ev.text}
          </li>
        )}
      </ul>
    </div>
  );
}

export default Schedule;
