import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-attendance-details-report',
  templateUrl: './attendance-details-report.component.html',
  styleUrls: ['./attendance-details-report.component.css']
})
export class AttendanceDetailsReportComponent extends BaseComponent implements OnInit {
  sDate:Date;
  eDate:Date;
 
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
      COURSE_SCHEDULE_ID:this.scheduleId,
      STARTDATE:this.sDate,
      ENDDATE:this.eDate
    }
    this.CommonService.postCall('RPT_DLC_STUDENT_ATTENDANCE',payLoad).subscribe(
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
