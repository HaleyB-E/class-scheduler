import { DayPilot } from "@daypilot/daypilot-lite-react";
import { BOULDERING_PROJECT_API_KEY, BOULDERING_PROJECT_URL } from "../authinfo";
import { convertToDayPilotDate, IBoulderingProjectEvent, ISchedule } from "../types";

export const getBoulderingProjectSchedule = async (startDate: Date, endDate: Date): Promise<ISchedule> => {
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
        color: '#fb8c00',
        events: parsedBoulderingProjectData,
        scheduleLink: 'https://boulderingproject.portal.approach.app/schedule/embed?locationIds=9%2C'
    }
}