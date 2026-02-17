import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { Subscription } from 'rxjs';
import { dataDictionary } from './../../dataDictionary';
import { BaseComponent } from '../base.component';
@Component({
  selector: 'app-trainer-report',
  templateUrl: './trainer-report.component.html',
  styleUrls: ['./trainer-report.component.css']
})

export class TrainerReportComponent extends BaseComponent implements OnInit {

  courcesList: Array<any> = [];
  course_id: number = 0;
  trainerReportList: Array<any> = [];
  student_level_List: Array<any> = [];

  private readonly onDestroy = new Subscription();


  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    this.getCourses();
    this.getStudentLevels();
    this.getTrainerReport();
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

  getTrainerReport() {
    const { TenantCode, company_id } = sessionStorage;
    this.loadDataTable('trainerReport');
    const ob2$ = this.CommonService.getCall('Courses/TrainerReport/', `${TenantCode}/${this.course_id}/${company_id}`).subscribe((res: any) => {
      let tempArr: Array<any> = res;
      this.trainerReportList = tempArr.map(e => ({ ...e, studentLevelName: this.student_level_List.find(s => s.DICTIONARYID == e.courseshd_student_level)?.DICTIONARYNAME || '' }));
      setTimeout(() => { this.dtTrigger.next(); }, 100);
      console.log(this.trainerReportList);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob2$);

  }

  getStudentLevels() {
    this.enableOrDisabledSpinner();
    const ob2$ = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.ProficiencyLevel }).subscribe((res: any) => {
      this.student_level_List = res;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob2$);
  }

  trainerReportChange() {
    this.getTrainerReport();
  }

  loadReportDtOptions() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "excel",
          filename: 'Trainer Report',
        }
      ],
      order: []
    }
  }

}
