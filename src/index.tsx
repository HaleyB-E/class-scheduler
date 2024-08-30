import React from 'react';
import ReactDOM from 'react-dom/client';
import Calendar from './Calendar';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <div className='App'>
      <h1>Consolidated Fitness Calendar 💪</h1>
      <Calendar/>
    </div>
  </React.StrictMode>
);
