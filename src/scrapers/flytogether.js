// https://momence.com/u/flytogetherfitness
// go to network tab, click "sessions", then copy the payload and set it to variable "sessions"

eventsOfInterest = sessions.payload.filter(ev => (ev.capacity - ev.ticketsSold > 0) && ev.location === 'Somerville');
output = eventsOfInterest.map(ev => {
    return {
        id: ev.id,
        name: ev.sessionName,
        description: ev.level,
        startTime: ev.startsAt,
        endTime: ev.endsAt
    }
});

// make sure you've clicked into body of the page, otherwise this fails
setTimeout(async()=>await window.navigator.clipboard.writeText(JSON.stringify(output)), 3000);
