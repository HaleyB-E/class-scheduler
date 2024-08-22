import { ISchedule } from "./types";


// https://htmlcolorcodes.com/color-chart/
export const testData: ISchedule[] =
[{
    source: "Gym",
    color: "#3498db",
    events: [
      {
        id: 1,
        text: "Test",
        start: "2024-08-20T10:30:00",
        end: "2024-08-20T12:30:00"
      },
      {
        id: 2,
        text: "Test2",
        start: "2024-08-21T10:30:00",
        end: "2024-08-21T12:30:00"
      },
    ]
  },
  {
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