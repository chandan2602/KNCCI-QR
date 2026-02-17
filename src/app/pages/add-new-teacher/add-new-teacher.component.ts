import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { dataDictionary } from 'src/app/dataDictionary';
import * as moment from 'moment';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-add-new-teacher',
  templateUrl: './add-new-teacher.component.html',
  styleUrls: ['./add-new-teacher.component.css']
})
export class AddNewTeacherComponent extends BaseComponent implements OnInit {

  id: string;
  myForm: UntypedFormGroup;
  editorData: any = [];
  isEdit: boolean = false;
  editData: any = {};
  genders: Array<any> = []

  districtName: string = '';
  mandalName: any = '';
  villageName: any = '';
  schoolName: any = '';
  teacherCode: any = '';
  aadhaarNo: any = '';
  teacherName: any = '';
  gender: any = '';
  dob: string = '';
  socialCategory: string = '';
  natureOfAppointment: string = '';
  typeOfTeacher: string = '';
  dofAppointment: string = '';
  dojPresentCadre:string = '';
  academic: string = '';
  professional: string = '';
  classTaught: string = '';
  appointedSubject: string = '';
  subjectI: string = '';
  subjectII: string = '';
  brc: any = '';
  crc: any = '';
  diet: any = '';
  others: any = '';
  trainingNeed: string = '';
  trainingRecived: string = '';
  nonTeachingAssignment: any = '';
  mathsStudiedUpto: string = '';
  socialStudiedUpto: string = '';
  englidhStudiedUpto: string = '';
  languageStudiedUpto: string = '';
  scienceStudiedUpto: string = '';
  workingPresentSchool: any = '';
  disability: string = '';
  trainedInCWSN: string = '';
  trainedInComputer: string = '';
  mobilNumber: any = '';
  email: any = '';
  tetQualified: string = '';
  actingHeadmaster: string = '';
  mediumAppointed: string = '';
  religion: string = '';
  myGroup: UntypedFormGroup;
  teacherId: string = '';

  createdOn:string='';
  createdBy:string='';
  modifiedOn:string='';
  modifiedBy:string='';




  districtArray=[{'id':1,'name':'Adilabad'},{'id':2,'name':'Hyderabad'}]
  mandalArray=[{'id':1,'name':'Bela'},{'id':2,'name':'Jainath'}]
  socialArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  natureArray=[{'id':1,'name':'Appointment'},{'id':2,'name':'Appointment2'}]
  teacherArray=[{'id':1,'name':'Teacher'},{'id':2,'name':'Class Teacher'},{'id':3,'name':'Head Master'}]
  academicArray=[{'id':1,'name':'2020-2021'},{'id':2,'name':'2021-2022'},{'id':3,'name':'2022-2023'}]
  professionalArray=[{'id':1,'name':'Teacher'},{'id':2,'name':'PT'},{'id':3,'name':'Computer'}]
  classtaughtArray=[{'id':1,'name':'ClassI'},{'id':2,'name':'ClassII'},{'id':3,'name':'ClassIII'},{'id':4,'name':'ClassIV'},{'id':1,'name':'ClassV'},{'id':2,'name':'ClassVI'},{'id':3,'name':'ClassVII'},{'id':4,'name':'ClassVIII'}]
  appointedSubjectArray=[{'id':1,'name':'Maths'},{'id':2,'name':'Social'},{'id':3,'name':'Science'},{'id':4,'name':'Engilsh'}]
  subject1Array=[{'id':1,'name':'Maths'},{'id':2,'name':'Social'},{'id':3,'name':'Science'},{'id':4,'name':'Engilsh'}]
  subject2Array=[{'id':1,'name':'Maths'},{'id':2,'name':'Social'},{'id':3,'name':'Science'},{'id':4,'name':'Engilsh'}]
  trainingneedArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  trainingrecivedArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  mathsArray=[{'id':1,'name':'SSC'},{'id':2,'name':'Inter'},{'id':3,'name':'Degree'},{'id':4,'name':'PG'}]
  socialuptoArray=[{'id':1,'name':'SSC'},{'id':2,'name':'Inter'},{'id':3,'name':'Degree'},{'id':4,'name':'PG'}]
  englishArray=[{'id':1,'name':'SSC'},{'id':2,'name':'Inter'},{'id':3,'name':'Degree'},{'id':4,'name':'PG'}]
  languageArray=[{'id':1,'name':'SSC'},{'id':2,'name':'Inter'},{'id':3,'name':'Degree'},{'id':4,'name':'PG'}]
  scienceArray=[{'id':1,'name':'SSC'},{'id':2,'name':'Inter'},{'id':3,'name':'Degree'},{'id':4,'name':'PG'}]
  disabilityArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  cwsnArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  comArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  tetArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  headmasterArray=[{'id':1,'name':'Yes'},{'id':2,'name':'No'}]
  mediumArray=[{'id':1,'name':'Medium-I'},{'id':2,'name':'Medium-II'},{'id':3,'name':'Medium-III'},{'id':4,'name':'Medium-IV'}]
  religionArray=[{'id':1,'name':'Hindu'},{'id':2,'name':'Muslim'},{'id':3,'name':'Christian'},{'id':4,'name':'Sikh'}]


