import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-startexam',
  templateUrl: './startexam.component.html',
  styleUrls: ['./startexam.component.css']
})
export class StartexamComponent implements OnInit {
  time: any;
  assessment: any = {}
  questions: Array<any> = [];
  AssessmentInformation: any = {};
  assementData: any = {};
  count: number = 0;
  isNext: boolean = false;
  isPrev: boolean = true;
  isSubmited: boolean = false;
  answers: Array<any> = [];
  result: any;
  constructor(private CommonService: CommonService, private route: Router, private toastr: ToastrService) {
    this.assessment = CommonService.assessment
    if (!Object.keys(this.assessment).length) {
      route.navigate(['HOME/postassessment']);
    } else {
      this.getAssessment()
    }
  }

  ngOnInit(): void {
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }


  getAssessment() {
    let data: any = {
      AssessmentCourseId: this.assessment.ASSESSMENT_COURSE_ID,
      AssessmentId: this.assessment.ASSESSMENT_ID,
      AssessmentType: 1,
      AssessmentUserId: sessionStorage.getItem('UserId'),
      CourseScheduleId: this.assessment.ASSESSMENT_COURSESECHD_ID,
      ScheduleId: this.assessment.SA_ID,
      TenantCode: sessionStorage.getItem('TenantCode'),
      NoOfQuestions: this.assessment.ASSESSMENT_NO_OF_QUESTIONS
    }
    this.activeSpinner();
    this.CommonService.takeExam(data).subscribe((res: any) => {
      this.deactivateSpinner();
      if (typeof res == 'string') {
        this.toastr.warning(res);
      } else {
        this.assementData = res;
        this.AssessmentInformation = res['AssessmentInformation'][0];
        this.dataTransfer()
      }
    }, (e) => {
      this.deactivateSpinner();
      if (e.error.text == "Your no.of attempts left is 0,please contact Administrator for further assistance") {
        // alert(e.error);
        this.toastr.error(e.error.text);
        this.route.navigate(['HOME/postassessment'])
      }else{
        this.toastr.error(e.error.text);
        this.route.navigate(['HOME/postassessment'])
      }
    })
  }
  dataTransfer() {
    let t = this.AssessmentInformation.ASSESSMENT_TIMINGFORASSESSMENT * 60;
    this.time = t;
    let data: Array<any> = [];
    let questions = this.assementData.AssessmentQuestions;
    let options: Array<any> = this.assementData.AssessmentOptions;
    questions.map((q) => {
      let qId = q.QUESTION_ID;
      let op = options.filter(option => option.QUESTION_ID == qId) || []
      q.options = op;
    })
    this.questions = questions;
    this.questions[0].isShow = true;

  }

  handleEvent(event) {
    if (event.action == "done") {
      this.toastr.info('Time Out');

      setTimeout(() => this.submit(), 200)
    }
  }

  next() {
    this.isPrev = false;
    this.questions[this.count].isShow = false;
    this.count++;
    this.questions[this.count].isShow = true;
    if (this.count == this.questions.length - 1) {
      this.isNext = true
    }
  }
  prev() {
    this.isNext = false
    this.questions[this.count].isShow = false;
    this.count--;
    this.questions[this.count].isShow = true;
    if (!this.count) {
      this.isPrev = true
    }
  }

  submit() {
    this.activeSpinner();
    let data: any = {
      AssessmentId: this.assessment.ASSESSMENT_ID,
      AssessmentType: 1,
      CourseId: this.assessment.ASSESSMENT_COURSE_ID,
      SaId: this.assessment.SA_ID,
      PassPercentage: this.assessment.ASSESSMENT_MINPERCENTAGE,
      AssessmentAnswers: []
    }
    let answers = [];
    this.questions.map((item) => {
      let obj: any = {};
      obj.TypeId = item.TYPEID;
      obj.QuestionAnswer = item.QUESTION_ANSWER
      obj.QuestionId = item.QUESTION_ID;
      obj.QuestionMarks = item.ACTUALMARKS;
      obj.Selected = item.ANSWER_GIVENANSWER || '';
      answers.push(obj)
    })
    data.AssessmentAnswers = answers;
    this.CommonService.setAssessments(data).subscribe((res: any) => {
      this.isSubmited = true;
      this.deactivateSpinner();
      if (Array.isArray(res)) {
        this.result = res[0];
        this.checkAnswers();
      } else {
        this.toastr.success(res.message);
      }
    }, (err) => {
      this.deactivateSpinner();
      this.toastr.error(err.error);
    })
  }

  checkAnswers() {
    let a_id = this.assessment.ASSESSMENT_ID;
    let sa_id = this.assessment.SA_ID
    this.CommonService.checkAnswers(a_id, sa_id).subscribe((res: any) => {
      this.answers = res;
    })
  }
  confirm() {
    var r = confirm("Press 'OK' to End Exam and 'Cancel' to Continue Exam.");
    if (r == true) {
      this.submit()
    } else {

    }
  }
}
