import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, } from '@angular/forms'
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { combineAll } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { group } from '@angular/animations';
@Component({
  selector: 'app-feedbackquestionaire',
  templateUrl: './feedbackquestionaire.component.html',
  styleUrls: ['./feedbackquestionaire.component.css']
})
export class FeedbackquestionaireComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr)
    this.loadFeesback();
    this.getTennates()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      FEEDBACK_QUES: ['', Validators.required,],
      QUESTION_STATUS: [true, Validators.required],
      formArray: this.fb.array([])
    })

    
  }

  addDefaultControlOptions() {
    for (let i in [1, 2]) {
      this.addControl();
    }
  }

  deleteDefaultControlOptions() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let index = arrayControl.length;
    for (let i=0;i<index;i++ ) {
      this.deleteControl();
    }
  }


  loadFeesback() {
    this.activeSpinner();
    let payload = {
      "TENANT_CODE": this.tId || this.TenantCode
    }
    this.CommonService.postCall('loadFeedbackQuestionnaire', payload).subscribe((res: any) => {
      this.table = [];
      this.table = res;
      this.renderDataTable();
      this.deactivateSpinner()
    }, err => { this.deactivateSpinner() })
  }

  getOptionGroup(value='') {
    let newGroup = this.fb.group({
      option: [value, [Validators.required]],

    });
    return newGroup
  }

  add() {
    this.editData = {};
    this.isEdit = false;
    this.myForm.reset();
    this.addDefaultControlOptions();
  }
  addControl(value?) {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let grp: UntypedFormGroup = this.getOptionGroup(value)
    arrayControl.push(grp)
  }
  deleteControl() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let index = arrayControl.length;
    arrayControl.removeAt(index - 1);
  }
  isVisable() {
    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl && arrayControl.controls.length > 2) {
      return true
    }
    else {
      return false
    }
  }

  onSubmit(form: UntypedFormGroup) {
    let data = form.value;
    let payload: any = {};
    payload.FEEDBACK_QUES = data.FEEDBACK_QUES;
    payload.QUESTION_STATUS = data.QUESTION_STATUS;
    payload.CREATEDBY = this.editData.CREATEDBY || this.userId;
    payload.LASTMDFBY = this.userId;
    payload.TENANT_CODE = this.TenantCode
    payload.CREATEDDATE = this.editData.CREATEDDATE || moment(new Date());
    payload.LASTMDFDATE = moment(new Date());
    for (let i in data.formArray) {
      let index = parseInt(i) + 1
      let key = 'QUESTION_OPTION' + index
      payload[key] = data.formArray[i].option
    }
    if (this.isEdit) {
      payload.FEEDBACK_ID = this.editData.QUESTION_ID;
      this.CommonService.postCall('updateFeedbackQuestionnaire', payload).subscribe((res: any) => {
        this.loadFeesback();
        this.toastr.success("Feedback Questionnaire updated Successfully ");
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error("Feedback Questionnaire not updated");
      })
    } else {
      this.CommonService.postCall('SaveFeedbackQuestionnaire', payload).subscribe((res: any) => {
        this.loadFeesback();
        this.toastr.success("Feedback Questionnaire Successfully created");
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error("Feedback Questionnaire not created");
      })
    }
  }
  close() {
    this.myForm.reset();
    this.deleteDefaultControlOptions();
  }

  edit(data) {
    this.isEdit = true;
    let payload = {
      FEEDBACK_ID: data.QUESTION_ID
    }
    this.CommonService.postCall('EditFeedbackQuestionnaire', payload).subscribe((res: any) => {
      if (res.length) {
        this.editData = res[0];
        this.myForm.controls['FEEDBACK_QUES'].setValue(this.editData.FEEDBACK_QUESTION);
        this.myForm.controls['QUESTION_STATUS'].setValue(this.editData.STATUS_ID == 'True' ? true : false);
        const arrayControl: Array<UntypedFormGroup> = this.myForm.controls['formArray']['controls'];
        res.map(data=>{
          this.addControl(data.QS_OPTION);
        })


      }
    }, err => { })
  }
  changeTname() {
    this.loadFeesback()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
