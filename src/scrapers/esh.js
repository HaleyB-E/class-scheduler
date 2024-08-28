//general: https://app.amilia.com/store/en/eshcircusarts/api/Program/List
// current makeup calendar: https://app.amilia.com/store/en/eshcircusarts/shop/programs/calendar/106220?view=month&scrollToCalendar=true

// in sources, amilia.store-libs.min.js
//e.isStart && (e = this.getEventTimeText(i)) && (o = '<span class="fc-time">' + m(e) + "</span>"),

eventsOfInterest = e.filter(ev => !ev.hasPassed && ev.AttendanceString !== "Full");
output = eventsOfInterest.map(ev => {
    return {
        id: ev.SegmentId,
        name: ev.ActivityName,
        description: ev.ActivityName,
        startTime: ev.start._i,
        endTime: ev.end._i
    }
});

// make sure you've clicked into body of the page, otherwise this fails
setTimeout(async()=>await window.navigator.clipboard.writeText(JSON.stringify(output)), 3000);
