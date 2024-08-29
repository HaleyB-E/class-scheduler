import { IBoulderingProjectEvent, IFlyTogetherEvent, ISchedule } from "./types";
// data folder not synced to github, add the file and paste scraped data into it
import eshData from "./data/esh.json";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import { BOULDERING_PROJECT_API_KEY, BOULDERING_PROJECT_URL, FLY_TOGETHER_URL } from "./authinfo";

export const getParsedData = async (): Promise<ISchedule[]> => {
    const boulderingProjectSchedule = await getBoulderingProjectSchedule();
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

const getBoulderingProjectSchedule = async (): Promise<ISchedule> => {
    //eventTypes = ['Events', 'Climbing Classes', 'Yoga', 'Fitness']
    const eventTypeIds = [2, 4, 5, 6];

    const myHeaders = new Headers()
    myHeaders.append("Authorization", "boulderingproject");
    myHeaders.append("X-Api-Key", BOULDERING_PROJECT_API_KEY);

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const parsedBoulderingProjectData: DayPilot.EventData[] = await fetch(BOULDERING_PROJECT_URL, requestOptions)
        .then((response) => response.json())
        .then((allEvents) => {
            // get all classes with openings
            const openEvents = allEvents.bookings.filter((ev: IBoulderingProjectEvent) => ev.ticketsRemaining > 0);
            // apply additional filters
            const eventsOfInterest = openEvents.filter((ev: IBoulderingProjectEvent) => {
                let filteredByType = ev.event.activitys.filter(ac => {
                    return !!eventTypeIds.find(i => i === ac.id);
                });
                if (filteredByType.length === 0) {
                    return false;
                }
                // before 10AM? madness
                return parseInt(ev.event.startTime, 10) > 10;
            });
            return eventsOfInterest.map((ev: IBoulderingProjectEvent) => {
                return  {
                    id: ev.UUID,
                    text: ev.name,
                    description: ev.description,
                    start: convertToDayPilotDate(ev.cutoffStartDT),
                    end: convertToDayPilotDate(ev.endDT),
                    toolTip: ev.description.replace(/(<([^>]+)>)/ig, '')
                }
            }).sort((x: any, y: any) => x.start.getTime() - y.start.getTime());
        });

    return {
        source: 'Bouldering Project',
        color: '#3498db',
        events: parsedBoulderingProjectData
    }
}

const getEshSchedule = (): ISchedule => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() + 7);
    const parsedEshData: DayPilot.EventData[] = eshData.filter(ev => {
        if (ev.HasPassed || ev.AttendanceString === 'Full') {
            return false;
        }
        return new Date(ev.start) <= dateLimit;
    }).map(ev => {
        return {
            id: ev.SegmentId,
            text: ev.title.split('-')[0],
            description: ev.ActivityName,
            start: convertToDayPilotDate(ev.start),
            end: convertToDayPilotDate(ev.end),
            toolTip: ev.ActivityName
        }
    }).sort((x,y) => x.start.getTime() - y.start.getTime());
    return {
        source: 'Esh (MANUAL UPDATE -LAST 8/28)',
        color: '#e74c3c',
        events: parsedEshData
    }
}

const getFlyTogetherSchedule = async (): Promise<ISchedule> => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() + 7);
    const parsedFlyTogetherData: DayPilot.EventData[] = await fetch(FLY_TOGETHER_URL)
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
