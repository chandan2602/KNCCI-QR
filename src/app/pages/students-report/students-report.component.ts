import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';


@Component({
  selector: 'app-students-report',
  templateUrl: './students-report.component.html',
  styleUrls: ['./students-report.component.css']
})
export class StudentsReportComponent extends BaseComponent implements OnInit {

viewReport : Array<any>=[];
courseId : string;
courseName: string;
courseScheduleId: string;
courseScheduleName: string;
departmentId: string;
departmentName: string;
studentId: string;
studentName: string;

constructor(private commonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private route: Router, toastr: ToastrService) {
  super(commonService,toastr);
  
  active.queryParams.subscribe((res) => {
    console.log(res);
    if ( res.studentId && res.studentName) {
      // this.courseId = res.courseId;
      // this.courseName = res.courseName;
      // this.courseScheduleId = res.courseScheduleId;
      // this.courseScheduleName = res.courseScheduleName;
      // this.departmentId=res.departmentId;
      // this.departmentName=res.departmentName;
      this.studentId=res.studentId;
      this.studentName=res.studentName
      console.log(this.studentId,this.studentName);
    }
  })

}

  ngOnInit(): void {
    this.getViewReport()
    this.loadReportDtOptions();
  }

  loadReportDtOptions() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "excel",
          filename: 'Students Report',
        }
      ],
      order: []
    }
  }

  getViewReport(){
    this.activeSpinner();
    let payLoad = {
      
      "BOOK_STD_STUDENT_ID":this.studentId,
    }
    this.commonService.postCall('LibraryManagement/GetStudentwiseBooks',payLoad).subscribe((res: any) => {
      this.viewReport = res;
      console.log(this.viewReport)
      this.deactivateSpinner();
    }, err => { this.viewReport = []; this.deactivateSpinner() })

  }

  ok(){
    this.activeSpinner();
    this.route.navigate(['/home/assignedBooks']
    );
    this.deactivateSpinner();
  }

}
