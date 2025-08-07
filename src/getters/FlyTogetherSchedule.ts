import { DayPilot } from "@daypilot/daypilot-lite-react";
import { FLY_TOGETHER_URL } from "../authinfo";
import { ISchedule, IFlyTogetherEvent, convertToDayPilotDate } from "../types";

export const getFlyTogetherSchedule = async (endDate: Date): Promise<ISchedule> => {
    const parsedFlyTogetherData: DayPilot.EventData[] = await fetch(FLY_TOGETHER_URL)
        .then(response => response.json())
        .then((allEvents) => {
            const eventsOfInterest = allEvents.payload.filter((ev: IFlyTogetherEvent) => {
                // don't show anything more than a week out
                if (new Date(ev.startsAt) > endDate) {
                    return false;
                }
                // only show events with capacity at local studio
                return (ev.capacity - ev.ticketsSold > 0) && ev.location === 'Somerville';
            });
            return eventsOfInterest.map((ev: IFlyTogetherEvent) => {
                return {
                    id: ev.id,
                    text: ev.sessionName,
                    description: ev.level,
                    start: convertToDayPilotDate(ev.startsAt),
                    end: convertToDayPilotDate(ev.endsAt),
                    toolTip: ev.level
                }
            }).sort((x: any,y: any) => x.start.getTime() - y.start.getTime());
        });
    return {
        source: 'Fly Together',
        color: '#00897b',
        events: parsedFlyTogetherData,
        scheduleLink: 'https://momence.com/u/flytogetherfitness'
    }
}