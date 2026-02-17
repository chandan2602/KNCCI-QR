import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-online-courses-report',
  templateUrl: './online-courses-report.component.html',
  styleUrls: ['./online-courses-report.component.css']
})
export class OnlineCoursesReportComponent extends BaseComponent implements OnInit {

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr)
    if(this.roleId!='4'){
       this.changeTname();
    }
   }

  ngOnInit(): void {
    this.loadReportDtOptions();
  }
  changeTname(){
    this.getCourses()
  }
  submit(){
    
    if(this.roleId=='4'){
      if(this.tId==''){
        this.courseId='';
        this.toastr.warning('Please Select Mandatory Fileds');
        return
      }
    }
    if(this.courseId==''){
      this.toastr.warning('Please Select Course');
      return
    }
    this.activeSpinner();
    let tId=this.tId?this.tId:this.TenantCode;
    let payLoad={
      TENANT_CODE:tId,
      COURSE_ID:this.courseId
    }
    this.CommonService.postCall('OnlineCoursesReport',payLoad).subscribe(
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
