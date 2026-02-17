import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-addsurveyquestion',
  templateUrl: './addsurveyquestion.component.html',
  styleUrls: ['./addsurveyquestion.component.css']
})
export class AddsurveyquestionComponent implements OnInit {
 
  table: Array<any> = [];
  surveyId: string;
  myForm: UntypedFormGroup;
  qId: string = 'fbd5afa6';
  isEdit: Boolean = false;
  QUESTION_ID: any;
  constructor(active: ActivatedRoute, private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    active.queryParams.subscribe((res) => {
      if (res.id) {
        this.surveyId = res.id;
        this.getSurvey()
      }
    })
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      QUESTION: ['', Validators.required,],
      isMandatory: [false,Validators.nullValidator],
      formArray: this.fb.array([])
    })
    this.addOptionsDef()

  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getOptionGroup(value='') {
    let newGroup = this.fb.group({
      option: [value, [Validators.required]],

    });
    return newGroup
  }

  selectType(id, method) {
    if (this.qId == id) return
    this.myForm.reset();
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let length = arrayControl.length
    let fn = (len: number) => {
      for (let i = len - 1; i > -1; i--) {
        arrayControl.removeAt(i);
      }
    }
    this[method](fn, length)
    this.qId = id;

  }

  first(fn, length) {
    if (length > 2) {
      fn(length - 2)
    }
    if (!length) {
      this.addOptionsDef();
    }
  }
  secound(fn, length) {
    fn(length)
  }

  addOptionsDef() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    for (let i in [1, 2]) {
      let grp: UntypedFormGroup = this.getOptionGroup()
      arrayControl.push(grp)
    }
  }

  add() {
    // $("#myModal").modal('show');
   
    this.qId = 'fbd5afa6'
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let length = arrayControl.length;
    if (!length) {
      this.addOptionsDef();
    } if (length > 2) {
      for (let i = length - 3; i > -1; i--) {
        arrayControl.removeAt(i);
      }
    }
    let ctrls=this.myForm.controls;
    ctrls['isMandatory'].setValue(false);
  

  }
  edit(data) {
    this.activeSpinner();
    this.isEdit = true;
    this.QUESTION_ID = data.QuestionId;
    this.qId=data.DictionaryCode;
    this.CommonService.postCall('EditSurveyQuestionnaire', {QUESTION_ID:this.QUESTION_ID}).subscribe((res) => {
    this.setData(res);
      this.deactivateSpinner()
    })

  }

   setData(data){
       let table=data.dtpoll[0];
       let table1:Array<any>=data.dtpoll1||[]
       let ctrls=this.myForm.controls;
       ctrls['QUESTION'].setValue(table.SurveyQuestion);
       ctrls['isMandatory'].setValue(table.IsMandatory);
       const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
      //  ctrls['formArray']= this.fb.array([]);
      
       table1.map((data,index)=>{
         let ctrl=arrayControl.controls[index]&&arrayControl.controls[index]['controls']['option'];
         if(ctrl){
         ctrl.setValue(data.OptionText)
         }else{
          let value=data.OptionText;
          this.addQuestion(value)
         }
      
       })
       this.myForm.updateValueAndValidity()
       

   }


  delete(data) {
    let payload = {
      QUESTION_ID: data.QuestionId
    }
    let c = confirm('Are you sure, you want to delete record?');
    if (c) {
      this.CommonService.postCall('deleteSurveyQuestionnaire', payload).subscribe((res) => {
        this.toastr.success("SurveyQuestionnaire deleted Successfully");
        this.getSurvey()
      }, err => { })
    }

  }

  getSurvey() {
    let params = {
      SURVEY_ID: this.surveyId
    }
    this.CommonService.postCall("loadSurveyQuestionnaire", params).subscribe((res: any) => {
     if(res instanceof Array){
       this.table=res;
     }
     else{
      
      this.table = res.Table;
     
    }
  
    }, err => { console.log(err) })

  }

  addQuestion(value='') {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let grp: UntypedFormGroup = this.getOptionGroup(value)
    arrayControl.push(grp)
  }
  deleteQuestion() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let index = arrayControl.length;
    arrayControl.removeAt(index - 1)
  }

  onSubmit(form: UntypedFormGroup) {

    let data = form.value;
    let payaload: any = {};
    payaload.QUESTION = data.QUESTION;
    payaload.IS_MANDATORY = data.isMandatory;
    if(data.isMandatory==''){
      payaload.IS_MANDATORY =false;
    }
    for (let i in data.formArray) {
      let index = parseInt(i) + 1
      let key = 'QUESTION_OPTION' + index
      payaload[key] = data.formArray[i].option;
    }
    payaload.CREATEDBY = sessionStorage.getItem('UserId');
    payaload.LASTMDFBY = payaload.CREATEDBY;
   // payaload.LASTMDFDATE = moment(new Date()).format('DD-MM-yyyy')
    payaload.SURVEY_ID = this.surveyId;
    payaload.QUESTION_TYPE = this.qId;
    this.activeSpinner()
    if (this.isEdit) {
      payaload.QUESTION_ID = this.QUESTION_ID||null;
      this.CommonService.postCall('UpdateSurveyQuestionnaire', payaload).subscribe((res: any) => {
        this.toastr.success("Survey Questionnaire Updated Successfully");
        this.deactivateSpinner();
        this.getSurvey();
        document.getElementById('md_close').click()
      }, err => { this.toastr.error(err.error?err.error:" SurveyQuestionnaire Not Updated ");this.deactivateSpinner() })
    } else {
      this.CommonService.postCall('CreateSurveyQuestionnaire', payaload).subscribe((res: any) => {
        this.toastr.success("Survey Questionnaire Created Successfully");
        this.deactivateSpinner()
        this.getSurvey();
        document.getElementById('md_close').click()
      }, err => { 
        this.toastr.error(err.error?err.error:" SurveyQuestionnaire not created ");
        this.deactivateSpinner();
      })
    }
  }
  close() {
    this.myForm.reset();
    this.myForm.updateValueAndValidity()
    this.QUESTION_ID=null;
    this.isEdit=false;
  }
}
