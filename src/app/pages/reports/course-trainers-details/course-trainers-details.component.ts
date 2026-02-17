import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-course-trainers-details',
  templateUrl: './course-trainers-details.component.html',
  styleUrls: ['./course-trainers-details.component.css']
})
export class CourseTrainersDetailsComponent extends BaseComponent implements OnInit {

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr)
    if(this.roleId!='4'){
       this.getCourses();
    }
   }

  ngOnInit(): void {
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
      COURSE_ID:this.courseId
    }
    this.CommonService.postCall('RPT_COURSETRAINERSDETAILS',payLoad).subscribe(
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
