import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-online-courses-details-report',
  templateUrl: './online-courses-details-report.component.html',
  styleUrls: ['./online-courses-details-report.component.css']
})
export class OnlineCoursesDetailsReportComponent extends BaseComponent implements OnInit {
  mId:string='-1';
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
    this.courseId='';
    this.getCourses()
  }
  submit(){
    this.activeSpinner();
    let tId=this.tId?this.tId:this.TenantCode;
    let payLoad={
      TENANT_CODE:tId,
      COURSE_ID:this.courseId,

    }
    return
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
