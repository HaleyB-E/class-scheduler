import { ISchedule } from "./types";
// data folder not synced to github, add the file and paste scraped data into it
import boulderingProjectData from "./data/boulderingproject.json";
import { DayPilot } from "@daypilot/daypilot-lite-react";

export const getParsedData = (): ISchedule[] => {
    const boulderingProjectSchedule = getBoulderingProjectSchedule();

    return [boulderingProjectSchedule];
}

const convertToDayPilotDate = (date: string): DayPilot.Date => new DayPilot.Date(new Date(date),true);

const getBoulderingProjectSchedule = (): ISchedule => {
    const parsedBoulderingProjectData: DayPilot.EventData[] = boulderingProjectData.map(ev =>{
        return {
            id: ev.id,
            text: ev.name,
            description: ev.description,
            start: convertToDayPilotDate(ev.startTime),
            end: convertToDayPilotDate(ev.endTime)
        }
    }).sort((x,y) => x.start.getTime() - y.start.getTime());
    return {
        source: 'Bouldering Project',
        color: '#3498db',
        events: parsedBoulderingProjectData
    }
}

// https://htmlcolorcodes.com/color-chart/
export const testData: ISchedule[] =
[{
    source: "Esh",
    color: "#eb984e",
    events: [
      {
        id: 3,
        text: "Test3",
        start: "2024-08-22T14:00:00",
        end: "2024-08-22T15:30:00"
      },
      {
        id: 4,
        text: "Test4",
        start: "2024-08-23T10:30:00",
        end: "2024-08-23T11:00:00"
      },
    ]
  }
]