  constructor(CommonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.getAll();
    active.queryParams.subscribe((res) => {
      if (res.tId) {
        this.id = res.tId;
      }
    })

  }


  ngOnInit(): void {
    this.myForm = this.fb.group({
      DISTRICT_NAME: ['', Validators.required],
      MANDAL_NAME: ['', Validators.required],
      VILLAGE_NAME: ['', Validators.required],
      SCHOOL_NAME: ['', Validators.required],
      TEACHER_CODE: ['', Validators.required],
      AADHAAR_NO: ['', Validators.required],
      TEACHER_NAME: ['', Validators.required],
      Gender: ['', Validators.required],
      DOB: ['', Validators.required],
      SOCIAL_CATEGORY: ['', Validators.required],
      NATURE_OF_APPOINTMENT: ['', Validators.required],
      TYPE_OF_TEACHER: ['', Validators.required],
      DOF_APPOINTMENT: ['', Validators.required],
      DOJ_PRESENT_CADRE: ['', Validators.required],
      ACADEMIC: ['', Validators.required],
      PROFESSIONAL: ['', Validators.required],
      CLASS_TAUGHT: ['', Validators.required],
      APPOINTED_SUBJECT: ['', Validators.required],
      SUBJECT_I: ['', Validators.required],
      SUBJECT_II: [1, Validators.required],
      BRC: ['', Validators.required],
      CRC: ['', Validators.required],
      DIET: ['', Validators.required],
      OTHERS: ['', Validators.required],
      TRAINING_NEED: ['', Validators.required],
      TRAINING_RECEIVED: ['', Validators.required],
      NON_TEACHING_ASSIGNMENTS: ['', Validators.required],
      MATHS_STUDIED: ['', Validators.required],
      SOCIAL_STUDIED: ['', Validators.required],
      ENGILSH_STUDIED: ['', Validators.required],
      LANGUAGE_SUBJECT: ['', Validators.required],
      SCIENCE_STUDIED: ['', Validators.required],
      WORKING_PRESENT_SCHOOL: ['', Validators.required],
      DISABILITY: ['', Validators.required],
      TRAINED_IN_CWSN: ['', Validators.required],
      TRAINED_IN_COMPUTER: ['', Validators.required],
      MOBILE_NUMBER: ['', [Validators.required,Validators.maxLength(12),Validators.minLength(10)]],
      EMAIL: ['', Validators.required],
      TET_QUALIFIED: ['', Validators.required],
      ACTING_HEADMASTER: ['', Validators.required],
      MEDIUM_APPOINTED: ['', Validators.required],
      RELIGION: ['', Validators.required],


      formArray: this.fb.array([]),
    })

    if (this.id) {
      this.isEdit = true;
      this.onEdit(this.id);

    }

  }










