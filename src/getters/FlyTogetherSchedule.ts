import { DayPilot } from "@daypilot/daypilot-lite-react";
import { FLY_TOGETHER_URL } from "../authinfo";
import { ISchedule, IFlyTogetherEvent, convertToDayPilotDate } from "../types";

const tooHighLevel = [
    'Pole Level 3',
    'Pole Level 4',
    'Pole Mixed Level 3 & 4'
]
const isValidClass = (ftfClass: IFlyTogetherEvent): boolean => {
    if (tooHighLevel.some(name => name === ftfClass.sessionName)) {
        return false;
    }
    if (ftfClass.sessionName.startsWith('Intro to Pole:')) {
        return false;
    }

    return true;
}

export const getFlyTogetherSchedule = async (endDate: Date): Promise<ISchedule> => {
    const parsedFlyTogetherData: DayPilot.EventData[] = await fetch(FLY_TOGETHER_URL)
        .then(response => response.json())
        .then((allEvents) => {
            const eventsOfInterest = allEvents.payload.filter((ev: IFlyTogetherEvent) => {
                // don't show anything more than a week out
                if (new Date(ev.startsAt) > endDate) {
                    return false;
                }

                // skip classes that aren't level-appropriate
                if (!isValidClass(ev)) {
                    return false;
                }

                // only show events with capacity at local studio
                return (ev.capacity - ev.ticketsSold > 0) && ev.location === 'Somerville';
            });
            // reformat for DayPilot
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