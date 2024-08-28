import { DayPilot } from "@daypilot/daypilot-lite-react";

export interface ISchedule {
    source: string;
    events: DayPilot.EventData[];
    color: string;
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