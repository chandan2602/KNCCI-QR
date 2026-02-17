import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, Validators, UntypedFormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { dataDictionary } from './../../dataDictionary'
import { FileuploadService } from '../../../app/services/fileupload.service';
import { BaseComponent } from '../../../app/pages/base.component';
import { CreateSamvaadMeeting } from '../../../app/samvaad-meeting.component';
import { constants } from '../../constants';
@Component({
  selector: 'app-add-cource-schedule',
  templateUrl: './add-cource-schedule.component.html',
  styleUrls: ['./add-cource-schedule.component.css']
})
export class AddCourceScheduleComponent extends BaseComponent implements OnInit {
  // isEdit: Boolean = false;
  id: string;
  minDate: any = moment().format('yyyy-MM-DD')
  cources: Array<any> = [];
  catagory: Array<any> = [];
  courceId: string = '';
  languages: Array<any> = [];
  levels: Array<any> = [];
  payments: Array<any> = [];
  myForm: UntypedFormGroup
  seats: string;
  editData: any = {};
  paymentChange: boolean = false;
  plus: boolean = false;
  value: any;
  file: File;
  fileName: string = null;
  startDate: any;
  isDisable: boolean = false;
  data: any = {};
  isresData: boolean = null;
  paymentMethodList: Array<{ id: number, name: string }> = [];
  pageTitle: string = 'Course Schedule';
  submitted = false;
  createMeeting = new CreateSamvaadMeeting();
  samavaadUserName: string;
  samavaadPassword: string;
  samvaadUserId: number;
  maxDate: any = moment().format('yyyy-MM-DD');
  isMeeting: Boolean = false;
  selectedItems: Array<{ id: number, name: string, sID: String }> = [];
  WeeklyDays: Array<{ id: number, sID: String, name: string, }> = [];
  dropdownSettings = {};
  // newDate: any = moment();
  // acadamicYears: Array<any> = [];
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, active: ActivatedRoute, toastr: ToastrService, private location: Location
    , private fileuploadService: FileuploadService
  ) {
    super(CommonService, toastr);
    active.queryParams.subscribe((res) => {
      if (res.cId) {
        this.id = res.cId;
        // this.edit()
      }
    })
    // this.getCourses();
    this.loadBatchCategory();
  }

  initControls() {
    this.myForm = this.fb.group({
      COURSE_CATEGORY_ID: ['', Validators.required],
      COURSESHD_COURSE_ID: ['', Validators.required],
      COURSESHD_NAME: ['',],
      COURSESHD_ACADAMICYEAR: [1221],
      COURSESHD_AMOUNT: ['0'],
      courseshd_Stipend: ['0'],
      COURSESHD_NOOFDAYS: [''],
      COURSESHD_STUDENTS_REGISTERED: ['', Validators.required],
      courseshd_classifiedtype_id: ['', Validators.required],
      courseshd_terms: [''],
      courseshd_canappy: [''],
      COURSESHD_LANGUAGE_ID: [56],
      COURSESHD_NOOFSESSIONS: ['0'],
      COURSESHD_STARTDATE: ['', Validators.required],
      COURSESHD_ENDDATE: ['', Validators.required],
      COURSESHD_STARTTIME: ['10:00:00', Validators.required],
      COURSESHD_ENDTIME: ['16:00:00', Validators.required],
      REGISTRATION_STARTDATE: [moment(new Date()).format('yyyy-MM-DD'), Validators.required],
      REGISTRATION_ENDDATE: ['', Validators.required],
      COURSESHD_STUDENT_LEVEL: ['', Validators.required],
      COURSESHD_PAYMENT_METHOD: ['', Validators.required],
      COURSESHD_UPLOAD_DEMO_VIDEO: [''],
      Installments: this.fb.array([]),
      COURSESHD_ONLINE_URL: [''],
      isdaily: [true],


      //Default Values
      COURSESHD_COURSETYPE_ID: "74",
      COURSESHD_COURSEYEAR: "1186",
      COURSESHD_SEMESTER: "1191",
      COURSESHD_SUBJECT: "1002",
      COURSESHD_SECTION: "1231",
      COURSESHD_REGULATION_ID: "21",
      COURSESHD_COUNTRY: "2",
      COURSESHD_LOCATION_ID: "58",
      COURSESHD_ROOM_ID: "3082",
      COURSESHD_NO_OF_STUDENTS: 0,
      COURSESHD_STATUS: 1,
      COURSESHD_LOYALTYPOINTS: "",
      COURSESHD_ALLOW_FEEDBACK: "false",
      QUERY: "",
    });
    this.dayChanged();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Deselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    this.WeeklyDays = [
      { id: 1, sID: 'MO', name: "Monday" },
      { id: 2, sID: 'TU', name: "Tuesday" },
      { id: 3, sID: 'WE', name: "Wednesday" },
      { id: 4, sID: 'TH', name: "Thursday" },
      { id: 5, sID: 'FR', name: "Friday" },
      { id: 6, sID: 'SA', name: "Saturday" },
      { id: 7, sID: 'SU', name: "Sunday" },

    ];


  }

  meeting(val: any) {
    if (val == 'weekly') {
      this.isMeeting = true;
    } else {
      this.isMeeting = false;
    }

  }

  restrictZero(event: any) {
    if (event.target.value.length == 0 && event.key == '0')
      event.preventDefault();
  }

  batchChanged() {
    this.myForm.patchValue({
      COURSESHD_NAME: `${this.cources.find(m => m.COURSE_ID == this.myForm.value.COURSESHD_COURSE_ID).COURSE_NAME}/${this.levels.find(m => m.DICTIONARYID == this.myForm.value.COURSESHD_STUDENT_LEVEL).DICTIONARYNAME}`
    });
  }



  dayChanged() {
    this.myForm.get('COURSESHD_NOOFDAYS')?.valueChanges.subscribe(res => {
      const paymentObject = [{ id: 1, name: 'One time payment' }];
      if (+res > 45)
        paymentObject.push({ id: 2, name: 'Installments' });
      this.paymentMethodList = paymentObject;
    })
  }



  durationCalculation(startDate: any, endDate: any) {
    const noOfDays = this.myForm.get('COURSESHD_NOOFDAYS');
    if (startDate && endDate) {
      const Difference_In_Time = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
      const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      noOfDays?.setValue(Difference_In_Days);
    }
    else
      noOfDays?.setValue(0);
  }








  ngOnInit(): void {
    this.initControls();
    this.getAll();
    if (this.id) {
      this.isEdit = true;
      this.edit();
    }
    // this.getSamvaadUser();
  }

  loadBatchCategory() {

    this.activeSpinner();
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };
    // this.CommonService.postCall("LoadCourseCategory", payLoad).subscribe((res: any) => {
    this.CommonService.getCall("GetAllCategories").subscribe((res: any) => {
      this.catagory = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(); });

  }

  getCourseByCategoryId(categoryId: number = 0) {
    if (categoryId == 0) {
      this.cources = [];
      return;
    }

    this.activeSpinner();
    const payload = {
      RoleID: sessionStorage.RoleId || 0,
      COURSE_CATEGORY_ID: categoryId,
      TENANT_CODE: sessionStorage.TenantCode || 0
    };

    this.CommonService.postCall('GetCourseByCourseCategoryId', payload).subscribe((res: any) => {
      this.cources = res;
      console.log(this.cources);
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(); });
  }

  getAll() {

    this.activeSpinner()
    let level = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.ProficiencyLevel });//GetProficiencyLevel
    // let language = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Language });//GetLanguage
    //let acadamic = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.AcademicYear }); //GetAcademicYear
    forkJoin([level]).subscribe((res) => {
      [this.levels] = [...res];
      this.deactivateSpinner();
    }, err => { this.deactivateSpinner() })

  }

  isChange(id: number) {
    if (id < 2)
      this.deleteAll();
    if (this.myForm.value.COURSESHD_PAYMENT_METHOD == '2') {
      this.plus = true;
      this.paymentChange = true;
      this.add();
    } else {
      this.paymentChange = false;
    }

  }

  getInstallmentGroup() {
    let newGroup = this.fb.group(
      {
        CSI_COURSESHD_ID: [0],
        CSI_FROMDATE: [''],
        CSI_TODATE: [''],
        CSI_PAYMENT_ID: [0],
        CSI_AMOUNT: [''],
        CSI_INSTALLMENT_NAME: [''],
        CSI_CREATED_BY: [sessionStorage.TenantCode],
        CSI_MODIFIED_BY: [sessionStorage.TenantCode],
        TNT_CODE: [sessionStorage.TenantCode],
        STATUS: true
      }
    );
    return newGroup;
  }

  add() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['Installments'];
    let grp: UntypedFormGroup = this.getInstallmentGroup();
    arrayControl.push(grp);
  }

  delete() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['Installments'];
    let index = arrayControl.length;
    arrayControl.removeAt(index - 1);
  }

  deleteAll() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['Installments'];
    arrayControl.clear();
  }

  isVisable() {
    let arrayControl = <UntypedFormArray>this.myForm.controls['Installments'];
    if (arrayControl && arrayControl.controls.length > 2) {
      return true
    }
    else {
      return false
    }
  }

  isAdd() {

    let arrayControl = <UntypedFormArray>this.myForm.controls['Installments'];
    if (arrayControl && arrayControl.controls.length > 9) {
      return false;
    }
    else
      return true;
  }


  endDateChange(eDate: any) {
    const startDate = this.myForm.get('COURSESHD_STARTDATE')?.value;
    if (!startDate) {
      this.toastr.warning('Please select start date');
      this.myForm.get('COURSESHD_ENDDATE')?.setValue(null);
      return
    }
    if (!moment(eDate).isSameOrAfter(startDate)) {
      this.toastr.warning('End date should be equal or more than start Date');
      this.myForm.get('COURSESHD_ENDDATE')?.setValue(null);
      return;
    }
    const endDate = this.myForm.get('COURSESHD_ENDDATE')?.value;
    this.durationCalculation(startDate, endDate);
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  validateDate(event: any) {
    var startDate = event.value;
    this.maxDate = event.value;
    this.regDateCalculation(startDate);
    // console.log(new Date().setHours(0,0,0,0));
    // console.log(new Date(startDate).setHours(0,0,0,0));
    // console.log(new Date(startDate).getTime());
    // console.log(new Date());
    // console.log(new Date(startDate));
    if (new Date().setHours(0, 0, 0, 0) > new Date(startDate).setHours(0, 0, 0, 0)) {
      this.toastr.warning('Please select future date');
      this.myForm.get('COURSESHD_STARTDATE')?.setValue(null);
      return
    }
  }

  regDateCalculation(startDate: any,) {
    const regEndDate: any = this.myForm.get('REGISTRATION_ENDDATE');
    const today = new Date(startDate);
    const tomorrow = new Date(startDate);
    tomorrow.setDate(today.getDate() + 7);
    regEndDate.setValue(this.changeDateTime(tomorrow.toDateString()));
  }


  changeFile(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['video/mp4', 'video/x-m4v', 'video', 'mp4'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload();
      }
      else {
        this.toastr.warning('Please upload video/mp4,video/x-m4v,video formats only.');
        event.target.value = '';
      }
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/CourseSchedule');
    // this.activeSpinner();
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        if (this.fileName) {
          this.myForm.controls['COURSESHD_UPLOAD_DEMO_VIDEO'].setValue(this.fileName)
          // this.deactivateSpinner();

        }
      } catch (e) { console.log(e); }

    }, err => { })
  }
  get f() { return this.myForm.controls; }
  onSubmit(form: UntypedFormGroup) {
    this.activeSpinner();
    this.submitted = true;
    this.getFormValidationErrors(this.myForm);
    if (form.invalid) {
      this.toastr.info('Please Enter All Mandatory Fields');
      this.deactivateSpinner();
      return;
    }
    let payLoad = this.myForm.getRawValue();
    payLoad = {
      ...payLoad,
      COURSESHD_LOYALTYPOINTS: '',
      COURSESHD_ALLOW_FEEDBACK: "false",
      QUERY: '',
      TENANT_CODE: sessionStorage.TenantCode,
      LASTMDFBY: sessionStorage.UserId,
      CREATEDBY: this.editData.CREATEDBY || sessionStorage.UserId,
      weekofdays: this.selectedItems.map(e => e.id).join(','),
    };
    this.getMeetingStatus(payLoad);
    this.deactivateSpinner();

    /*
    setTimeout(() => {
      if (this.isresData == false) {
        if (+this.myForm.value.COURSESHD_PAYMENT_METHOD == 2) {
          if (payLoad.Installments.length == 0) {
            this.toastr.warning('Please enter all installment details');
            return;
      }   
          if (payLoad.Installments.every(e => (e.CSI_TODATE == "" || +e.CSI_AMOUNT <= 0 || e.CSI_INSTALLMENT_NAME == "") ? false : true) == false) {
            this.toastr.warning('Please enter all installment details');
            return;
          }
        }
  
        // sessionStorage.setItem('weekDays', this.selectedItems.map(e => e.id).join(','),);
        this.activeSpinner();
        if (this.isEdit) {
          payLoad.COURSESHD_ID = this.id;
          this.CommonService.postCall('UpdateCourseScheduleBatchPlan', payLoad).subscribe(() => {
            this.deactivateSpinner();
            this.toastr.success(`${this.pageTitle} updated successfully`)
            //update samvaad meeting
            this.createUpdateSamvaadMeeting(payLoad, this.id);
            // setTimeout(() => { window.history.back() }, 200);
          }, err => {
            this.toastr.error(err.error ? err.error : 'schedule Not Updated');
            this.deactivateSpinner();
          })
        } else {
          payLoad.CREATEDBY = sessionStorage.UserId;
          this.CommonService.postCall('CreateCourseScheduleBatchPlan', payLoad).subscribe(res => {
            this.deactivateSpinner();
            this.toastr.success(`${this.pageTitle} saved successfully`);
            //create samvaad meeting
            this.createUpdateSamvaadMeeting(payLoad, res.CSI_COURSESHD_ID);
          }, err => {
            this.toastr.error(err.error ? err.error : `${this.pageTitle} is not created/update`);
            this.deactivateSpinner()
          });
        }
      } else
        return this.toastr.warning('Another Meeting is existing at same time of period, you can upgrade your plan to host multiple meetings');
    }, 500);
*/


  }

  edit() {
    this.isEdit = true;
    let payload = {
      "TENANT_CODE": sessionStorage.getItem('TenantCode'),
      "COURSESHD_ID": this.id
    };

    this.CommonService.postCall('CourseSchedule/Get', payload).subscribe((res: any) => {
      if (res instanceof Array && res.length)
        this.editData = res[0];
      else
        this.editData = res['dtCourseScehdule'];
      this.deactivateSpinner();
      this.getCourseByCategoryId(this.editData.COURSE_CATEGORY_ID);
      this.dataTransfer();
    }, err => { this.deactivateSpinner(); });

  }

  changeDateTime(propertyVal: string, isDateFormat: boolean = true): string {
    return moment(propertyVal).format(isDateFormat ? 'yyyy-MM-DD' : 'HH:mm:ss');
  }

  dataTransfer() {
    //Installment Details
    if (this.editData.Installments.length > 0) {
      const { Installments: installmentList } = this.editData;
      installmentList.forEach(e => {
        this.add();
        e.CSI_FROMDATE = this.changeDateTime(e.CSI_FROMDATE);
        e.CSI_TODATE = this.changeDateTime(e.CSI_TODATE);
      });
      this.myForm.get("Installments")?.patchValue(installmentList);
    }
    this.myForm.patchValue({
      ...this.editData,
      COURSESHD_STARTDATE: this.changeDateTime(this.editData.COURSESHD_STARTDATE),
      COURSESHD_ENDDATE: this.changeDateTime(this.editData.COURSESHD_ENDDATE),
      COURSESHD_STARTTIME: this.changeDateTime(this.editData.COURSESHD_STARTTIME, false),
      COURSESHD_ENDTIME: this.changeDateTime(this.editData.COURSESHD_ENDTIME, false),
      REGISTRATION_STARTDATE: this.changeDateTime(this.editData.REGISTRATION_STARTDATE),
      REGISTRATION_ENDDATE: this.changeDateTime(this.editData.REGISTRATION_ENDDATE)
    });

    this.isChange(+this.editData.COURSESHD_PAYMENT_METHOD);
    //File Path
    this.fileName = this.editData.COURSESHD_UPLOAD_DEMO_VIDEO;
  }

  timeChange(endTime) {
    let controls = this.myForm.controls;
    let stime: any = controls['COURSESHD_STARTTIME'].value;
    let econtrol = controls['COURSESHD_ENDTIME'];

    if (!stime) {
      this.toastr.warning('Please selece start time')
      econtrol.setValue(null)
      return
    }
    var start = moment.utc(stime, "HH:mm");
    var end = moment.utc(endTime, "HH:mm");

    var d = moment.duration(end.diff(start));
    if (d['_milliseconds'] > 0) {

    } else {
      this.toastr.warning("End Time should be more than start time")
      econtrol.setValue(null)
    }

  }

  close() {
    window.history.back()
    document.getElementById('materialFile1')['value'] = '';
    this.fileName = null;
  }

  //samvaad meeting Status

  getMeetingStatus(data: any) {
    // this.enableOrDisabledSpinner();
    const meetingDuration = moment(moment(data.COURSESHD_ENDTIME, "H:mm:ss")).diff(moment(moment(data.COURSESHD_STARTTIME, "H:mm:ss")), 'minutes');
    this.createMeeting.creator.id = this.samvaadUserId;
    let meetingStatusPayload = {
      ...this.createMeeting,
      date: moment(new Date()).format('YYYY-MM-DD'),
      duration: JSON.stringify(meetingDuration),
      name: data.COURSESHD_NAME, //meeting name
      repeatTilldate: data.COURSESHD_ENDDATE,
      startDateTime: data.COURSESHD_STARTDATE + 'T' + data.COURSESHD_STARTTIME,
      startTime: data.COURSESHD_STARTTIME,
      recurrence: JSON.stringify(this.createMeeting.recurrence),
      session: this.isEdit ? this.editData.SESSION_ID ? this.editData.SESSION_ID : '' : '',
    }
    //samvaad meeting Status
    // this.CommonService.samvaadPost("nojwt/tutor/login/meetingstatus", meetingStatusPayload).subscribe((res: any) => {
    //   this.isresData = res;
    //   if (this.isresData == false) {
    if (+this.myForm.value.COURSESHD_PAYMENT_METHOD == 2) {
      if (data.Installments.length == 0) {
        this.toastr.warning('Please enter all installment details');
        return;
      }
      if (data.Installments.every(e => (e.CSI_TODATE == "" || +e.CSI_AMOUNT <= 0 || e.CSI_INSTALLMENT_NAME == "") ? false : true) == false) {
        this.toastr.warning('Please enter all installment details');
        return;
      }
    }

    // sessionStorage.setItem('weekDays', this.selectedItems.map(e => e.id).join(','),);
    this.activeSpinner();
    if (this.isEdit) {
      data.COURSESHD_ID = this.id;
      this.CommonService.postCall(`${constants.UpdateCourseScheduleBatchPlan}`, data).subscribe(() => {
        this.deactivateSpinner();
        this.toastr.success(`${this.pageTitle} updated successfully`);
        //update samvaad meeting
        this.createUpdateSamvaadMeeting(data, this.id);
        this.close();
        // setTimeout(() => { window.history.back() }, 200);
      }, err => {
        this.toastr.error(err.error ? err.error : 'schedule Not Updated');
        this.deactivateSpinner();
      })
    } else {
      data.CREATEDBY = sessionStorage.UserId;
      this.CommonService.postCall(`${constants.CreateCourseScheduleBatchPlan}`, data).subscribe(res => {
        this.deactivateSpinner();
        this.toastr.success(`${this.pageTitle} saved successfully`);
        //create samvaad meeting
        this.createUpdateSamvaadMeeting(data, res.CSI_COURSESHD_ID);
        this.close();
      }, err => {
        this.toastr.error(err.error ? err.error : `${this.pageTitle} is not created / update`);
        this.deactivateSpinner();
      });
    }
    //   } else
    //     return this.toastr.warning('Another Meeting is existing at same time of period, you can upgrade your plan to host multiple meetings');
    // }, e => { this.enableOrDisabledSpinner(false); setTimeout(() => { window.history.back() }, 200); });

  }


  createUpdateSamvaadMeeting(data: any, COURSESHD_ID: string) {
    this.createMeeting.recurrence.end.until = data.COURSESHD_ENDDATE;
    if (this.myForm.get('isdaily')?.value == false) {
      const days: any = this.selectedItems.map(e => e.id);
      const newArr: any = this.WeeklyDays.filter(e => days.includes(e.id)).map(e => e.sID);
      this.createMeeting.recurrence.repeatOn.daysOnWeek = newArr;
    }
    this.createMeeting.creator.id = this.samvaadUserId;

    const meetingDuration = moment(moment(data.COURSESHD_ENDTIME, "H:mm:ss")).diff(moment(moment(data.COURSESHD_STARTTIME, "H:mm:ss")), 'minutes');

    let createMeetingPayload = {
      ...this.createMeeting,
      date: moment(new Date()).format('YYYY-MM-DD'),
      duration: JSON.stringify(meetingDuration),
      name: data.COURSESHD_NAME, //meeting name
      repeatTilldate: data.COURSESHD_ENDDATE,
      startDateTime: data.COURSESHD_STARTDATE + 'T' + data.COURSESHD_STARTTIME,
      startTime: data.COURSESHD_STARTTIME,
      recurrence: JSON.stringify(this.createMeeting.recurrence),
      session: this.isEdit ? this.editData.SESSION_ID ? this.editData.SESSION_ID : '' : ''
    }
    //create or update samvaad meeting
    // this.CommonService.samvaadPost("jwt/meeting/saveorupdate", createMeetingPayload).subscribe((res: any) => {
    //   this.updateMeetingDetails(res.data, COURSESHD_ID);
    // }, e => { setTimeout(() => { window.history.back() }, 200); });
  }

  getSamvaadUser() {
    this.enableOrDisabledSpinner();
    this.CommonService.getCall('Account/GetSamvaadUser/', `${sessionStorage.TenantCode}`).subscribe((res: any) => {

      res.map(e => {
        this.samavaadUserName = e.USERNME,
          this.samavaadPassword = e.PASSWORD
      })
      this.enableOrDisabledSpinner(false);
      this.logInSamvaadAccount();
    }, e => { this.enableOrDisabledSpinner(false); });
    // this.onDestroy.add(mycourse$);
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  logInSamvaadAccount() {
    this.enableOrDisabledSpinner();
    let payload = {
      email: this.samavaadUserName,
      password: this.samavaadPassword,
      tutor: true
    }
    this.CommonService.postCall('nojwt/tutor/login/login', payload, true).subscribe((res: any) => {

      const { JwtToken, creatorId } = res.data;
      this.samvaadUserId = creatorId;
      sessionStorage.setItem('stoken', JwtToken);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    // this.onDestroy.add(mycourse$);
  }

  updateMeetingDetails(data: any, COURSESHD_ID: string) {
    this.enableOrDisabledSpinner();
    let payload = {
      SESSION_ID: data.session ? data.session : '',
      PARTICIPANT_URL: data.participantLink,
      HOST_URL: data.hostLink,
      COURSE_SHD_ID: COURSESHD_ID
    }
    this.CommonService.postCall('CourseSchedule/UpdateSamvaadMeeting', payload).subscribe((res: any) => {
      this.enableOrDisabledSpinner(false);
      // console.log(res);
      setTimeout(() => { window.history.back() }, 200);
    }, e => { this.enableOrDisabledSpinner(false); setTimeout(() => { window.history.back() }, 200); });

  }


}
