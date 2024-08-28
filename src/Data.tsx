import { IFlyTogetherEvent, ISchedule } from "./types";
// data folder not synced to github, add the file and paste scraped data into it
import boulderingProjectData from "./data/boulderingproject.json";
import eshData from "./data/esh.json";
import { DayPilot } from "@daypilot/daypilot-lite-react";

export const getParsedData = async (): Promise<ISchedule[]> => {
    const boulderingProjectSchedule = getBoulderingProjectSchedule();
    const eshSchedule = getEshSchedule();
    const flyTogetherSchedule = await getFlyTogetherSchedule();
    return [boulderingProjectSchedule, eshSchedule, flyTogetherSchedule];
}

const convertToDayPilotDate = (date: string | Date): DayPilot.Date => {
    if (typeof date === 'string') {
        return new DayPilot.Date(new Date(date),true);
    }
    return new DayPilot.Date(date);
}

const getBoulderingProjectSchedule = (): ISchedule => {
    const parsedBoulderingProjectData: DayPilot.EventData[] = boulderingProjectData.map(ev => {
        return {
            id: ev.id,
            text: ev.name,
            description: ev.description,
            start: convertToDayPilotDate(ev.startTime),
            end: convertToDayPilotDate(ev.endTime),
            toolTip: ev.description.replace(/(<([^>]+)>)/ig, '')
        }
    }).sort((x,y) => x.start.getTime() - y.start.getTime());
    return {
        source: 'Bouldering Project',
        color: '#3498db',
        events: parsedBoulderingProjectData
    }
}

const getEshSchedule = (): ISchedule => {
    const parsedEshData: DayPilot.EventData[] = eshData.map(ev => {
        return {
            id: ev.id,
            text: ev.name.split('-')[0],
            description: ev.description,
            start: convertToDayPilotDate(ev.startTime),
            end: convertToDayPilotDate(ev.endTime),
            toolTip: ev.description
        }
    }).sort((x,y) => x.start.getTime() - y.start.getTime());
    return {
        source: 'Esh',
        color: '#e74c3c',
        events: parsedEshData
    }
}

const getFlyTogetherSchedule = async (): Promise<ISchedule> => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() + 7);
    const parsedFlyTogetherData: DayPilot.EventData[] = await fetch(
        'https://readonly-api.momence.com/host-plugins/host/11479/host-schedule/sessions')
        .then(response => response.json())
        .then((allEvents) => {
            const eventsOfInterest = allEvents.payload.filter((ev: IFlyTogetherEvent) => {
                // don't show anything more than a week out
                if (new Date(ev.startsAt) > dateLimit) {
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
        color: '#27ae60',
        events: parsedFlyTogetherData
    }
}
