import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../app/pages/base.component';
import { CommonService } from '../../../app/services/common.service';

@Component({
  selector: 'app-cource-schedule',
  templateUrl: './cource-schedule.component.html',
  styleUrls: ['./cource-schedule.component.css']
})
export class CourceScheduleComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  RoleId = sessionStorage.getItem('RoleId');
  isSubmitted: Boolean = false;
  editData: any = {};
  RecordingList: Array<any> = [];
tooltipContent = `
					To schedule a created internship, follow these steps: <br><br>
1.	Click the <strong>Add</strong> button. <br>
2.	Select the appropriate <strong>Category. </strong> <br>
3.	Choose the <strong>created internship</strong> from the list. <br>
4.	Fill in all required details such as <strong>Registration Start & End Dates, Internship Start & End Dates, </strong> etc. <br>
5.	Click <strong>Save</strong> to submit. <br>
6.	After submission, the schedule will be sent for <strong>admin approval. </strong> Once approved, the internship will be made available for public access. <br>

					`;

  constructor(CommonService: CommonService, toastr: ToastrService, private route: Router) {
    super(CommonService, toastr);
    this.load();
  }

  ngOnInit(): void {

  }
  load() {
    this.activeSpinner();
    let payLoad = {
      "RoleId": this.roleId,
      "COURSETRAINERID": this.userId,
      "TENANT_CODE": this.TenantCode,
      "USERID": this.userId
    }

    this.CommonService.postCall('LoadCourseScheduleBatchPlan', payLoad).subscribe((res: any) => {
      this.table = [];
      this.table = res;
      this.renderDataTable()
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })

  }
  //CourseshAssigntrainersComponent courceSchedule-AssignTrainer  courceSchedule-AssignUser
  add() {
    this.route.navigate(['HOME/courseSchedule/add'])
  }
  close() {

  }
  edit(item) {
    this.route.navigate(['HOME/courseSchedule/edit'], { queryParams: { cId: item.COURSESHD_ID } })
  }
  navigate(data, route) {
    this.route.navigate(['HOME/' + route], { queryParams: { csId: data.COURSESHD_ID, cId: data.COURSE_ID } })
  }
  sessions(item) {
    let params = {
      csId: item.COURSESHD_ID,
      cId: item.COURSE_ID,
      sDate: item.COURSESHD_STARTDATE,
      eDate: item.COURSESHD_ENDDATE
    }
    this.route.navigate(['HOME/courseSessions'], { queryParams: params })

  }
  joinMeeting(url: string) {
    super.getMeetingDetails(url);
  }

  changeTname() {
    this.load()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }



  changeStatus(URL: any) {
    if (URL) {
      this.CommonService.getCall(`nojwt/recording/getRecordingById/`, URL.split('-')[1], true).subscribe((res: any) => {
        this.RecordingList = res.data;
        setTimeout(() => { this.isSubmitted = true; }, 10);
      }, e => { });

    }
  }

  closeModel(data: any) {
    this.isSubmitted = false;

  }
}

