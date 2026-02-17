import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

 
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit:boolean=null;
  editData: any={};
  courses:Array<any>=[];
  shedules:Array<any>=[];
  assignData: any={};
  points:Array<any>=[]
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService,private toastr: ToastrService) {
    this.loadSubjects();
   }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      COURSE_ID: ['', Validators.required,],
      SUBJECT_NAME: ['', Validators.required],
      SubjectStatus: [1, Validators.required,],
      CREDITS:['',[Validators.required,Validators.max(20)]],
      SUBJECT_DESCRIPTION: ['', Validators.required],
    });
    this.loadChapterCourse();
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  loadSubjects() {
    this.activeSpinner()
    let payLoad={
      TNT_CODE:sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall("LoadSubjects",payLoad).subscribe((res:any)=>{
      this.table=[];
      setTimeout(()=>{
        this.table = res;
      },10)
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner(),console.log(e)})
  }

  loadChapterCourse(){
    this.activeSpinner()
    let payLoad={
      TENANT_CODE:sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall("LoadChapterCourse",payLoad).subscribe((res:any)=>{
      this.courses=res;
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner()});
  }

  close() {
   this.isEdit=null;
   this.myForm.reset();
   this.editData={};
  }
  edit(data) {
    this.editData=data;
    this.isEdit=true;
    this.dataTransForm()
    // this.CommonService.postCall("EditSubjects",this.editData).subscribe((res:any)=>{
    //   if(res.length){
    //     this.editData=res[0];
      
    //     this.dataTransForm();
    //   }
    //   this.deactivateSpinner();
    // },e=>{this.deactivateSpinner()});
      
  }
  dataTransForm(){
    let ctrls=this.myForm.controls
    Object.keys(ctrls).map((key)=>{
      let ctrl=ctrls[key];
      if(key=='SubjectStatus'){
      ctrl.setValue(this.editData['SUBJECT_STATUS']?1:0)
      }else{
      ctrl.setValue(this.editData[key]);
      }
    });
  }
  onSubmit(form:UntypedFormGroup){
     let payload= Object.assign({},form.value);
     payload.TNT_CODE=sessionStorage.getItem('TenantCode');
     payload.SUBJECT_CREATEDBY=this.editData.SUBJECT_CREATEDBY||sessionStorage.getItem('UserId');
     payload.SUBJECT_CREATEDDATE=this.editData.SUBJECT_CREATEDDATE||moment();
     payload.SUBJECT_MODIFIEDBY=sessionStorage.getItem('UserId');
     payload.SUBJECT_MODIFIEDDATE=moment()
     payload.SUBJECT_STATUS=payload.SubjectStatus;
     this.activeSpinner();
     if(this.isEdit){
       payload.SUBJECT_ID=this.editData.SUBJECT_ID;
       this.CommonService.postCall("UpdateSubjects",payload).subscribe((res:any)=>{
        this.toastr.success("Subject updated Successfully")
        this.loadSubjects();
        this.deactivateSpinner();
        document.getElementById('md_close').click()
      },err=>{this.deactivateSpinner();this.toastr.error(err.error?err.error:'Subject not updated')});
     }else{
      payload.CHAPTER_ID=this.editData.CHAPTER_ID;
      this.CommonService.postCall("CreateSubjects",payload).subscribe((res:any)=>{
       this.toastr.success("Subject  Created Successfully")
       this.loadSubjects();
       this.deactivateSpinner();
       document.getElementById('md_close').click()
     },err=>{
       this.deactivateSpinner();this.toastr.error(err.error?err.error:'Subject not Created')
      });
     }
     
     
  }

  assign(data){
    this.activeSpinner();
    this.points=[];
    this.assignData={};
    let payload={
      CHAPTER_ID:data.CHAPTER_ID
    }
    this.CommonService.postCall("assignPO_COViewChapters",payload).subscribe((res:any)=>{
   
      if(res.dt){
        this.assignData=res['dt'][0]
      }
      if(res.grid){
        this.points=res.grid
      }
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner();});
  }
  
 


}
