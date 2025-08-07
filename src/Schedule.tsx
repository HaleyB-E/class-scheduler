import React from 'react';
import './CalendarStyles.css';
import { ISchedule } from './types';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Switch} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Schedule = ({data, isVisible, setIsVisible}: {data: ISchedule, isVisible: boolean, setIsVisible: () => void}) => {
  const getFormattedEventDatetime = (eventDate: Date) => {
    return eventDate.toLocaleDateString('en-US', {weekday:'long', hour: 'numeric', minute: 'numeric'} );
  }

  return (
    <Grid container>
      <Grid className='visibility-toggle-wrapper' size={1}>
        <Switch
          className='visibility-toggle'
          checked={isVisible}
          onChange={setIsVisible}
          name={data.source}
        />
      </Grid>
      <Grid size={11}>      
        <Accordion
          disableGutters
          className='schedule-tile'
          style={{backgroundColor: data.color}}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className='schedule-tile-header'
          >
            <h4>{data.source}</h4>
          </AccordionSummary>
          <AccordionDetails>
            <ul className='schedule-tile-event-wrapper'>
              {data.events.map(ev => 
                <li key={ev.id}>
                  <b>{getFormattedEventDatetime(new Date(ev.start.toString()))}</b>: {ev.text}
                </li>
              )}
            </ul>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}

export default Schedule;
