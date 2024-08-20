import React from 'react';
import "./CalendarStyles.css";
import { ISchedule } from './types';

const Schedule = ({data, isVisible, setIsVisible}: {data: ISchedule, isVisible: boolean, setIsVisible: () => void}) => {
  return (
    <div>
        <div style={{display:"inline-block"}}>
            <h4 style={{display:"inline"}}>{data.source}</h4>
            <input type="checkbox" checked={isVisible} onChange={setIsVisible}/>
        </div>
      <ul>
        {data.events.map(ev => 
          <li key={ev.id}>
            {ev.text}
          </li>
        )}
      </ul>
    </div>
  );
}

export default Schedule;
