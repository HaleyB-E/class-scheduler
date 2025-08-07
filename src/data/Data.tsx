import { IBoulderingProjectEvent, IEshEvent, IFlyTogetherEvent, ISchedule } from '../types';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { BOULDERING_PROJECT_API_KEY, BOULDERING_PROJECT_URL, FLY_TOGETHER_URL } from '../authinfo';

export const getParsedData = async (): Promise<ISchedule[]> => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const boulderingProjectSchedule = await getBoulderingProjectSchedule(startDate, endDate);
    const eshSchedule = await getEshSchedule(startDate, endDate);
    const flyTogetherSchedule = await getFlyTogetherSchedule(endDate);
    return [boulderingProjectSchedule, eshSchedule, flyTogetherSchedule];
}

const convertToDayPilotDate = (date: string | Date): DayPilot.Date => {
    if (typeof date === 'string') {
        return new DayPilot.Date(new Date(date),true);
    }
    return new DayPilot.Date(date);
}

const getBoulderingProjectSchedule = async (startDate: Date, endDate: Date): Promise<ISchedule> => {
    //eventTypes = ['Events', 'Climbing Classes', 'Yoga', 'Fitness']
    const eventTypeIds = [2, 4, 5, 6];

    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'boulderingproject');
    myHeaders.append('X-Api-Key', BOULDERING_PROJECT_API_KEY);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const dateStringForUrl = `&startDT=${startDate.toISOString()}&endDT=${endDate.toISOString()}`
    const activityStringForUrl = `&activityId=${eventTypeIds.join('%2C')}`;
    const bpUrl = BOULDERING_PROJECT_URL + dateStringForUrl + activityStringForUrl;
    const parsedBoulderingProjectData: DayPilot.EventData[] = await fetch(bpUrl, requestOptions)
        .then(response => response.json())
        .then((allEvents) => {
            // get all classes with openings
            const openEvents = allEvents.bookings.filter((ev: IBoulderingProjectEvent) => ev.ticketsRemaining > 0);
            // apply additional filters
            const eventsOfInterest = openEvents.filter((ev: IBoulderingProjectEvent) => {
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

const stringifyEshDate = (toFormat: Date): string =>
    `${toFormat.getFullYear()}-${toFormat.getMonth() + 1}-${toFormat.getDate()}`;

const getEshSchedule = async (startDate: Date, endDate: Date): Promise<ISchedule> => {
    const dateStringForUrl = new URLSearchParams();
    dateStringForUrl.append('start', stringifyEshDate(startDate));
    dateStringForUrl.append('end', stringifyEshDate(endDate));
    const eshEvents = await fetch(`/esh?${dateStringForUrl}`)
        .then(response => response.json())
        .then(allEvents => {
            // exclude events that are full or have already happened
            const filteredEvents = allEvents.filter((ev: IEshEvent) => {
                if (ev.hasPassed || ev.AttendanceString === 'Full') {
                    return false;
                }
                return new Date(ev.start) <= endDate;
            });
            // reformat for DayPilot
            const mappedEvents = filteredEvents.map((ev: IEshEvent) => {
                return {
                    id: ev.SegmentId,
                    text: ev.title.split('-')[0],
                    description: ev.ActivityName,
                    start: convertToDayPilotDate(ev.start),
                    end: convertToDayPilotDate(ev.end),
                    toolTip: ev.ActivityName
                }
            }).sort((x: { start: DayPilot.Date; },y: { start: DayPilot.Date; })  =>
                x.start.getTime() - y.start.getTime()
            );
            return mappedEvents;
        });
        return {
            source: 'Esh',
            color: '#e74c3c',
            events: eshEvents
        }
}

const getFlyTogetherSchedule = async (endDate: Date): Promise<ISchedule> => {
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
        color: '#27ae60',
        events: parsedFlyTogetherData
    }
}
