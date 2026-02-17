import { UntypedFormBuilder, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonService } from './../services/common.service'
import { environment } from '../../environments/environment';
import { JoinMeeting } from '../../app/samvaad-join-meeting.component';
export abstract class BaseComponent {
    table: Array<any> = [];
    isEdit: boolean;
    tenanates: Array<any> = [];
    roleId: string = sessionStorage.getItem('RoleId');
    TenantCode: string = sessionStorage.getItem('TenantCode');
    userId: string = sessionStorage.getItem('UserId');
    myForm: UntypedFormGroup;
    editData: any = {};
    tId: string = '';
    file: File;
    fileName: string;
    courses: Array<any> = [];
    courseId: string = '';
    shedules: Array<any> = [];
    schedules: Array<any> = [];
    scheduleId: string = '';
    public dtTrigger: Subject<any> = new Subject<any>();
    dtOptions: any = {};
    formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
    loadTenanat: boolean = true;
    fileUrl: string = environment.fileUrl;
    urlFiles: string = environment.urlFiles;
    MeetingCheckSumUrl = new JoinMeeting();
    is_company: boolean = sessionStorage.is_company == 'false' ? false : true;
    allRoles = [
        { id: 1, role: 'Admin' },
        { id: 2, role: 'Trainer' },
        { id: 3, role: 'Trainee' },
        { id: 4, role: 'Super Admin' }
    ];

    get RoleName(): string {
        if (+this.roleId == 1 && ["shiksion.com", "localhost"].includes(location.hostname))
            return this.allRoles[1].role;
        else {
            const role: string = this.allRoles.find(e => e.id == +this.roleId)?.role ?? '';
            return role;
        }
    }
    get isPermission(): boolean {
        // && (this.is_company == false)
        if (([1, 4].includes(+this.roleId)) || ((+this.roleId == 2)))
            return true;
        else
            return false;
    }

    get ScreenPermission(): boolean {
        /*
        2--->Trainer
        3--->Trainee
        */
        return ((this.is_company == false) || ([2, 3].includes(+this.roleId)));
    }

    //   fb:FormBuilder=new FormBuilder();
    get isSuperAdmin(): boolean {
        if (sessionStorage.getItem('RoleId') == '4') { return true } else return false;
    }
    constructor(protected CommonService: CommonService, protected toastr: ToastrService) {
        if (this.loadTenanat) this.getTennates();
    }
    activeSpinner() {
        this.CommonService.activateSpinner();
    }

    deactivateSpinner() {
        this.CommonService.deactivateSpinner()
    }
    getGridData(route: string, payload, callBack?: Function) {
        this.activeSpinner();
        this.CommonService.postCall(route, payload).subscribe(
            (res: any) => {
                this.deactivateSpinner()
                this.table = [];
                setTimeout(() => {
                    this.table = res;
                    if (callBack) {
                        callBack();
                    }
                })
            }, err => {
                this.deactivateSpinner()

            }
        )
    }
    public getTennates(callBack?: Function) {
        if (!this.isSuperAdmin) return
        this.activeSpinner();
        this.CommonService.postCall('GetTenantByRoleId', { RoleId: this.roleId }).subscribe(
            (res) => {
                this.tenanates = res;
                this.deactivateSpinner();
                if (callBack) {
                    callBack();
                }
            }, err => {
                this.deactivateSpinner()
            }
        )
    }
    renderDataTable() {
        let t = $('#DataTables_Table_0').DataTable();
        t.destroy();
        this.dtTrigger.next();
    }

    loadDataTable(tableName: string = "DataTables_Table_0") {
        let t = $('#' + tableName).DataTable();
        t.destroy();
        // this.dtTrigger.next();
    }
    changeTname() { }

