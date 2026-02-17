import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, UntypedFormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { dataDictionary } from 'src/app/dataDictionary';
import * as moment from 'moment';
import { min } from 'date-fns';
import { addDays } from 'date-fns/fp';
import { addYears } from 'date-fns/esm';
import { validateEvents } from 'calendar-utils';
@Component({
  selector: 'app-add-student-admission',
  templateUrl: './add-student-admission.component.html',
  styleUrls: ['./add-student-admission.component.css']
})
export class AddStudentAdmissionComponent extends BaseComponent implements OnInit {
  tid: string = '';
  titles: Array<any> = [];

  id: string;
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any = {};
  genders: Array<any> = [];
  gender: any = '';
  DATE_OF_ADMISSION: any = '';
  admissionNum: any = '';

  admissionintoCls: any = '';

  title: any = '';
  fname: any = '';
  mname: any = '';
  lname: any = '';
  mblnumber: number;
  username: any = '';
  psword: any = '';
  confirmpsword: any = '';
  mothertonge: any = '';
  otherlan: any = '';
  dob: any = '';
  nationality: any = '';
  religion: any = '';
  caste: any = '';

  fathername: any = '';
  fatherage: number;
  fatherqualification: any = '';
  fatherdesignation: any = '';
  residenceaddress: any = '';
  phonenum: number;
  mobnum: number;
  remail: any = '';
  ofcaddress: any = '';
  ofcphnnum: number;
  ofcmblnum: number;
  ofcemail: any = '';
  adrnum: number;

  mothername: string = '';
  motherage: number;
  educationqualification: string = '';
  motherdesignation: string = '';
  motherresidence: string = '';
  motherphonenum: number;
  mothermblnum: number;
  motheremail: any = '';
  motherofcadd: string = '';
  motherofcphnnum: number;
  motherofcmblnum: number;
  motherofcemail: any = '';
  motheradharnum: number;



  SIBILING_NAME: string = '';
  RELATION: string = '';
  SIBILING_CLASS: string = '';
  SIBILING_SECTION: string = '';

  birthcertificate: false;
  tc: false;
  bonafied: false;
  castecertificate: false;
  adarcard: false;

  previousscldetails: string = '';
  personalintrests: string = '';
  IdentificationMarks1: string = '';
  IdentificationMarks2: string = '';
  numinemgcase: number;
  bulksms: number;




  studentid: string = '';
  Courses: any;


  constructor(CommonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {
    super(CommonService, toastr)

    this.getTennates();


    this.getAll();
    active.queryParams.subscribe((res) => {
      if (res.sId) {
        this.id = res.sId;
      }
    })

  }


  ngOnInit(): void {
    this.myForm = this.fb.group({
      TNT_ID: ['', Validators.required],
      DATE_OF_ADMISSION: ['', Validators.required],
      ADMISSION_NO: ['', Validators.required],
      ADMISSION_INTO_CLASS: ['', Validators.required],
      Title: ['', Validators.required],
      FIRST_NAME: ['', Validators.required],
      MIDDLE_NAME: [''],
      LAST_NAME: ['', Validators.required],
      MOBILE: ['', [Validators.required, Validators.minLength(10)]],
      EMAIL: ['', [Validators.required, Validators.email]],
      PASSWORD: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],

      GENDER: ['', Validators.required],
      MOTHER_TONGE: ['', Validators.required],
      OTHER_LANGUAGE: [''],
      DOB: ['', Validators.required],
      NATIONALITY: ['', Validators.required],
      RELIGION: ['', Validators.required],
      CASTE: ['', Validators.required],

      FATHER_NAME: [''],
      FATHER_AGE: [''],
      FATHER_QULIFICATION: [''],
      FATHER_DESIGNATION: [''],
      FATHER_RESIDENCE_ADDRESS: [''],
      FATHER_RESIDENCE_PHONE: [''],
      FATHER_RESIDENCE_MOBILE: [''],
      FATHER_OFFICE_ADDRESS: [''],
      FATHER_OFFICE_PHONE: [''],
      FATHER_OFFICE_MOBILE: [''],
      FATHER_ADHAR: [''],
      FATHER_OFFICE_EMAIL: [''],
      FATHER_RESIDENCE_EMAIL: [''],

      MOTHER_NAME: [''],
      MOTHER_AGE: [''],
      MOTHER_QULIFICATION: [''],
      MOTHER_DESIGNATION: [''],
      MOTHER_RESIDENCE_ADDRESS: [''],
      MOTHER_RESIDENCE_PHONE: [''],
      MOTHER_RESIDENCE_MOBILE: [''],
      MOTHER_OFFICE_ADDRESS: [''],
      MOTHER_OFFICE_PHONE: [''],
      MOTHER_OFFICE_MOBILE: [''],
      MOTHER_ADHAR: [''],
      MOTHER_OFFICE_EMAIL: [''],
      MOTHER_RESIDENCE_EMAIL: [''],

      SIBILING_ID: [''],
      SIBILING_NAME: [''],
      RELATION: [''],
      SIBILING_CLASS: [''],
      SIBILING_SECTION: [''],

      DOB_CERTIFICATE: [''],
      TRANSFER_CERTIFICATE: [''],
      STUDY_CERTIFICATE: [''],
      CASTE_CERTIFICATE: [''],
      ADHAR_CARD_COPY: [''],

      PREVIOUS_SCHOOL: [''],
      PERSONAL_INTERSTS: [''],
      IDETFICATION_MARKS1: [''],
      IDETFICATION_MARKS2: [''],
      EMERGENCY_CONTACT: [''],
      MOBILE_NUMBER_SMS: [''],

      formArray: this.fb.array([]),
    })
    if (this.id) {
      this.isEdit = true;
      this.edit(this.id);

    }

    // const arrayControl = <FormArray>this.myForm.controls['formArray'];
    // for (let i in []) {
    //   let grp: FormGroup = this.getOptionGroup({})
    //   arrayControl.push(grp)
    // }
  }




