import { DayPilot } from "@daypilot/daypilot-lite-react";
import { convertToDayPilotDate, IEshEvent, ISchedule } from "../types";

const stringifyEshDate = (toFormat: Date): string =>
    `${toFormat.getFullYear()}-${toFormat.getMonth() + 1}-${toFormat.getDate()}`;

export const getEshSchedule = async (startDate: Date, endDate: Date): Promise<ISchedule> => {
    const dateStringForUrl = new URLSearchParams();
    dateStringForUrl.append('start', stringifyEshDate(startDate));
    dateStringForUrl.append('end', stringifyEshDate(endDate));
    const eshEvents = await fetch(`/esh?${dateStringForUrl}`)
        .then(response => response.json())
        .then(allEvents => {
            const filteredEvents = allEvents.filter((ev: IEshEvent) => {
                // exclude events that are full or have already happened
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
        events: eshEvents,
        scheduleLink: 'https://app.amilia.com/store/en/eshcircusarts/shop/programs/calendar/118460'
    }
}