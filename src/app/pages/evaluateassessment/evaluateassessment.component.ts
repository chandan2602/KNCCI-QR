import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-evaluateassessment',
  templateUrl: './evaluateassessment.component.html',
  styleUrls: ['./evaluateassessment.component.css']
})
export class EvaluateassessmentComponent implements OnInit {

  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = [];
  data: any = {}
  assessments: Array<any> = [];
  assessmentId: string = ''
  date: any;
  times: Array<any> = [];
  users: Array<any> = [];
  time: any;
  userId: string = '';
  table: Array<any> = []
  constructor(private CommonService: CommonService, private toastr: ToastrService) {
    this.getCourses()
  }

  ngOnInit(): void {
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getCourses() {
    this.activeSpinner();
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    }, e => { this.deactivateSpinner(); })
  }

  courceChange() {
    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner();
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.scheduls = res;
    }, e => { this.deactivateSpinner(); })
  }
  schedulChange() {
    this.activeSpinner();
    this.CommonService.loadAssessmentDropdown(this.courceId, this.schedulId).subscribe((res: any) => {
      this.deactivateSpinner();
      this.assessments = res;
    }, e => { this.deactivateSpinner(); })
  }
  dateChange() {
    this.userId = '';
    this.time = '';
    this.activeSpinner()
    let data = {
      "CourseId": this.courceId,
      "AssessmentId": this.assessmentId,
      "AssessmentDate": this.date
    }
    this.CommonService.getAssessmentTime(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.times = res;
    }, e => { this.deactivateSpinner(); })
  }

  changeTime() {
    this.userId = '';
    this.users = [];
    this.activeSpinner();
    let data = {
      "CourseId": this.courceId,
      "AssessmentId": this.assessmentId,
      "AssessmentDate": this.date,
      AssessmentTime: this.time
    }
    this.CommonService.getAssessmentUsers(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.users = res;
    }, e => { this.deactivateSpinner(); })
  }
  userChange() {
    this.activeSpinner()
    let data = {
      "CourseId": this.courceId,
      "AssessmentId": this.assessmentId,
      "AssessmentDate": this.date,
      AssessmentTime: this.time,
      UserId: this.userId
    }
    this.CommonService.getAssessmentAnswers(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.table = res;
    }, (e) => { this.deactivateSpinner(); })
  }
  marksChange(item) {
    if (item.Marks > item.ANSWER_ACTUALMARKS) {
      // alert("Marks not more than Max Marks");
      this.toastr.warning("Marks not more than Max Marks")
      item.Marks = null;
    }
  }
  submit() {
    let data = {
      SaId: this.time,
      UserId: this.userId,
      AssessmentId: this.assessmentId,
      Answers: []

    }
    let array = [];
    let valid = true;
    for (let i in this.table) {
      let item = this.table[i];
      if (item.Answer == undefined) {
        // alert("Please Enter the Result");
        this.toastr.warning("Please Enter the Result");
        valid = false;
        break;
      }
      if (!item.Marks) {
        // alert("Please Enter the Marks");
        this.toastr.warning("Please Enter the Marks");
        valid = false;
        break;
      }

      let obj = {
        AnswerId: item.ANSWER_ID,
        Answer: item.Answer,
        Marks: item.Marks
      }
      array.push(obj)
    }
    if (valid) {
      this.activeSpinner();
      data.Answers = array;
      this.CommonService.setEvaluateAssessments(data).subscribe((res) => {
        // alert("Information Saved Successfull");
        this.deactivateSpinner();
        this.toastr.success('Information Saved Successfull')
        setTimeout(() => location.reload(), 100)
      }, e => { this.deactivateSpinner(); })
    }
  }

}
