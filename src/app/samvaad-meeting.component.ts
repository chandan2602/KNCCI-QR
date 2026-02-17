export class CreateSamvaadMeeting {
    attendeePW: string = "4783206376";
    breakOutRoom: boolean = false;
    creator: {
        id: number
    };
    date: string = "";
    description: string = "";
    domainId: number = 0;
    duration: string = "";
    emailRequired: boolean = false;
    enabledParticipantAudioControl: boolean = false;
    endDateTime: string = "";
    endTime: string = "";
    guest: string = "";
    hidePresentation: string = "";
    id: number = 0;
    intervalId: number = 0;
    lockPeriod: boolean = false;
    lockTime: number = 0;
    maxParticipants: string = "100"; 
    name: string = "";
    participantEmails: string = "";
    passwordrequired: string = "";
    record: boolean = +sessionStorage.company_id == 46;
    recurrence: {
        repeat: string;
        repeatEveryCount: string;
        end: {
            repeatEnd: string;
            until: string;
            count: string;
        },
        repeatOn: {
            daysOnWeek: [];
            dayOrOther: string;
            dayCount: string;
            otherWeekDays: string;
            otherDays: string;
            monthOfYear: string;
        }
    };
    reminder: boolean = false;
    repeat: boolean = true;
    repeatTilldate: string = "";
    requiredWebinarLink: boolean = false;
    session: string = "";
    startDateTime: string = "";
    startTime: string = "";
    zoneId: number = 248;
    zoneName: string = "Asia/Calcutta";

    constructor() {
        this.creator = {
            id: 0
        };
        this.recurrence = {
            repeat: "daily",
            repeatEveryCount: "1",
            end: {
                repeatEnd: "until",
                until: "",
                count: ""
            },
            repeatOn: {
                daysOnWeek: [],
                dayOrOther: "days",
                dayCount: "",
                otherWeekDays: "first",
                otherDays: "sunday",
                monthOfYear: "01"
            }
        };
    }
}