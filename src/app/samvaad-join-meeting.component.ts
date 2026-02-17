export class JoinMeeting {
    fullName: string = "";
    meetingID: string = "";
    role: string = "";
    ErrorFlag: boolean = false;
    ErrorMessage: string = "";
    repeatdisplay: string = "";
    endTime: string = "";
    samvaad: string = "true";
    passwordrequired: string = "";
    password: string = "";
    meetingTitle: string = "";
    hostName: string = "";
    startTime: string = "";
    domain_URL: string = "";
    emailRequired: boolean = false;
    isFaceRecognition: boolean = false;
    breakoutRoomsList: [];
    isBreakoutRoomsCreated: boolean = false;
    isEnabledParticipantAudioControl: boolean = false;
    username: string = "";
    mail: string = "";
    companyName: string = "";
    designation: string = "";
    mobileNumber: string = "";  
    occupation: string = "";
    location: string = "";
    rememberMe: string = "";
    showjoinMessage: boolean = false;
    isLoading: boolean = false;
    donloadURL: string = "";
    platformInfo: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36",
        os: "Windows",
        browser: "Chrome",
        device: "Unknown",
        os_version: "windows-10",
        browser_version: "98.0.4758.81",
        deviceType: "desktop-APP",
        orientation: "landscape"
    };
    isElectron: boolean = false;
    loginparticipant: string = "n";
}