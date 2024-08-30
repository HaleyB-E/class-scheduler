import { DayPilot } from '@daypilot/daypilot-lite-react';

export interface ISchedule {
    source: string;
    events: DayPilot.EventData[];
    color: string;
    scheduleLink: string;
}

export interface IFlyTogetherEvent {
    id: number,
    sessionName: string;
    level: string;
    startsAt: Date;
    endsAt: Date;
    capacity: number;
    ticketsSold: number;
    location: string;
}

export interface IBoulderingProjectEvent {
    UUID: string;
    name: string;
    description: string;
    ticketsRemaining: number;
    event: {
        activitys: {
            id: number;
        }[];
        startTime: string;
    };
    cutoffStartDT: Date;
    endDT: Date;
}