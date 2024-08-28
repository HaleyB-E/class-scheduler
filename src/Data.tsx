import { ISchedule } from "./types";
// data folder not synced to github, add the file and paste scraped data into it
import boulderingProjectData from "./data/boulderingproject.json";
import eshData from "./data/esh.json";
import flyTogetherData from "./data/flytogether.json";
import { DayPilot } from "@daypilot/daypilot-lite-react";

export const getParsedData = (): ISchedule[] => {
    const boulderingProjectSchedule = getBoulderingProjectSchedule();
    const eshSchedule = getEshSchedule();
    const flyTogetherSchedule = getFlyTogetherSchedule();

    return [boulderingProjectSchedule, eshSchedule, flyTogetherSchedule];
}

const convertToDayPilotDate = (date: string): DayPilot.Date => new DayPilot.Date(new Date(date),true);

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

const getFlyTogetherSchedule = (): ISchedule => {
    const parsedFlyTogetherData: DayPilot.EventData[] = flyTogetherData.map(ev => {
        return {
            id: ev.id,
            text: ev.name,
            description: ev.description,
            start: convertToDayPilotDate(ev.startTime),
            end: convertToDayPilotDate(ev.endTime),
            toolTip: ev.description
        }
    }).sort((x,y) => x.start.getTime() - y.start.getTime());
    return {
        source: 'Fly Together',
        color: '#27ae60',
        events: parsedFlyTogetherData
    }
}
