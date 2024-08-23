// https://boulderingproject.portal.approach.app/schedule/embed?locationIds=9%2C
// put a breakpoint in schedule.js (as of 8/21/24, line 146) and paste the following code:

//eventTypes = ['Events', 'Climbing Classes', 'Yoga', 'Fitness']
eventTypeIds = [2, 4, 5, 6]
// to get all classes with openings
allOpenEvents = allCalendarSlots.bookings.filter(bk => bk.ticketsRemaining > 0);

eventsOfInterest = allOpenEvents.filter(ev => {
    let filteredByType = ev.event.activitys.filter(ac => !!eventTypeIds.find(i => i === ac.id));
    if (filteredByType.length === 0) {
        return false;
    }
    // before 10AM? madness
    return parseInt(ev.event.startTime, 10) > 10;
});

output = eventsOfInterest.map(ev => {
    return {
        id: ev.UUID,
        name: ev.name,
        description: ev.description,
        startTime: ev.cutoffStartDT,
        endTime: ev.endDT
    }
});

// make sure you've clicked into body of the page, otherwise this fails
setTimeout(async()=>await window.navigator.clipboard.writeText(JSON.stringify(output)), 3000);
