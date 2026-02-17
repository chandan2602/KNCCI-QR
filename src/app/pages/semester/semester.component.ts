import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css']
})
export class SemesterComponent implements OnInit {
 
  id : string;
  table : Array<any> = [];
  myForm : UntypedFormGroup;
  isEdit :boolean=null;
  editData : any={};
  courses : Array<any>=[];
  shedules : Array<any>=[];
  assignData : any={};
  points:Array<any>=[]
  courseName :  string='';
  semesterName : string='';
  Status:boolean;

  Course_Id: Array<any> = [];
  Sem_Id:string='';
  Create_Date:string='';
  Created_By:string='';
  Modify_Date:string='';
  Modified_By:string='';




  constructor( private fb: UntypedFormBuilder, private CommonService: CommonService,private toastr: ToastrService) { 
    this.load();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({

      COURSE_ID: ['', Validators.required,],
      SEMISTER_NAME: ['',Validators.required],
      Status: [1, Validators.required,],
    
      courseName:[''],
      semesterName:['']
    });
    this.loadChapterCourse();
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  load() {
    this.activeSpinner()
    let payLoad={
      "Tenant_Code":71258324
    }
    this.CommonService.postCall("Semester/GetList",payLoad).subscribe((res:any)=>{
      this.table=[];
      this.table = res;
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
  edit(Sem_Id) {
    this.Sem_Id=Sem_Id;
    this.isEdit=true;
    this.dataTransfer()
    let payload = {
      "Sem_Id": Sem_Id,
      "Tenant_Code": 71258324,
    
    }
    this.CommonService.postCall("Semester/Get",payload).subscribe((res:any)=>{
     this.editData = res;
     this.dataTransfer();

  })
}

  dataTransfer() {
    let controls = this.myForm.controls;

    this.courseName=this.editData['Course_Id'],
    this.semesterName=this.editData['Semister_Name'],
    this.Status=this.editData['Status']
  
  }
  

  
  onSubmit(form:UntypedFormGroup){
    let payload = {
      "COURSE_ID": this.courseName,
      "SEMISTER_NAME":this.semesterName,
       "Status":this.Status,
      "Created_By": 99796795,
      "Modified_By": 99796795,
      "Tenant_Code":71258324,
      }
      
    this.activeSpinner();
    if (this.isEdit) {
      payload['Sem_Id'] = this.editData.Sem_Id;
      this.CommonService.postCall("Semester/Update", payload).subscribe((response: any) => {
        this.editData = response;
        this.toastr.success("Semester Updated Successfully")
        this.load();
        this.deactivateSpinner();
      
        this.semesterName='';
        this.courseName='';
         this.Status;

        document.getElementById('md_close').click()
      }, err => {
        this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'Semester not Updated')
      });
    }
    else {
      this.CommonService.postCall("Semester/Create", payload).subscribe((response: any) => {
        this.editData = response;
        this.toastr.success("Semester Created Successfully")
        this.load();
        this.deactivateSpinner();

        this.semesterName='';
        this.courseName='';
         this.Status;
        

        document.getElementById('md_close').click()
      }, err => {
        this.deactivateSpinner(); this.toastr.error(err.error ? err.error : 'Semester not Created')
      });
    }



  }


 



}
