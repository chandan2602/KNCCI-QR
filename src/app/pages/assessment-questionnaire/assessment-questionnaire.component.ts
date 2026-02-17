import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-assessment-questionnaire',
  templateUrl: './assessment-questionnaire.component.html',
  styleUrls: ['./assessment-questionnaire.component.css']
})
export class AssessmentQuestionnaireComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService, private route: Router) {
    super(CommonService, toastr)
    this.load();
  }

  ngOnInit(): void {


  }

  load() {
    this.activeSpinner();
    let payLoad: any = {
      "RoleID": this.roleId,
      "COURSETRAINERID": this.roleId == "1" ? "0" : this.userId,
      TENANT_CODE: this.tId || this.TenantCode,
      "QUESTION_TYPE": "1"

    }
    this.CommonService.postCall('LoadAssessmentQuestionaries', payLoad).subscribe((res: any) => {
      this.table = [];
      this.table = res;
      this.renderDataTable()
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  add() {
    this.route.navigate(['HOME/asssessemnt/add'])
  }


  edit(data) {
    let payLoad = {
      qId: data.QUESTION_ID
    }
    this.route.navigate(['HOME/asssessemnt/edit'], { queryParams: payLoad })
  }

  changeTname() {
    this.load()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
//10996,16488,
//10869,16369