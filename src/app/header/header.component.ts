import { BaseComponent } from '../../app/pages/base.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../app/services/common.service';
import { environment } from '../../environments/environment';
declare var $: any;
declare function googleTranslate(): any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit {
  userName: any = sessionStorage.getItem('Username');
  table: Array<any> = [];
  viewMsg: Array<any> = [];
  message: Array<any> = [];
  levelUpdate: any;
  notifications: Array<any> = [];
  notification: Array<any> = [];
  viewNoti: Array<any> = [];
  OPERATION: any;
  ROLEID = sessionStorage.getItem('RoleId');
  UserRoleName: string;
  userImage: any;
  NotificationCount: number = 0;
  envi = environment;
  notificationsLst: any[] = []

  subscribeData: any= '';
  constructor(private route: Router, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    this.loadMessage();
    this.UserRoleName = (+sessionStorage.USERTYPE == 25) ? 'Trainer' : (+sessionStorage.USERTYPE == 24) ? 'Admin' : (+sessionStorage.USERTYPE == 27) ? 'Founder' : ((+sessionStorage.USERTYPE == 28) ? 'Incubator' : ((+sessionStorage.USERTYPE == 29) ? 'Investor': 'Student'));
    // this.UserRoleName = (+sessionStorage.USERTYPE == 25) ? 'Trainer' : 'Trainee';
    // this.UserRoleName = this.RoleName;
    // this.loadNotification();

  }

  ngOnInit(): void {
    this.CommonService.userImage.subscribe((res: any) => {
      if (res === "https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg") {
        this.userImage = res;
      } else {
        this.userImage = this.envi.urlFiles + res;
      }
    });
    // this.userImage = sessionStorage.profileImage;
    googleTranslate();

    this.getSubscriptnData(); this.getNotifications();
  }

  getSubscriptnData() { // http://localhost:56608/api/InternshipJobs/GetSubscriberByUserId/12345
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            let response = res?.data;
            if(response.length > 0) {
              this.subscribeData = response[0];
              sessionStorage.setItem('subscribeData', `${JSON.stringify(response[0])}`);
            }
            // if (res.data.length > 0) 
              
            } else {
              this.toastr.success(res.message);
              this.deactivateSpinner();
            }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
          window.history.back()
        })
    }
  }

  getNotifications() { // http://localhost:56608/api/InternshipJobs/GetNotificationsByUserId/49961064/0  
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetNotificationsByUserId/${sessionStorage.UserId}/0`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            this.notificationsLst = res?.data;
            // if(notificationsLst.length > 0) {
            //   this.subscribeData = response[0];
            //   sessionStorage.setItem('subscribeData', `${JSON.stringify(response[0])}`);
            // }
            // if (res.data.length > 0) 
              
            } else {
              this.toastr.success(res.message);
              this.deactivateSpinner();
            }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
          window.history.back()
        })
    }
  }

  readNotifications(id: any) { // http://localhost:56608/api/InternshipJobs/isreadNotification/1/49961064   ( {Notification_Id}/{user_id} )
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/isreadNotification/${id}/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.getNotifications();
            this.deactivateSpinner();
            this.notificationsLst = res?.data;
            // if(notificationsLst.length > 0) {
            //   this.subscribeData = response[0];
            //   sessionStorage.setItem('subscribeData', `${JSON.stringify(response[0])}`);
            // }
            // if (res.data.length > 0) 
              
            } else {
              this.toastr.success(res.message);
              this.deactivateSpinner();
            }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
          window.history.back()
        })
    }
  }

  Signout() {
    let { hostname } = location;
    const { company_id, cerficateimage_path, favicon_path, homepageimage_path, landingpageimage_path } = sessionStorage;
    sessionStorage.clear();
    localStorage.clear();
    // if (!["localhost", "shiksion.com", 'oukinternship.dhanushinfotech.com'].includes(hostname)) {

    sessionStorage.company_id = company_id;
    sessionStorage.cerficateimage_path = cerficateimage_path;
    sessionStorage.favicon_path = favicon_path;
    sessionStorage.homepageimage_path = homepageimage_path;
    sessionStorage.landingpageimage_path = landingpageimage_path;
    // }
    this.route.navigate(['']);
  }

  changePassword() {
    this.route.navigate(['HOME/change-password']);
  }

  menuClick() {
    $('#sidebar').toggleClass('slide');
  }
  loadMessage() {
    this.notifications = [];
    if (this.ROLEID == '1') {
      this.OPERATION = 'GETNOTIFICATIONS'
    } else if (this.ROLEID == '2') {
      this.OPERATION = 'TRAINERNOTIFICATIONS'
    } else if (this.ROLEID == '3') {
      this.OPERATION = 'STUDENTNOTIFICATIONS'
    }
    // this.CommonService.getCall(`Notification/GetNotification/${this.OPERATION}/${sessionStorage.getItem('TenantCode')}/${sessionStorage.getItem('UserId')}`).subscribe((res: any) => {
    //  // this.table = [];
    //     this.table = res;
    // }, e => { console.log(e) })
  }


  delete(id: any, type: any, notificationid: any) {
    if (id) {
      type = 2;
    }
    else if (notificationid) {
      type = 1;
    }
    this.CommonService.getCall(`Notification/DeleteNotification/${id}/${type}`).subscribe((res: any) => {

    })
  }

  close() {
    this.getUnViewdNotificationCount();
  }

  close1(e: any) {
  }

  getUnViewdNotificationCount() {

    return this.notification.filter(m => m.notification_read_status == 0).length;
  }


  apply() {
    document.getElementById('Noti_close')?.click();
  }

  loadNotification() {
    let userId: any = sessionStorage.getItem('UserId');
    if(userId != undefined && userId != null && userId !='') {
      this.notification = [];
      this.CommonService.getCall(`EmsAlerts/GetNotificationsByUser/${sessionStorage.getItem('UserId')}`).subscribe((res: any) => {
        this.notification = res;
        this.NotificationCount = this.notification.filter(m => m.notification_read_status == 0).length;
      })
    }
  }

  viewNotification(event: any) {
    this.viewNoti = [];
    this.viewNoti = +event == 0 ? this.notification : this.notification.filter(e => e.internal_notification_id == event);

    this.CommonService.getCall(`EmsAlerts/UpdateNotificationreadStatus/${event}/${1}`).subscribe((res: any) => {

    })
  }


  viewMessage(event: any) {
    this.viewNoti = [];
    this.viewNoti = +event == 0 ? this.notification : this.notification.filter(e => e.ID == event);
  }



}
