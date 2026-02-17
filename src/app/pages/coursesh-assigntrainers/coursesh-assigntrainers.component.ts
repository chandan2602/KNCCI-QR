import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-coursesh-assigntrainers',
  templateUrl: './coursesh-assigntrainers.component.html',
  styleUrls: ['./coursesh-assigntrainers.component.css']
})
export class CourseshAssigntrainersComponent implements OnInit {
  table:Array<any>=[];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any={}
  courseSh_id:string;
  courseId:string;
  trainers:Array<any>=[];
  defaultData:any={};
  tenantCode=sessionStorage.getItem('TenantCode');
  primeryKey: any;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,active:ActivatedRoute) {
    active.queryParams.subscribe((res:any)=>{
      if(res.csId){
        this.courseSh_id=res.csId;
        this.loadTrainer();
        this.getFormData();
      }if(res.cId){
        this.courseId=res.cId;
        this.getTrainers();
      }
    })
   }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      COURSE_TRAINER_TRAINER_ID: ['', Validators.required,],
      COURSE_TRAINER_STARTDATE:['',Validators.required],
      COURSE_TRAINER_ENDDATE:['',Validators.required],
      COURSE_TRAINER_STARTTIME:['',Validators.required],
      COURSE_TRAINER_ENDTIME:['',Validators.required],
      COURSE_TRAINER_NO_OF_CLASSES:['',Validators.required],
      COURSE_TRAINER_STATUS: [1, Validators.required]
    })
    // this.setDefault()
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    // ctrl['ANT_STATUS'].setValue(1)
    let data=this.defaultData;
    ctrl['COURSE_TRAINER_STARTDATE'].setValue(moment(data.COURSESHD_STARTDATE).format('yyyy-MM-DD'));
    ctrl['COURSE_TRAINER_ENDDATE'].setValue(moment(data.COURSESHD_ENDDATE).format('yyyy-MM-DD'));
    ctrl['COURSE_TRAINER_STARTTIME'].setValue(moment(data['COURSESHD_STARTTIME']).format('HH:mm:ss'))
    ctrl['COURSE_TRAINER_ENDTIME'].setValue(moment(data['COURSESHD_ENDTIME']).format('HH:mm:ss'))
    ctrl['COURSE_TRAINER_STATUS'].setValue(data.COURSESHD_STATUS ? 1 : 0);
    ctrl['COURSE_TRAINER_NO_OF_CLASSES'].setValue(data.COURSESHD_NOOFDAYS)
  }
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
  loadTrainer(){

    this.activeSpinner();
    this.CommonService.postCall('LoadAssignTrainers',{COURSE_TRAINER_COURSESHD_ID:this.courseSh_id}).subscribe(
      (res:any)=>{
        this.table=[];
        setTimeout(()=>{this.table=res},10)
        this.deactivateSpinner()
      },err=>{this.deactivateSpinner()})
  }

   
  getTrainers(){
    let payLoad={
      "TENANT_CODE":this.tenantCode,
       "COURSE_TRAINER_DTLS_COURSE_ID":this.courseId,
        "COURSE_TRAINER_DTLS_STATUS":"true"
    }
    this.CommonService.postCall('GetTrainers',payLoad).subscribe(
      (res:any)=>{
        this.trainers=res;
      },err=>{console.log(err)}
    )
  }

  getFormData(){
    let payload = {
      "TENANT_CODE": this.tenantCode,
      "COURSESHD_ID": this.courseSh_id
    }
    this.CommonService.postCall('EditCourseScheduleBatchPlan', payload).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.defaultData = res[0];
      } else {
        this.defaultData = res['dtCourseScehdule'][0]||res['dtCourseScehdule'];
      }
      // this.deactivateSpinner();
      // this.dataTransfer();
      this.setDefault()
    }, err => { 
      // this.deactivateSpinner();
     }
    )
  }

  add() {
    this.editData = {};
    this.isEdit = false;
  }
  edit(data){
    this.isEdit=true;
    this.activeSpinner()
  this.primeryKey=data.COURSE_TRAINER_ID
    // COURSE_TRAINER_ID
    this.CommonService.postCall('EditAssignTrainers',{COURSE_TRAINER_ID:this.primeryKey}).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
      } else {
        this.editData = res;
      }
      this.deactivateSpinner();
      this.dataTransfer();
      // this.setDefault()
    }, err => { 
      this.deactivateSpinner();
     }
    )
  }
  dataTransfer(){
    let data=this.editData;
    let ctrl=this.myForm.controls
    ctrl['COURSE_TRAINER_TRAINER_ID'].setValue(data['COURSE_TRAINER_TRAINER_ID'])
    ctrl['COURSE_TRAINER_STARTDATE'].setValue(moment(data.COURSE_TRAINER_STARTDATE).format('yyyy-MM-DD'));
    ctrl['COURSE_TRAINER_ENDDATE'].setValue(moment(data.COURSE_TRAINER_ENDDATE).format('yyyy-MM-DD'));
    ctrl['COURSE_TRAINER_STARTTIME'].setValue(moment(data['COURSE_TRAINER_STARTTIME']).format('HH:mm:ss'))
    ctrl['COURSE_TRAINER_ENDTIME'].setValue(moment(data['COURSE_TRAINER_ENDTIME']).format('HH:mm:ss'))
    ctrl['COURSE_TRAINER_STATUS'].setValue(data.COURSE_TRAINER_STATUS ? 1 : 0);
    ctrl['COURSE_TRAINER_NO_OF_CLASSES'].setValue(data.COURSE_TRAINER_NO_OF_CLASSES)
  }

  close() {
    this.myForm.reset();
    this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    let payLoad=this.myForm.getRawValue();
    this.activeSpinner();
    payLoad['COURSE_TRAINER_COURSESHD_ID']=this.courseSh_id;
    payLoad['CREATEDBY']=sessionStorage.getItem('UserId');
    payLoad['LASTMDFBY']=sessionStorage.getItem('UserId');
    payLoad['TENANT_CODE']=this.tenantCode;
    payLoad['COURSE_TRAINER_STATUS']=parseInt(payLoad['COURSE_TRAINER_STATUS'])
    if(this.isEdit){
      payLoad['COURSE_TRAINER_ID']=this.primeryKey;
      this.CommonService.postCall('UpdateAssignTrainers',payLoad).subscribe((res)=>{
        this.deactivateSpinner();
        this.loadTrainer();
        this.toastr.success("Information updated Successfully");
        document.getElementById('md_close').click();
      },err=>{this.toastr.error(err.message?err.message:err);this.deactivateSpinner()})
    }else{
      this.CommonService.postCall('CreateAssignTrainers',payLoad).subscribe((res)=>{
        this.deactivateSpinner();
        this.loadTrainer();
        this.toastr.success("Information saved Successfully");
        document.getElementById('md_close').click();
      },err=>{this.toastr.error(err.message?err.message:err);this.deactivateSpinner()})
    }
  }

}
