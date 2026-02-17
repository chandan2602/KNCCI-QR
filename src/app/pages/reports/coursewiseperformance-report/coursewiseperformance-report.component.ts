import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-coursewiseperformance-report',
  templateUrl: './coursewiseperformance-report.component.html',
  styleUrls: ['./coursewiseperformance-report.component.css']
})
export class CoursewiseperformanceReportComponent extends BaseComponent implements OnInit {

 
  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr);
    if(this.roleId!='4'){
      this.changeTname();
    }
   }

  ngOnInit(): void {
  }
  changeTname(){
    this.getCourses()
  }
  changeCourse(){
    //this.courseChange()
  }


}
