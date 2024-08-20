import { DayPilot } from "@daypilot/daypilot-lite-react";

export interface ISchedule {
    source: string;
    events: DayPilot.EventData[];
}
