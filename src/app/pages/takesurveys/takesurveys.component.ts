import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PolsService } from 'src/app/services/pols.service';
import { Location, } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-takesurveys',
  templateUrl: './takesurveys.component.html',
  styleUrls: ['./takesurveys.component.css']
})
export class TakesurveysComponent implements OnInit {
  surveyQuestions: any = {};
  Description: any = {};
  start: boolean = false;
  isComplete:boolean=false
  questions: any = {
    fbd5afa6: {
      data: {},
      questions: {},
      isEnable: false
    },
    dd57541d: {
      data: {},
      questions: {},
      isEnable: false
    },
    '39080bf1': {
      data: {},
      questions: {},
      isEnable: false
    },
    '797537f0': {
      data: {},
      questions: {},
      isEnable: false
    },


  }
  constructor(private active: ActivatedRoute, private pollService: PolsService, private route: Router, private location: Location,private toastr: ToastrService,private CommonService: CommonService) {
    active.queryParams.subscribe((params) => {
      if (params.id) {
        this.getQuestions(params.id)
      }
    })
  }

  ngOnInit(): void {
  }

  getQuestions(id) {
    this.CommonService.activateSpinner();
    this.pollService.getSurveyQuestions(id).subscribe((res: any) => {
      this.CommonService.deactivateSpinner();
      this.surveyQuestions = res;
      this.Description = res.Table[0];
      this.dataTransform()
    }, (err) =>{this.CommonService.deactivateSpinner(); })
  }

  back() {
    this.location.back()
  }
  begin() {
    this.start = true;
  }

  dataTransform() {

    let qOptions = this.surveyQuestions.Table2;
    let qObj = {}
    qOptions.map((data => {
      let qId = data.QuestionId;
      if (qObj[qId]) {
        let qGroup = qObj[qId];
        qGroup.array.push(data)
      } else {
        qObj[qId] = {
          array: []
        }
        qObj[qId].array.push(data)

      }
    }))
    let qTable = this.surveyQuestions.Table1;
    qTable.map((data) => {
      let key = data.QuesType;
      let qId = data.QuestionId
      let type = this.questions[key];
      type.isEnable = true;
      let array = []
      if (qObj[qId]) {
        array = qObj[qId].array;
      }
      let answer;
      if (key == "39080bf1") {
        answer = []
      }
      type.questions[qId] = {
        data: data,
        array: array,
        answer: answer
      }
    })
  }

  getKeys(data) {
    return Object.keys(data)
  }
  getQuestionsData(key, type) {
    let data = this.questions[type].questions[key].array
    return data
  }
  // fbd5afa6,dd57541d,39080bf1,797537f0
  save() {
    let valid = true;;
    let table = this.surveyQuestions.Table1;
    table = table.filter((data) => { return data.IsMandatory })
    table.map((data) => {
      let type = data.QuesType;
      let id = data.QuestionId
      let question = this.questions[type].questions[id];
      if (type == '39080bf1') {
        let array = question.answer;
        array = array.filter(data => { return data })
        if (!array.length) {
          valid = false;
        }
      } else {
        let ans = question.answer;
        if (!ans ) {
          valid = false;
        }
        else{
          if(typeof ans=='string'&& !ans.trim()){
            valid=false;
          }
        }
      }

    })
    if (valid) {
      let data = {
        SurveyId: this.Description.SurveyId,
        ServeyOptions: []
      }
      let questions = this.surveyQuestions.Table1;
      questions.map((item) => {
        let type = item.QuesType;
        let id = item.QuestionId;
        let q = this.questions[type].questions[id];
        if (type == '39080bf1') {
          let a = q.answer;
          a.filter(data => { return data });
          if (a.filter(data => { return data }).length) {
            a.map((state, index) => {
              if (state) {
                let value = q.array[index];
                let obj = {
                  QuestionId: value.QuestionId,
                  OptionId: value.OptionId,
                  answerText: ""
                }

                data.ServeyOptions.push(obj)
              }
            })
          }
        }
        else {
          let ans = q.answer;
          if (ans) {
            let obj = {
              questionId: id,
              optionId: (type == '797537f0') ? 0 : ans,
              answerText: (type == '797537f0') ? ans : ''
            }
            data.ServeyOptions.push(obj)
          }
        }
      })
      this.pollService.setSurveys(data).subscribe((res)=>{
        this.start=false;
        this.isComplete=true;
      },(e)=>{})

    } else {
      // alert("Please answer the mandatory questions ");
      this.toastr.warning('Please answer the mandatory questions')
    }

  }
}
