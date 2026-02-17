import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';


@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css']
})
export class StudentInformationComponent extends BaseComponent implements OnInit {

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr);
    if(this.roleId!='4'){
      this.changeTname();
    }
   }

  ngOnInit(): void {
    this.loadReportDtOptions();
  }
  changeTname(){
    this.courseId='';
    this.scheduleId='';
    this.getCourses()
  }
  changeCourse(){
    this.scheduleId='';
    this.courseChange()
  }
  submit(){
    this.activeSpinner();
    let tId=this.tId?this.tId:this.TenantCode;
    let payLoad={
      TENANT_CODE:tId,
      COURSE_ID:this.courseId,
      COURSE_SCHEDULE_ID:this.scheduleId
    }
    this.CommonService.postCall('RPT_STUDENT_INFORMATION',payLoad).subscribe(
      (res)=>{
        this.deactivateSpinner();
        this.renderDataTable();
        this.table=res;
      },err=>{
        this.deactivateSpinner();
      }
    )
  }
}