  getOptionGroup(data) {
    let newGroup = this.fb.group({
      SIBILING_ID: [data.SIBILING_ID ? data.SIBILING_ID : Number, Validators.required],
      SIBILING_NAME: [data.SIBILING_NAME ? data.SIBILING_NAME : '', Validators.required],
      RELATION: [data.RELATION ? data.RELATION : '', Validators.required],
      SIBILING_CLASS: [data.SIBILING_CLASS ? data.SIBILING_CLASS : '', Validators.required],
      SIBILING_SECTION: [data.SIBILING_SECTION ? data.SIBILING_SECTION : '', Validators.required]
    });
    return newGroup
  }


  add(data = {}) {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let grp: UntypedFormGroup = this.getOptionGroup(data)
    arrayControl.push(grp)

  }

  delete() {

    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let index = arrayControl.length;

    arrayControl.removeAt(index - 1)
    // this.isEdit=true
  }

  isVisable() {
    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl.length && arrayControl.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  isAdd() {

    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl.length && arrayControl.length > 4) {
      return false
    }
    else {
      return true
    }

  }




  getAll() {
    let gender = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Gender }).subscribe(res => {
      this.deactivateSpinner();
      this.genders = res;

    }, err => {
      this.deactivateSpinner();
    })

    let title = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Title }).subscribe(res => {
      this.titles = res;
    });
  }

  close() {
    this.route.navigate(['/HOME/studentAdmission'])
  }




  onSubmit(form: UntypedFormGroup) {

    let payload = {
      "TNT_ID": this.tid,
      "ADMISSION_NO": this.admissionNum,
      "DATE_OF_ADMISSION": this.DATE_OF_ADMISSION,
      "ADMISSION_INTO_CLASS": parseInt(this.admissionintoCls),
      "Title": this.title,
      "FIRST_NAME": this.fname,
      "LAST_NAME": this.lname,
      "MIDDLE_NAME": this.mname,
      "MOBILE": this.mblnumber,
      "EMAIL": this.username,
      "PASSWORD": this.psword,
      "confirmPassword": this.confirmpsword,
      "GENDER": parseInt(this.gender),
      "MOTHER_TONGE": this.mothertonge,
      "OTHER_LANGUAGE": this.otherlan,
      "DOB": this.dob,
      "NATIONALITY": parseInt(this.nationality),
      "RELIGION": parseInt(this.religion),
      "CASTE": this.caste,

      "FATHER_NAME": this.fathername,
      "FATHER_AGE": this.fatherage,
      "FATHER_QULIFICATION": this.fatherqualification,
      "FATHER_DESIGNATION": this.fatherdesignation,
      "FATHER_RESIDENCE_ADDRESS": this.residenceaddress,
      "FATHER_RESIDENCE_EMAIL": this.remail,
      "FATHER_RESIDENCE_PHONE": this.phonenum,
      "FATHER_RESIDENCE_MOBILE": this.mobnum,
      "FATHER_OFFICE_ADDRESS": this.ofcaddress,
      "FATHER_OFFICE_EMAIL": this.ofcemail,
      "FATHER_OFFICE_PHONE": this.ofcphnnum,
      "FATHER_OFFICE_MOBILE": this.ofcmblnum,
      "FATHER_ADHAR": this.adrnum,

      "MOTHER_NAME": this.mothername,
      "MOTHER_AGE": this.motherage,
      "MOTHER_QULIFICATION": this.educationqualification,
      "MOTHER_DESIGNATION": this.motherdesignation,
      "MOTHER_RESIDENCE_ADDRESS": this.motherresidence,
      "MOTHER_RESIDENCE_EMAIL": this.motheremail,
      "MOTHER_RESIDENCE_PHONE": this.motherphonenum,
      "MOTHER_RESIDENCE_MOBILE": this.mothermblnum,
      "MOTHER_OFFICE_ADDRESS": this.motherofcadd,
      "MOTHER_OFFICE_EMAIL": this.motherofcemail,
      "MOTHER_OFFICE_PHONE": this.motherofcphnnum,
      "MOTHER_OFFICE_MOBILE": this.motherofcmblnum,
      "MOTHER_ADHAR": this.motheradharnum,



      'SIBILINGS': this.myForm.controls['formArray'].value,

      "DOB_CERTIFICATE": this.birthcertificate,
      "TRANSFER_CERTIFICATE": this.tc,
      "STUDY_CERTIFICATE": this.bonafied,
      "CASTE_CERTIFICATE": this.castecertificate,
      "ADHAR_CARD_COPY": this.adarcard,

      "PREVIOUS_SCHOOL": this.previousscldetails,
      "PERSONAL_INTERSTS": this.personalintrests,
      "IDETFICATION_MARKS1": this.IdentificationMarks1,
      "IDETFICATION_MARKS2": this.IdentificationMarks2,
      "EMERGENCY_CONTACT": this.numinemgcase,
      "MOBILE_NUMBER_SMS": this.bulksms,

      "USER_ID": this.userId,
      "TNT_CODE": this.tid,
      // "TENANT_CODE":sessionStorage.getItem('TenantCode')

    }



    if (this.isEdit) {
      payload['student_regid'] = this.id;
      this.CommonService.postCall("studentregistration/Update", payload).subscribe((response: any) => {
        this.editData = response;

        this.toastr.success("studentregistration Updated Successfully")
        this.load();
        // this.deactivateSpinner();
        this.tid = '';
        this.admissionNum = '';
        this.DATE_OF_ADMISSION = '';
        this.admissionintoCls = '';
        this.title = '';
        this.fname = '';
        this.lname = '';
        this.mname = '';
        this.mblnumber = 0,
          this.username = '',
          this.psword = '',
          this.confirmpsword = '',
          this.genders = [];
        this.dob = '';
        this.mothertonge = '';
        this.otherlan = '';
        this.nationality = '';
        this.religion = '';
        this.caste = '';

        this.fathername = '';
        this.fatherage = 0;
        this.fatherqualification = '';
        this.fatherdesignation = '';
        this.residenceaddress = '';
        this.remail = '';
        this.phonenum = 0;
        this.mobnum = 0;
        this.ofcaddress = '';
        this.ofcemail = '';
        this.ofcphnnum = 0;
        this.ofcmblnum = 0;
        this.adrnum = 0;

        this.mothername = '';
        this.motherage = 0;
        this.educationqualification = '';
        this.motherdesignation = '';
        this.motherresidence = '';
        this.motherphonenum = 0;
        this.mothermblnum = 0;
        this.motheremail = '';
        this.motherofcadd = '';
        this.motherofcphnnum = 0;
        this.motherofcmblnum = 0;
        this.motherofcemail = '';
        this.motheradharnum = 0;

        this.SIBILING_NAME = '';
        this.RELATION = '';
        this.SIBILING_CLASS = '';
        this.SIBILING_SECTION = '';

        this.birthcertificate = false;
        this.tc = false;
        this.bonafied = false;
        this.castecertificate = false;
        this.adarcard = false;

        this.previousscldetails = '';
        this.personalintrests = '';
        this.IdentificationMarks1 = '';
        this.IdentificationMarks2 = '';
        this.numinemgcase = 0;
        this.bulksms = 0;







        document.getElementById('md_close').click()
      }, err => {
        this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'studentRegistration not Updated')
      });
    }
    else {

      this.CommonService.postCall("studentregistration/Create", payload).subscribe((res: any) => {
        this.editData = res;
        this.toastr.success("studentregistration  Created Successfully")
        this.load()
        // this.deactivateSpinner()
        this.tid = '';

        this.admissionNum = '';
        this.DATE_OF_ADMISSION = '';
        this.admissionintoCls = '';
        this.title = '';
        this.fname = '';
        this.lname = '';
        this.mname = '';
        this.mblnumber = 0;
        this.username = '',
          this.psword = '',
          this.confirmpsword = '',
          this.genders = [];
        this.dob = '';
        this.mothertonge = '';
        this.otherlan = '';
        this.nationality = '';
        this.religion = '';
        this.caste = '';

        this.fathername = '';
        this.fatherage = this.fatherage;
        this.fatherqualification = '';
        this.fatherdesignation = '';
        this.residenceaddress = '';
        this.remail = '';
        this.phonenum = 0;
        this.mobnum = 0;
        this.ofcaddress = '';
        this.ofcemail = '';
        this.ofcphnnum = 0;
        this.ofcmblnum = 0;
        this.adrnum = 0;

        this.mothername = '';
        this.motherage = 0;
        this.educationqualification = '';
        this.motherdesignation = '';
        this.motherresidence = '';
        this.motherphonenum = 0;
        this.mothermblnum = 0;
        this.motheremail = '';
        this.motherofcadd = '';
        this.motherofcphnnum = 0;
        this.motherofcmblnum = 0;
        this.motherofcemail = '';
        this.motheradharnum = 0;

        this.SIBILING_NAME = '';
        this.RELATION = '';
        this.SIBILING_CLASS = '';
        this.SIBILING_SECTION = '';

        this.birthcertificate = false;
        this.tc = false;
        this.bonafied = false;
        this.castecertificate = false;
        this.adarcard = false;

        this.previousscldetails = '';
        this.personalintrests = '';
        this.IdentificationMarks1 = '';
        this.IdentificationMarks2 = '';
        this.numinemgcase = 0;
        this.bulksms = 0;




        document.getElementById('md_close').click()
      });


    }


  }
  load() {
    let payload = {
      "TENANT_CODE": 71258320
    }
    this.CommonService.getEditorData("StudentRegistration/GetList", payload).subscribe((response: any) => {
      this.editData = response;

    })

  }

  edit(student_regid) {

    this.isEdit = true;

    this.studentid = student_regid
    let payload = {
      "student_regid": student_regid,
      "TENANT_CODE": 71258320,
    }
    this.CommonService.postCall("studentregistration/Get", payload).subscribe((response: any) => {

      this.editData = response;
      this.dataTransfer()

    })

  }

  getTennates() {
    this.activeSpinner();
    this.CommonService.postCall('GetTenantByRoleId', { RoleId: 4 }).subscribe(
      (res) => {
        this.tenanates = res;
        this.deactivateSpinner()
      }, err => {
        this.deactivateSpinner()
      }
    )
  }



  courceChange(acId) {
    this.activeSpinner()
    let payLoad = {

      "tid": acId.target.value
    }
    this.CommonService.getCall('Courses/GetAdminCourses/' + sessionStorage.getItem('UserId') + '/' + sessionStorage.getItem('RoleId') + '/' + sessionStorage.getItem('TenantCode')).subscribe((res: any) => {
      this.courses = res;

      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() });

  }


  passwordCheck() {
    let pControl = this.myForm.controls['PASSWORD'];
    let cControl = this.myForm.controls['confirmPassword'];
    if (!pControl.value) {
      this.toastr.warning('Please enter the password');
      cControl.setValue(null);
      return;
    }
    if (pControl.value != cControl.value) {
      this.toastr.warning('Password and Confirm Password Should be same');
      cControl.setValue(null);
    }

  }
  dataTransfer() {
    let controls = this.myForm.controls;
    Object.keys(controls).map((key) => {
      let ctrl: AbstractControl = controls[key];
      if (key != 'formArray') {
        ctrl.setValue(this.editData[key])
      }
    });
    controls['DATE_OF_ADMISSION'].setValue(moment(this.editData['DATE_OF_ADMISSION']).format('yyyy-MM-DD'));

    controls['DOB'].setValue(moment(this.editData['DOB']).format('yyyy-MM-DD'));

    controls['TNT_ID'].setValue(this.editData['TNT_ID']);

    controls['ADMISSION_INTO_CLASS'].setValue(this.editData['ADMISSION_INTO_CLASS']);







    //const arrayControl = <FormArray>this.myForm.controls['formArray'];
    // controls['studentid'].setValue(moment(this.editData['student_regid']));
    // controls['SIBILING_SECTION'].setValue(this.editData['SIBILINGS']);
    // this.myForm.controls['formArray']=this.editData['SIBILINGS'];

    let arrayControl: UntypedFormArray = <UntypedFormArray>this.myForm.controls['formArray'];


    let sibiling: Array<any> = this.editData['SIBILINGS'] || [];

    // document.getElementById('SIBILING_ID'),

    sibiling.map((item) => {

      this.add(item)

    });



  }
}


