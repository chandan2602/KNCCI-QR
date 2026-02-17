import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cource-assign-trainer',
  templateUrl: './cource-assign-trainer.component.html',
  styleUrls: ['./cource-assign-trainer.component.css']
})
export class CourceAssignTrainerComponent implements OnInit {


  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any={};
  id:string;
  trainers:Array<any>=[];
  tenantCode=sessionStorage.getItem('TenantCode');
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,active:ActivatedRoute) {
    // this.load();
    active.queryParams.subscribe((res:any)=>{
      if(res.id){
        this.id=res.id;
        this.load();
      }
    })
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      COURSE_TRAINER_DTLS_TRAINER_ID: ['', Validators.required,],
      COURSE_TRAINER_DTLS_STATUS: [1, Validators.required]
    })
    this.setDefault();
    this.getTrainers();
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['COURSE_TRAINER_DTLS_STATUS'].setValue(1)
  }
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
 

  load(){
    this.activeSpinner()
    let  payLoad={
      "COURSE_TRAINER_DTLS_COURSE_ID":this.id,
      "TENANT_CODE":sessionStorage.getItem('TenantCode')
      }    
      this.CommonService.postCall('LoadAssignTrainerByCourseId',payLoad).subscribe((res:any)=>{
         this.table=[];
         setTimeout(()=>{this.table=res},10)
        this.deactivateSpinner()
      },err=>{this.deactivateSpinner()})

  }
  
  getTrainers(){
    let payLoad={
      "TENANT_CODE":this.tenantCode,
       
    }
    this.CommonService.postCall('GetCourseTrainer',payLoad).subscribe(
      (res:any)=>{
        this.trainers=res;
      },err=>{console.log(err)}
    )
  }


  edit(data){
    this.isEdit=true;
    this.editData=data;
    let controls=this.myForm.controls;
    controls['COURSE_TRAINER_DTLS_TRAINER_ID'].setValue(data.COURSE_TRAINER_DTLS_TRAINER_ID);
    controls['COURSE_TRAINER_DTLS_STATUS'].setValue(data.COURSE_TRAINER_DTLS_STATUS?1:0);
  }
  add() {
    this.editData = {};
    this.isEdit = false;
  }
  close() {
    this.myForm.reset();
    this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    this.activeSpinner();
    let payLoad = form.value;
    payLoad['COURSE_TRAINER_DTLS_COURSE_ID'] = this.id;
    payLoad['CREATEDBY']=  payLoad['LASTMDFBY']=sessionStorage.getItem('UserId');
    payLoad['TENANT_CODE']=sessionStorage.getItem('TenantCode')
    if (this.isEdit) {
      payLoad['COURSE_TRAINER_DTLS_ID'] = this.editData['COURSE_TRAINER_DTLS_ID'];
      this.CommonService.postCall('UpdateAssignTrainerByCourseId', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Updated Successfully')
          this.load();
          this.deactivateSpinner();
          document.getElementById('md_close').click()
        }, err => { this.toastr.error(err.Message?err.Message:err); this.deactivateSpinner() })
    } else {
      this.CommonService.postCall('CreateAssignTrainerByCourseId', payLoad).subscribe(
        (res: any) => {
          this.toastr.success('Created Successfully')
          this.load();
          this.deactivateSpinner();
          document.getElementById('md_close').click();
          this.getTrainers();
        }, err => { this.toastr.error(err.Message?err.Message:err); this.deactivateSpinner() })
    }
  }
}

