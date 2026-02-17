import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent implements OnInit {

  table: Array<any> = [];
  courceId: string;
  schedulId: string;
  scheduls: Array<any> = [];
  cources: Array<any> = [];
  isParam: boolean = false;
  yearId: string;
  years: Array<any>=[]
  constructor(private CommonService: CommonService, private toastr: ToastrService) {
    this.loadcourses();
    this.getYear();
  }

  ngOnInit(): void {

  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  loadcourses() {
    // LoadCourseSchedule
    // Loadyear Loadcourses
    this.activeSpinner()
    let payaload = {
      "TENANT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.CommonService.getAdminCourses().subscribe((res:any)=>{
      this.cources=res;
      this.deactivateSpinner();
    },e=>this.deactivateSpinner());
  }

  courceChange() {
   let payload={
    CourseId:this.courceId
   }
   this.activeSpinner()
   this.CommonService.getAdminCourseSchedule(payload).subscribe((res:any)=>{
    this.scheduls=res;
    this.deactivateSpinner();
  },e=>this.deactivateSpinner());

  }
  getYear() {
    this.activeSpinner()
    let payload={
     

     }
     this.CommonService.postCall('Loadyear',payload).subscribe((res:any)=>{
      this.years=res;
      this.deactivateSpinner();
    },e=>this.deactivateSpinner());
  }
  schedulChange(){}
  yearChange() {
    this.activeSpinner();
    let payLoad={
      "TENANT_CODE": sessionStorage.getItem('TenantCode'),
      "STUDENT_PAYMENT_COURSESHD_ID":this.schedulId,
      "COURSE_ID":this.courceId,
      "STUDENT_PAYMENT_CORPORATEID":this.yearId
    };
    this.CommonService.postCall('loadstudents',payLoad).subscribe((res)=>{
      this.deactivateSpinner();
      this.table=[];
      setTimeout(()=>{
        this.table = res;
      },10)
    },e=>{this.deactivateSpinner()})

  }

 enroll(){
   let array=this.table.filter((data)=>{return data.Paymentstatus});
  if(!array.length) return
  this.activeSpinner();
   let payLoad=[];
   array.map((data)=>{
     let object:any={
      "CourseId":this.courceId,
      "CREATEDBY":sessionStorage.getItem('UserId'),
      "TNT_CODE":sessionStorage.getItem('TenantCode'),
      "UserId":data.UserId,
      "CourseScheduleId":this.schedulId,
      "ModifiedBy":sessionStorage.getItem('UserId')
     }
  
     payLoad.push(object)
   });
   this.CommonService.postCall('CreateEnroll',payLoad).subscribe((res)=>{
    this.deactivateSpinner();
    this.toastr.success('Enroll created Successfully')
   },e=>{this.deactivateSpinner()})
 }



}
