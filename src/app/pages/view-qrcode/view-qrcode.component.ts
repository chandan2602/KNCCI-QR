import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-qrcode',
  templateUrl: './view-qrcode.component.html',
  styleUrls: ['./view-qrcode.component.css']
})
export class ViewQrcodeComponent implements OnInit {
  UserId: string;
  FullName: string;
  COURSESHD_ID: string;
  private readonly onDestroy = new Subscription();
  showModel: boolean = false;
  certificateInfo: any;

  constructor(private active: ActivatedRoute, private CommonService: CommonService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.active.queryParams.subscribe((res: any) => {
      const response = res.id;
      const arr = atob(response).split('&');
      this.UserId = arr[0];
      this.FullName = arr[1].split('=')[1];
      this.COURSESHD_ID = arr[2].split('=')[1];
      this.getCourses();
    });
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('CourseSchedule/GetMyCourses/', `${this.UserId}`).subscribe((res: any) => {
      this.downloadCertificate(res.dtCourseScehdule.find(e => e.COURSESHD_ID == this.COURSESHD_ID));
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  downloadCertificate(courseInfo: any) {
    this.showModel = true;
    this.certificateInfo = { ...courseInfo, userId: this.UserId, FullName: this.FullName };
    setTimeout(() => (<HTMLInputElement>document.getElementById('btnShowModel')).click(), 10);
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
  }
}
