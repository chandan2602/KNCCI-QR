import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';


@Component({
  selector: 'app-detailed-assessment',
  templateUrl: './detailed-assessment.component.html',
  styleUrls: ['./detailed-assessment.component.css']
})
export class DetailedAssessmentComponent extends BaseComponent implements OnInit {
  aId:any;
  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService,toastr)
   }

  ngOnInit(): void {
  }
  changeTname(){
    this.getCourses()
  }
}
