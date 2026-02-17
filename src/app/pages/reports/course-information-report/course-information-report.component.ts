import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-course-information-report',
  templateUrl: './course-information-report.component.html',
  styleUrls: ['./course-information-report.component.css']
})
export class CourseInformationReportComponent extends BaseComponent implements OnInit {
  courseCategories:[]=[];
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
    let payLoad = {
      TENANT_CODE: this.tId==''?this.TenantCode:this.tId||this.TenantCode
    }
    let c =(res)=>{this.courseCategories=res}
    this.post('LoadCourseCategory',payLoad,c)
  }
   submit(){
    this.activeSpinner();
    let tId=this.tId?this.tId:this.TenantCode;
    let payLoad={
      TENANT_CODE:tId,
      COURSE_CATEGORY_ID:this.courseId
    }
    this.CommonService.postCall('RPT_COURSEDETAILS',payLoad).subscribe(
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