    ///get admin cources
    getCourses(callback?: Function) {
        this.activeSpinner()
        let id = this.tId == '' ? null : this.tId
        this.CommonService.getAdminCourses(id).subscribe((res: any) => {
            this.courses = res;
            this.deactivateSpinner();
            if (callback) {
                callback();
            }
        }, e => {
            this.deactivateSpinner()
        });

    }
    courseChange(callBack?: Function) {
        let data = {
            "CourseId": this.courseId
        }
        this.activeSpinner()
        this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
            this.deactivateSpinner()
            this.shedules = res;
            this.schedules = res;
            if (callBack) {
                callBack()
            }
        }, e => { this.deactivateSpinner() });
    }

    //////////////////default action in page////////////////////
    post(url, payload, callback?: Function) {
        this.activeSpinner();
        this.CommonService.postCall(url, payload).subscribe(
            (res) => {
                this.deactivateSpinner();
                if (callback) {
                    callback(res);
                }
            }, err => {
                this.deactivateSpinner();
            }
        )
    }


    add() { }
    close() { }
    onSubmit(form?: UntypedFormGroup) { }
    edit(data) { }
    //////////////////default action in page////////////////////

    loadReportDtOptions() {
        this.dtOptions = {
            dom: 'Bfrtip',
            buttons: ['excel'],
            order: []
        }
    }
    back() {
        window.history.back();
    }
    studentCourses() {
        this.activeSpinner();
        this.CommonService.getCourses().subscribe((res: any) => {
            this.deactivateSpinner();
            this.courses = res;
        }, e => { this.deactivateSpinner(); })
    }

    fileSizeCalculation(fileSize: number, targetSize: number): boolean {
        const currentfileSize = Math.round((fileSize / (1024 * targetSize)));
        return (currentfileSize >= (1024 * targetSize));
    }

    getFormValidationErrors(formObj: any) {
        Object.keys(formObj.controls).forEach(key => {
            const controlErrors: ValidationErrors = formObj.get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
            }
        });
    }

    loadImages(courseName: string) {
        const imageList = [
            { name: 'Languages', path: '../../../../assets/new-images/language.jpg' },
            { name: 'Music', path: '../../../../assets/new-images/music.jpg' },
            { name: 'Cooking', path: '../../../../assets/new-images/cooking.jpg' },
            { name: 'Programming Languages', path: '../../../../assets/new-images/ProgrammingLanguages.jpeg' },
            { name: 'Post-Graduate Programme in Business Analytics', path: '../../../../assets/new-images/pg.jpg' },
            { name: 'Angular', path: '../../../../assets/new-images/angular.jpg' },
            { name: 'Machine Learning & AI', path: '../../../../assets/new-images/artificial_intelligence.jpg' },
            { name: 'Web Development', path: '../../../../assets/new-images/web_development.jpg' },
        ];

        let imageObj = imageList.find(e => e.name == courseName);
        return imageObj ? imageObj.path : '../../../../assets/img/course-card/image.png';
    }

    getImagePath(path: string, courseName: string): string {
        const index = path?.indexOf('/HOME') ?? -1;
        const newPath: string = index > -1 ? `${this.fileUrl}${path}` : this.loadImages(courseName);
        return newPath;
    }

    getMeetingDetails(url) {
        const meetingURLParams = url.split('/');
        const meetingId = meetingURLParams[meetingURLParams.length - 1];
        this.activeSpinner();
        this.CommonService.getCall('conclave/nojwt/meeting/getMeetingDetails/', meetingId, true).subscribe((res: any) => {
            const data = res.data.meetingdetails;
            this.getCheckSumUrl(data);
            this.deactivateSpinner();
        }, e => {
            this.deactivateSpinner()
            // console.log(e, 'error getMeetingDetails');
            this.toastr.error(e.error?.message);
        })
    }

    getCheckSumUrl(data) {
        this.activeSpinner();
        let payload = {
            ...this.MeetingCheckSumUrl,
            // fullName: data.fullName,
            fullName: sessionStorage.getItem('Username'),
            meetingID: data.meetingID,
            role: data.role,
            endTime: data.EndTime,
            meetingTitle: data.name,
            hostName: data.hostName,
            startTime: data.StartTime,
            domain_URL: data.domainUrl,
            username: sessionStorage.getItem('Username'),
            mail: sessionStorage.getItem('USERNAME'),
        }
        this.CommonService.postCall('conclave/nojwt/session/getHostCreateAndJoinCheckSumUrl', payload, true).subscribe((res: any) => {
            this.deactivateSpinner();
            this.joinSamvaadMeeting(res);
        }, e => {
            this.deactivateSpinner();
            // console.log(e, '--------getHostCreateAndJoinCheckSumUrl');
            this.toastr.error(e.error?.message);
        })
    }

    joinSamvaadMeeting(res) {
        window.open(res.data.joinUrl)
    }

    setServerPath(path: string) {
        return (this.fileUrl + path);
    }

    convertDataUrlToBlob(dataUrl: any) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    }

    generateFile(ImageURL: string = '', filename: string = 'Sample12345.png', extension: string = 'png') {
        const file = new File([this.convertDataUrlToBlob(ImageURL)], filename, { type: `image/${extension}` });
        return file;
    }
}