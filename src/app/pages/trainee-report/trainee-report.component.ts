import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../base.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trainee-report',
  templateUrl: './trainee-report.component.html',
  styleUrls: ['./trainee-report.component.css']
})
export class TraineeReportComponent extends BaseComponent implements OnInit {
  courcesList: Array<any> = [];
  course_id: number = 0;
  traineeReportList: Array<any> = [];
  showModel: boolean = false;
  FileDetails: { filePath: string, isImage: boolean, isPDF: boolean } = { filePath: '', isImage: false, isPDF: false };
  url = environment.fileUrl;
  FileName: string = "";

  private readonly onDestroy = new Subscription();

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);

  }

  ngOnInit(): void {
    this.getCourses();
    this.getTraineeReport();
    this.loadReportDtOptions();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
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

  getTraineeReport() {
    const { TenantCode, company_id } = sessionStorage;
    // let t = $('#DataTables_Table_0').DataTable();
    // t.destroy();
    this.loadDataTable('traineeReport');
    this.CommonService.getCall('Courses/TraineeReport/', `${TenantCode}/${this.course_id}/${company_id}`).subscribe((res: any) => {
      // this.traineeReportList = res;
      this.traineeReportList = res.map(e => ({ ...e, upload_institute: e.upload_institute ? `${this.url}${e.upload_institute}` : '' }));
      setTimeout(() => { this.dtTrigger.next(); }, 100);
      console.log(this.traineeReportList);
    })

  }

  traineeReportChange() {
    this.getTraineeReport();
  }

  loadReportDtOptions() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "excel",
          filename: 'Trainee Report',
        }
      ],
      order: []
    }
  }

  OpenModel(fileName: string) {
    //fileName = "https://web-preview.pspdfkit.com/showcases/8.pdf";
    // fileName = "https://rfrf.shikshan.co.in/assets/img/RFRF_logo_1.png";

    this.FileName = fileName;
    this.showModel = true;
    // this.download(fileName, "");
  }

  closeModel() {
    this.showModel = false;
  }

  // download(url: string, downloadName: any) {
  //   let link = document.createElement("a");
  //   link.download = "Sample.pdf";
  //   link.href = "https://web-preview.pspdfkit.com/showcases/8.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   // delete link;

  // }


}
