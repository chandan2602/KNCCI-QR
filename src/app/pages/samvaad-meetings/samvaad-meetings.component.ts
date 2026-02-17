import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-samvaad-meetings',
  templateUrl: './samvaad-meetings.component.html',
  styleUrls: ['./samvaad-meetings.component.css']
})
export class SamvaadMeetingsComponent implements OnInit {
  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = [];
  table: Array<any> = [];
  recordingList: Array<any> = [];
  userId: any; roleId: number = 0;
  samvaad_user: string = '';
  fromDate: any; todate: any;
  private readonly onDestroy = new Subscription();
  constructor(private CommonService: CommonService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private route: Router) {
    this.samvaad_user = sessionStorage.getItem('SU');
    if (!this.samvaad_user) {
      toastr.warning("You Don't have Samaad ");
      sessionStorage.clear();
      this.route.navigate(['/login']);
    } else this.samvaadLogin();
    this.getCourses()
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  ngOnInit(): void {
    [this.fromDate, this.todate] = [new Date(), new Date()];
  }

  // getCourses() {
  //   this.activeSpinner()
  //   this.CommonService.getAdminCourses().subscribe((res: any) => {
  //     this.deactivateSpinner();
  //     this.cources = res
  //   }, e => { this.deactivateSpinner(); })
  // }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {

      this.cources = res;
      //this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    //this.dtTrigger.unsubscribe();
  }

  courceChange() {
    this.activeSpinner();
    let data = {
      "CourseId": this.courceId
    }
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.scheduls = res;
      this.deactivateSpinner();
    }, e => {
      this.deactivateSpinner();
    })
  }

  getList() {
    let payload = {
      creatorId: +this.userId,
      role: +this.roleId,
      deleted: false,
      requesterID: +this.userId,
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.todate, 'yyyy-MM-dd'),
      courseSchuduleId: +this.schedulId
    }

    this.CommonService.samvaadPost(`jwt/lms/meeting/getMeetingList`, payload).subscribe((res: any) => {
      this.deactivateSpinner();
      this.table = res.data;

    }, e => { this.deactivateSpinner(); })
  }

  samvaadLogin() {
    let payLoad = {
      email: this.samvaad_user,
      password: sessionStorage.getItem('SP') || '123456'
    }
    this.CommonService.samvaadPost('nojwt/lms/login/login', payLoad).subscribe((res: any) => {
      console.log(res);
      if (res.status == 'OK') {
        sessionStorage.setItem('stoken', res.data.JwtToken);
        this.userId = res.data.creatorId;
        this.roleId = res.data.role;
      }
    }, err => {
      this.toastr.warning("You don't have Samvaad login");
      window.history.back();
    })
  }

  getRecordingList(session: string) {
    this.CommonService.samvaadGet(`jwt/lms/meeting/getRecordingById/${session}`,).subscribe((res: any) => {
      this.deactivateSpinner();
      this.recordingList = res.data;

    }, e => { this.deactivateSpinner(); })
  }

  playVideo(session: string) {

  }

  copyParticipantLink(link: any) {
    let listener = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (link));
      e.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    this.toastr.success('Copied link successfully');
  }

  connectLink(link: any) {
    if (window.orientation > -1)
      window.location.replace(link);
    else
      window.open(link);
  }

  joinPartispant(participantLink: string) {
    window.open(participantLink);
  }

  showRecordingView(item: any) {
    $('.closeMultiRecordingViewModal').click();
    const videoTag = document.getElementById('recorVideoPlay');
    let video = document.createElement('video') as HTMLVideoElement;
    video.src = item.playbackUrl.trim();
    video.setAttribute('id', 'playVideos');
    video.setAttribute('class', 'modal-lg');
    video.setAttribute('controls', 'true');
    video.setAttribute('controlsList', 'nodownload');
    video.style.width = "100%";
    video.autoplay = true;
    video.load();
    videoTag.appendChild(video);
  }

  downloadRecording(item: any) {
    window.open(item.playbackUrl.trim().replace("viewfile", "getfile"));
  }

  closeVideo() {
    const video = document.getElementById('playVideos') as HTMLVideoElement;
    const videoTag = document.getElementById('recorVideoPlay');
    videoTag.removeChild(video);
  }
}