  getAll() {
    let gender = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Gender }).subscribe(res => {
      this.deactivateSpinner();
      this.genders = res;


    }, err => {
      this.deactivateSpinner();
    })
  }



  onSubmit(form: UntypedFormGroup) {

    let payload = {
      "DISTRICT_ID": parseInt(this.districtName),
      "MANDAL_ID": parseInt(this.mandalName),
      "VILLAGE_NAME": this.villageName,
      "SCHOOL_NAME": this.schoolName,
      "TEACHER_CODE": parseInt(this.teacherCode),
      "AADHAAR_NUMBER": parseInt(this.aadhaarNo),
      "TEACHER_NAME": this.teacherName,
      "GENDER_ID": parseInt(this.gender),
      "DOB": this.dob,
      "SOCIAL_CATEGORY": parseInt(this.socialCategory),
      "NATURE_OF_APPOINTMENT": parseInt(this.natureOfAppointment),
      "TYPE_OF_TEACHER": parseInt(this.typeOfTeacher),
      "DATE_OF_FIRST_APPOINTMENT": this.dofAppointment,
      "DATE_OF_JOINING_PRESENT_CADRE": this.dojPresentCadre,
      "ACADEMIC": parseInt(this.academic),
      "PROFESSIONAL": parseInt(this.professional),
      "CLASS_TAUGHT": parseInt(this.classTaught),
      "APPOINTED_FOR_SUBJECTS": parseInt(this.appointedSubject),
      "SUBJECT1": parseInt(this.subjectI),
      "SUBJECT2": parseInt(this.subjectII),
      "BRC": this.brc,
      "CRC": this.crc,
      "DIET": this.diet,
      "OTHERS": this.others,
      "TRAINING_NEED": parseInt(this.trainingNeed),
      "TRAINING_RECEIVED": parseInt(this.trainingRecived),
      "NON_TEACHING_ASSIGNMENTS": parseInt(this.nonTeachingAssignment),
      "MATHS_STUDIED_UPTO": parseInt(this.mathsStudiedUpto),
      "SOCIAL_STUDIED_UPTO": parseInt(this.socialStudiedUpto),
      "ENGLISH_STUDIED_UPTO": parseInt(this.englidhStudiedUpto),
      "LANGUAGE_SUBJECTS_STUDIES_UPTO": parseInt(this.languageStudiedUpto),
      "SCIENCE_STUDIED_UPTO": parseInt(this.scienceStudiedUpto),
      "PRESENT_SCHOOL": parseInt(this.workingPresentSchool),
      "DISABILITY_TYPE": parseInt(this.disability),
      "TEACHING_CWSN": parseInt(this.trainedInCWSN),
      "TEACHING_THROUGH_COMPUTER": parseInt(this.trainedInComputer),
      "MOBILENUMBER": this.mobilNumber,
      "EMAIL": this.email,
      "IS_TET_QUALIFIED": parseInt(this.tetQualified),
      "ACTING_AS_HEADMASTERS": parseInt(this.actingHeadmaster),
      "MEDIUM_UNDER_WHICH_TEACHER_APPOINTED": parseInt(this.mediumAppointed),
      "RELIGION": parseInt(this.religion),


      "USER_ID": this.userId,
      "TENANT_CODE":this.TenantCode,
      // "CREATED_ON":this.createdOn,
      // "CREATED_BY":this.createdBy,
      // "MODIFIED_ON":this.modifiedOn,
      // "MODIFIED_BY":this.modifiedBy




    }
    this.activeSpinner();
    if (this.isEdit) {
      payload['TEACHERREG_ID']=this.id;
      this.CommonService.postCall("TeacherRegistration/Update", payload).subscribe((response: any) => {
        this.editorData = response;
        this.toastr.success("TeacherRegistration Updated Successfully")
        this.load();
        this.deactivateSpinner();

        this.districtName = '';
        this.mandalName = '';
        this.villageName = '';
        this.teacherCode = '';
        this.aadhaarNo = '';
        this.teacherName = '';
        this.gender = [];
        this.dob = '';
        this.socialCategory = '';
        this.natureOfAppointment = '';
        this.typeOfTeacher = '';
        this.dofAppointment = '';
        this.dojPresentCadre = '';
        this.academic = '';
        this.professional = '';
        this.classTaught = '';
        this.appointedSubject = '';
        this.subjectI = '';
        this.subjectII = '';
        this.brc = '';
        this.crc = '';
        this.diet = '';
        this.others = '';
        this.trainingNeed = '';
        this.trainingRecived = '';
        this.nonTeachingAssignment = '';
        this.mathsStudiedUpto = '';
        this.socialStudiedUpto = '';
        this.englidhStudiedUpto = '';
        this.languageStudiedUpto = '';
        this.scienceStudiedUpto = '';
        this.workingPresentSchool = '';
        this.disability = '';
        this.trainedInCWSN = '';
        this.trainedInComputer = '';
        this.mobilNumber = '';
        this.email = '';
        this.mediumAppointed = '';
        this.religion = '';

      


        document.getElementById('md_close').click()
      }, err => {
        this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'TeacherRegistration not Updated')
      });
    }



    else {
      this.CommonService.postCall("TeacherRegistration/Create", payload).subscribe((response: any) => {
        this.editorData = response;
        this.toastr.success("TeacherRegistration Created Successfully")
        this.load();
        this.deactivateSpinner();

        this.districtName = '';
        this.mandalName = '';
        this.villageName = '';
        this.teacherCode = '';
        this.aadhaarNo = '';
        this.teacherName = '';
        this.gender = [];
        this.dob = '';
        this.socialCategory = '';
        this.natureOfAppointment = '';
        this.typeOfTeacher = '';
        this.dofAppointment = '';
        this.dojPresentCadre = '';
        this.academic = '';
        this.professional = '';
        this.classTaught = '';
        this.appointedSubject = '';
        this.subjectI = '';
        this.subjectII = '';
        this.brc = '';
        this.crc = '';
        this.diet = '';
        this.others = '';
        this.trainingNeed = '';
        this.trainingRecived = '';
        this.nonTeachingAssignment = '';
        this.mathsStudiedUpto = '';
        this.socialStudiedUpto = '';
        this.englidhStudiedUpto = '';
        this.languageStudiedUpto = '';
        this.scienceStudiedUpto = '';
        this.workingPresentSchool = '';
        this.disability = '';
        this.trainedInCWSN = '';
        this.trainedInComputer = '';
        this.mobilNumber = '';
        this.email = '';
        this.mediumAppointed = '';
        this.religion = '';


        document.getElementById('md_close').click()
      }, err => {
        this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'TeacherRegistration not Created')
      });
    }

  }
  load() {
    this.activeSpinner();
    let payload = {
      "TENANT_CODE": 60268037,
    }
    this.CommonService.postCall('TeacherRegistration/GetList', payload).subscribe((res: any) => {
      this.editData = res;

      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })

  }







  close() {
    this.route.navigate(['/HOME/NewTeacher'])
  }


  onEdit(TEACHERREG_ID) {

    this.isEdit = true;

    this.teacherId = TEACHERREG_ID
    let payload = {
      "TEACHERREG_ID": TEACHERREG_ID,
      "TENANT_CODE": 60268037,
    }
    this.CommonService.postCall("TeacherRegistration/Get", payload).subscribe((response: any) => {
      this.editData = response;
      

      // this.districtName = response [0].DISTRICT_ID;
      // this.mandalName = response [0].MANDAL_ID;
      // this.villageName = response [0].VILLAGE_NAME;
      // this.schoolName = response [0].SCHOOL_NAME

      this.dataTransfer()
      
    })

  }
  dataTransfer() {
    let controls = this.myForm.controls;
    // Object.keys(controls).map((key) => {
    //   let ctrl: AbstractControl = controls[key];
    //   ctrl.setValue(this.editData[key])

    // });
    // this.teacherId=this.editData.TEACHERREG_ID;+
   this.districtName=this.editData['DISTRICT_ID']
   this.mandalName=this.editData['MANDAL_ID']
   this.villageName=this.editData['VILLAGE_NAME']
   this.schoolName=this.editData['SCHOOL_NAME']
   this.teacherCode=this.editData['TEACHER_CODE']
   this.aadhaarNo=this.editData['AADHAAR_NUMBER']
   this.teacherName=this.editData['TEACHER_NAME']
    // this.genders=this.editData['GENDER_ID']
   this.dob=this.editData['DOB']
   this.socialCategory=this.editData['SOCIAL_CATEGORY']
   this.natureOfAppointment=this.editData['NATURE_OF_APPOINTMENT']
   this.typeOfTeacher=this.editData['TYPE_OF_TEACHER']
   this.dofAppointment=this.editData['DATE_OF_FIRST_APPOINTMENT']
   this.dojPresentCadre=this.editData['DATE_OF_JOINING_PRESENT_CADRE']
   this.academic=this.editData['ACADEMIC']
   this.professional=this.editData['PROFESSIONAL']
   this.classTaught=this.editData['CLASS_TAUGHT']
   this.appointedSubject=this.editData['APPOINTED_FOR_SUBJECTS']
   this.subjectI=this.editData['SUBJECT1']
   this.subjectII=this.editData['SUBJECT2']
   this.brc=this.editData['BRC']
   this.crc=this.editData['CRC']
   this.diet=this.editData['DIET']
   this.others=this.editData['OTHERS']
   this.trainingNeed=this.editData['TRAINING_NEED']
   this.trainingRecived=this.editData['TRAINING_RECEIVED']
   this.nonTeachingAssignment=this.editData['NON_TEACHING_ASSIGNMENTS']
   this.mathsStudiedUpto=this.editData['MATHS_STUDIED_UPTO']
   this.socialStudiedUpto=this.editData['SOCIAL_STUDIED_UPTO']
   this.englidhStudiedUpto=this.editData['ENGLISH_STUDIED_UPTO']
   this.languageStudiedUpto=this.editData['LANGUAGE_SUBJECTS_STUDIES_UPTO']
   this.scienceStudiedUpto=this.editData['SCIENCE_STUDIED_UPTO']
   this.workingPresentSchool=this.editData['PRESENT_SCHOOL']
   this.disability=this.editData['DISABILITY_TYPE']
   this.trainedInCWSN=this.editData['TEACHING_CWSN']
   this.trainedInComputer=this.editData['TEACHING_THROUGH_COMPUTER']
   this.mobilNumber=this.editData['MOBILENUMBER']
   this.email=this.editData['EMAIL']
   this.tetQualified=this.editData['IS_TET_QUALIFIED']
   this.actingHeadmaster=this.editData['ACTING_AS_HEADMASTERS']
   this.mediumAppointed=this.editData['MEDIUM_UNDER_WHICH_TEACHER_APPOINTED']
   this.religion=this.editData['RELIGION']
   controls['DOB'].setValue(moment(this.editData['DOB']).format('yyyy-MM-DD'));
   controls['DOF_APPOINTMENT'].setValue(moment(this.editData['DATE_OF_FIRST_APPOINTMENT']).format('yyyy-MM-DD'));
   controls['DOJ_PRESENT_CADRE'].setValue(moment(this.editData['DATE_OF_JOINING_PRESENT_CADRE']).format('yyyy-MM-DD'));

    // controls['MANDAL_ID'].setValue(moment(this.editData['MANDAL_ID']));
    // controls['VILLAGE_NAME'].setValue(moment(this.editData['VILLAGE_NAME']));
    // controls['SCHOOL_NAME'].setValue(moment(this.editData['SCHOOL_NAME']));




  }
}
