import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { dataDictionary } from './../../dataDictionary';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-fee-report',
  templateUrl: './fee-report.component.html',
  styleUrls: ['./fee-report.component.css']
})
export class FeeReportComponent extends BaseComponent implements OnInit {

  course_id: number = 0;
  studentLevel_id: number = 0;
  paymentStatus_id: number = 0;

  courcesList: Array<any> = [];
  student_level_List: Array<any> = [];
  tableList: Array<any> = [];
  feeReportList: Array<any> = [];
  paymentStatus: Array<any> = [{ id: 1, name: 'Paid' }, { id: 2, name: 'UnPaid' }, { id: 3, name: 'All' }];

  private readonly onDestroy = new Subscription();

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    this.getCourses();
    this.getStudentLevels();
    this.getReport();
    this.loadReportDtOptions();
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {
      this.courcesList = res;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  getStudentLevels() {
    this.enableOrDisabledSpinner();
    const ob2$ = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.ProficiencyLevel }).subscribe((res: any) => {
      this.student_level_List = res;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob2$);
  }

  getReport() {
    const { TenantCode, company_id } = sessionStorage;
    this.loadDataTable('feeReport');
    const ob3$ = this.CommonService.getCall('Courses/FeeReport/', `${TenantCode}/${this.course_id}/${company_id}`).subscribe((res: any) => {

      let tempArr: Array<any> = res;

      if (this.studentLevel_id > 0)
        tempArr = tempArr.filter(e => e.courseshd_student_level == this.studentLevel_id);

      if (this.paymentStatus_id == 1)//Paid
        tempArr = tempArr.filter(e => e.due_amount == 0);
      else if (this.paymentStatus_id == 2)//UnPaid
        tempArr = tempArr.filter(e => e.due_amount > 0);

      this.feeReportList = tempArr.map(e => ({ ...e, studentLevelName: this.student_level_List.find(s => s.DICTIONARYID == e.courseshd_student_level)?.DICTIONARYNAME || '' }));
      setTimeout(() => { this.dtTrigger.next(); }, 100);
      console.log(this.feeReportList);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob3$);
  }

  FeeReportChange() {
    // if (this.course_id == 0)
    //   this.toastr.warning("Please select a course", "Fee Report");
    // else
    this.getReport();
  }

  loadReportDtOptions() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "excel",
          filename: 'Fee Report',
        }
      ],
      order: []
    }
  }

}
