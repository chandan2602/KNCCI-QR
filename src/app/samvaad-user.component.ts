export class SamvaadUserRegister {
    id: number = 0;
    name: string = '';
    password: string = '';
    email: string = '';
    mobileNO: string = '';
    active: boolean = true;
    address: string = '';
    recordByDefault: boolean = false;
    liveStreamByDefault: boolean = false;
    landLineNo: string = '';
    extn: string = '';
    packType = "0";
    expiryDateTime: string = '';
    createdDate: string = '';
    archiveDuration: string = '';
    noOfHosts: string = '';
    role: {
        id: string;
        name: string;
    };
    createdBy: {
        id: number;
    };
    orgId: number = 41;
    amount: '0';
    constructor() {
        this.role = {
            id: '2', //host
            name: ''
        },
            this.createdBy = {
                //id: 1399 //samvaad tutor admin    dev
                id: 33337 //samvaad tutor admin   production
            }
    }
}