import { environment } from '../../../../environments/environment';
import { WindowRefService } from './../../../services/window-ref.service';
import { ICourse } from './../../shared/models/course';
import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../app/services/common.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-view-course-details',
  templateUrl: './view-course-details.component.html',
  styleUrls: ['./view-course-details.component.css']
})
export class ViewCourseDetailsComponent implements OnInit {
  courseDetails: any;
  chapterList: Array<any> = [];
  sessionList: Array<ISessionDetails> = [];
  sessionDetails: ISessionDetails;
  myCourses: Array<any> = [];
  enroll: any; subscribeDetails: any = '';
  // myForm: FormGroup;
  private readonly onDestroy = new Subscription();
  isLogin: boolean = false;
  isAlreadyCourseTaken: boolean = false;
  isCourseExpired: boolean = false;
  // isRegistrationEnd : Boolean =false;
  // COURSESHD_ID: number = 0;
  paymentstatus: boolean = false;

  InstallmentList: Array<any> = [];
  isInstallment: boolean = false;
  constructor(private winRef: WindowRefService,
    private location: Location, private CommonService: CommonService, private toastr: ToastrService, private route: Router) {
    this.setDefaultCourse();
    this.setDefaultSession();
    this.isLogin = +(sessionStorage.RoleId || 0) > 0;

    if (sessionStorage.getItem('subscribeData') != null && sessionStorage.getItem('subscribeData') != 'undefined' && sessionStorage.getItem('subscribeData') != undefined) {
      this.subscribeDetails = '',
      this.subscribeDetails = JSON.parse(<string>sessionStorage.getItem('subscribeData'))
        
    };
  }

  ngOnInit(): void {
    const resultState: any = this.location.getState();
    delete resultState['navigationId'];
    // console.log(resultState);
    this.courseDetails = resultState;
    if (this.courseDetails && !this.isLogin)
      sessionStorage.courseDetails = JSON.stringify(this.courseDetails);
    else
      sessionStorage.removeItem('courseDetails');
    // this.courseDetails = Object.values(resultState) ;
    // console.log(this.courseDetails);
    if (this.courseDetails.moreoptions)
      this.courseDetails.moreoptions = this.courseDetails.moreoptions.split(",");
    else
      this.courseDetails.moreoptions = [];

    const courseId: number = this.courseDetails.COURSE_ID || 0;
    if (courseId > 0)
      this.loadSessions(courseId);
    this.getCourses();
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  loadSessions(courseId: number) {
    this.sessionList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('GetSessionsByCourseId', `/${courseId}`).subscribe((res: any) => {
      this.sessionList = res.dtCourseScehdule;
      if (this.sessionList.length > 0) {
        this.sessionDetails = { ...this.sessionList[0], Total_Payable_Amount: 0 };
        this.sessionChanged(this.sessionDetails.COURSESHD_ID);
      }
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  setDefaultCourse() {
    this.courseDetails = {
      COURSE_ID: 0,
      COURSE_NAME: '',
      COURSE_DESCRIPTION: '',
      COURSE_CATEGORY_ID: 0,
      COURSE_STATUS: true,
      COURSE_RATING: 0,
      COURSE_IMAGE: '',
      IMAGE_URL: '',
      USERID: 0,
      FIRSTNAME: '',
      LASTNAME: '',
      COURSE_TRENDING: true,
      COURSESHD_AMOUNT: 0,
      moreoptions: []
    };
  }

  setDefaultSession() {
    this.sessionDetails = {
      COURSESHD_AMOUNT: 0,
      COURSESHD_COURSE_ID: 0,
      COURSESHD_ENDDATE: '',
      COURSESHD_ENDTIME: '',
      COURSESHD_ID: 0,
      COURSESHD_NAME: '',
      COURSESHD_STARTDATE: '',
      REGISTRATION_STARTDATE: '',
      REGISTRATION_ENDDATE: '',
      COURSESHD_STARTTIME: '',
      COURSESHD_PAYMENT_METHOD: 0,
      Total_Payable_Amount: 0,

    };
  }

  sessionChanged(id: number) {
    let today = new Date();
    let dateToCheck = new Date(this.sessionDetails.REGISTRATION_ENDDATE);

    // Remove time for accurate comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    if(this.sessionDetails.REGISTRATION_ENDDATE != '') {
      this.isCourseExpired = dateToCheck < today;
    } else {
      this.isCourseExpired = true;
    }
    this.isInstallment = false;
    if (id > 0) {
      this.sessionDetails = { ... this.sessionList.find(e => e.COURSESHD_ID == id), Total_Payable_Amount: 0 };
      this.loadChapters(this.sessionDetails.COURSESHD_ID, this.sessionDetails.COURSESHD_COURSE_ID);
      this.isInstallment = +this.sessionDetails.COURSESHD_PAYMENT_METHOD == 2;
      if (this.isInstallment)
        this.loadInstallmentDetails(+this.sessionDetails.COURSESHD_ID, +sessionStorage.UserId);
      const dt1 = new Date();
      const currentDate: string = `${dt1.getFullYear()}-${dt1.getMonth() + 1}-${dt1.getDate()}`;
      // this.isCourseExpired = 0 <= this.compareDates(currentDate, this.sessionDetails.REGISTRATION_ENDDATE.replace("T00:00:00", ""));
      // this.isRegistrationEnd = 0 <= this.compareDates(currentDate, this.sessionDetails.REGISTRATION_ENDDATE?.replace("T00:00:00", ""));
      this.isExpired();
    }
    else {
      this.setDefaultSession();
      this.chapterList = [];
    }
  }

  installmentChanged(checkedItem: any, installmentItem: any) {
    if (installmentItem) {
      // installmentItem.status = checkedItem.checked;
      // if (checkedItem.checked)
      //   this.sessionDetails.Total_Payable_Amount += installmentItem.TERM_AMOUNT;
      // else
      //   this.sessionDetails.Total_Payable_Amount -= installmentItem.TERM_AMOUNT;

      if (checkedItem.checked == false) {
        this.InstallmentList.filter(e => e.CSI_INSTALMENT_ID >= installmentItem.CSI_INSTALMENT_ID).forEach(e => {
          if (e.status) {
            this.sessionDetails.Total_Payable_Amount -= e.TERM_AMOUNT;
            e.status = false;
          }
        });
      }
      else if (checkedItem.checked) {
        this.sessionDetails.Total_Payable_Amount = 0;
        this.InstallmentList.filter(e => e.CSI_INSTALMENT_ID <= installmentItem.CSI_INSTALMENT_ID).forEach(e => {
          this.sessionDetails.Total_Payable_Amount += e.TERM_AMOUNT;
          e.status = true;
        });
      }

      console.log(this.InstallmentList);
    }
  }

  loadInstallmentDetails(COURSESHD_ID: number, STUDENT_ID: number) {
    this.InstallmentList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('CourseSchedule/GetUpaidInstallments', `/${COURSESHD_ID}/${STUDENT_ID}`).subscribe((res: any) => {
      this.InstallmentList = res.dtCourseScehdule.map((e, index) => ({ ...e, status: !index }));//res.dtCourseScehdule;
      this.sessionDetails.Total_Payable_Amount += this.InstallmentList.length > 0 ? this.InstallmentList[0].TERM_AMOUNT : 0;
      console.log(this.InstallmentList);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  loadChapters(COURSESHD_ID: number, COURSE_ID: number) {
    this.chapterList = [];
    // this.enableOrDisabledSpinner();
    this.CommonService.activateSpinner();
    const ob1$ = this.CommonService.getCall('getChaptersByCourseId', `/${COURSESHD_ID}/${COURSE_ID}`).subscribe((res: any) => {
      this.chapterList = res.map(e => ({ ...e, CHAPTER_DESCRIPTION: e.CHAPTER_DESCRIPTION.replace("\n", "<br>") }));
      console.log(this.chapterList);
      this.enableOrDisabledSpinner(false);
      this.CommonService.deactivateSpinner();
    }, e => { this.CommonService.deactivateSpinner(); });
    this.onDestroy.add(ob1$);
    this.CommonService.deactivateSpinner();
  }

  Enroll() {
    if (this.isLogin)
      document.getElementById('btnEnrolled')?.click();
    else
      this.route.navigate(['/login']);
  }

  EnrollSubscription() {
    let today = new Date();
    let dateToCheck = new Date(this.subscribeDetails?.expired_date);

    // Remove time for accurate comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    let isFutureDate: boolean = dateToCheck < today;
    if (this.subscribeDetails == '' || this.subscribeDetails ==  undefined ) {
      this.toastr.info('Please Subscribe');
      this.route.navigate(['/HOME/subscribe']);
    } else if(this.subscribeDetails?.internships_remaining == 0 || isFutureDate) {
      this.toastr.info('Subscription is Expired');
      this.route.navigate(['/HOME/subscribe']);
    } else {
      // this.EnrollApply();
      this.onPaymentClicked();
    }

  }

  EnrollApply() {
    this.CommonService.activateSpinner();
    let payLoad = [{
      CourseId: this.sessionDetails.COURSESHD_COURSE_ID,
      CREATEDBY: sessionStorage.UserId,
      TNT_CODE: sessionStorage.TenantCode,
      UserId: sessionStorage.UserId,
      CourseScheduleId: this.sessionDetails.COURSESHD_ID,
      ModifiedBy: sessionStorage.UserId,
      company_id: this.courseDetails.company_id,
      STUDENT_PAYMENT_COURSE_FEE: this.subscribeDetails?.package_id == 1 ? 1000 : (this.subscribeDetails?.package_id == 2 ? 1500 : 2000),
      STUDENT_PAYMENT_TOTAL_AMOUNT_PAID: this.subscribeDetails?.package_id == 1 ? 1000 : (this.subscribeDetails?.package_id == 2 ? 1500 : 2000),
      STUDENT_PAYMENT_CSI_INSTALLMENT_ID: 0
    }];
    this.CommonService.postCall('Enroll/CreateEnroll', payLoad).subscribe((res: any) => {
      // this.enroll = res;
      if (res) {
        if(res.status == true) {
          this.toastr.success(res.message),
          this.CommonService.deactivateSpinner();
          this.route.navigate(['HOME/appliedInternships']);

        } else {
          this.toastr.info(res.message),
          this.CommonService.deactivateSpinner();

        }

      

        // const { student_payment_id } = res[0];
        // this.make_Payment(student_payment_id);
      }
      // document.getElementById('md_close').click();
      // this.toastr.success('Payment Successfully');
      // this.route.navigate(['home/my-courses']);

    });
  }

  isEnrolled(details: any): boolean {
    // const index = this.myCourses?.findIndex(m => { m.COURSE_ID == details.COURSE_ID && m.COURSESHD_ID == details.COURSESHD_ID });
    const index = this.myCourses?.findIndex(m => { m.COURSE_ID == details.COURSE_ID });
    return index > 0;

  }

  EnrollSuccess() {
    const { UserId, TenantCode } = sessionStorage;
    if (!UserId) {
      this.route.navigate(['/login']);
    } else {
      let payLoad: any = [];
      if (this.isInstallment && this.InstallmentList.length > 0) {
        payLoad = this.InstallmentList.filter(f => f.status == true).map(e =>
        ({
          CourseId: this.sessionDetails.COURSESHD_COURSE_ID,
          CREATEDBY: UserId,
          TNT_CODE: TenantCode,
          UserId: UserId,
          CourseScheduleId: this.sessionDetails.COURSESHD_ID,
          ModifiedBy: UserId,
          STUDENT_PAYMENT_COURSE_FEE: this.subscribeDetails?.package_id == 1 ? 1000 : (this.subscribeDetails?.package_id == 2 ? 1500 : 2000),
          STUDENT_PAYMENT_TOTAL_AMOUNT_PAID: this.subscribeDetails?.package_id == 1 ? 1000 : (this.subscribeDetails?.package_id == 2 ? 1500 : 2000),
          STUDENT_PAYMENT_CSI_INSTALLMENT_ID: 0
          // STUDENT_PAYMENT_COURSE_FEE: this.sessionDetails.COURSESHD_AMOUNT,
          // STUDENT_PAYMENT_TOTAL_AMOUNT_PAID: e.TERM_AMOUNT,
          // STUDENT_PAYMENT_CSI_INSTALLMENT_ID: e.CSI_INSTALMENT_ID
        }));
        if (payLoad.length == 0) {
          this.toastr.warning('Please select at least one installment');
          return;
        }
      }
      else {
        payLoad = [{
          CourseId: this.sessionDetails.COURSESHD_COURSE_ID,
          CREATEDBY: UserId,
          TNT_CODE: TenantCode,
          UserId: UserId,
          CourseScheduleId: this.sessionDetails.COURSESHD_ID,
          ModifiedBy: UserId,
          company_id: this.courseDetails.company_id,
          STUDENT_PAYMENT_COURSE_FEE: this.subscribeDetails?.package_id == 1 ? 1000 : (this.subscribeDetails?.package_id == 2 ? 1500 : 2000),
          STUDENT_PAYMENT_TOTAL_AMOUNT_PAID: this.subscribeDetails?.package_id == 1 ? 1000 : (this.subscribeDetails?.package_id == 2 ? 1500 : 2000),
          // STUDENT_PAYMENT_COURSE_FEE: this.sessionDetails.COURSESHD_AMOUNT,
          // STUDENT_PAYMENT_TOTAL_AMOUNT_PAID: this.sessionDetails.COURSESHD_AMOUNT,
          STUDENT_PAYMENT_CSI_INSTALLMENT_ID: 0
        }];
      }
        this.CommonService.activateSpinner();


      // return;
      this.CommonService.postCall('Enroll/CreateEnroll', payLoad).subscribe((res: any) => {
        // this.enroll = res;
        if (res) {
          if(res.status == true) {
            this.SubscriptionCheck();
            const { student_payment_id } = res?.data[0];
            this.make_Payment(student_payment_id);
            this.CommonService.deactivateSpinner();

          } else {
            this.toastr.info(res.message),
          this.CommonService.deactivateSpinner();

          }
        }
        // document.getElementById('md_close').click();
        // this.toastr.success('Payment Successfully');
        // this.route.navigate(['home/my-courses']);

      });

    }
  }

  SubscriptionCheck() { //InternshipJobs/UpdateSubscriberPlan/{user_id}/{subscriber_id}/{applied_type}
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/UpdateSubscriberPlan/${sessionStorage.UserId}/${this.subscribeDetails?.subscriber_id}/Internship`, '', false).subscribe(
          (res: any) => {
        if(res?.status == true) {
          this.CommonService.deactivateSpinner();

        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.CommonService.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
  }

  onPaymentClicked() {
    if (this.isInstallment) {
      if (this.InstallmentList.length == 0) {
        document.getElementById('md_close')?.click();
        this.toastr.error('You have already taken this course');
        return;
      }
      const isSelectedInstallments: boolean = this.InstallmentList.some(e => e.status == true);
      if (isSelectedInstallments == false) {
        this.toastr.error('Please select at least one installment.');
        return;
      }
      this.EnrollSuccess();
    }
    else
      this.IsPaidforSchedule();
  }

  IsPaidforSchedule() {
    const { UserId } = sessionStorage;
    const COURSESHD_ID: number = this.sessionDetails.COURSESHD_ID;
    if (COURSESHD_ID > 0) {
      this.enableOrDisabledSpinner();
      const Schedule$ = this.CommonService.getCall('Courses/IsPaidforSchedule/', `${UserId}/${COURSESHD_ID}`).subscribe((res: any) => {
        if(res?.status == true) {
          this.CommonService?.deactivateSpinner();
            this.EnrollSuccess();
        } else {
          this.toastr.warning(res.message);
          document.getElementById('md_close')?.click();
          this.CommonService?.deactivateSpinner();
        }
        // const isCourseTaken = res;
        // if (isCourseTaken == 'You are currently enrolled in an internship. You may apply for another one once your existing internship has concluded.') {
        //   document.getElementById('md_close')?.click();
        //   this.toastr.info(`isCourseTaken`);
        // }
        // else {
        //   this.EnrollSuccess();
        // }
        // this.enableOrDisabledSpinner(false);
      }, err => {
        this.CommonService?.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
      this.onDestroy.add(Schedule$);
    }
    else
      this.toastr.warning('Please select a Schedule');
  }

  getCourses() {
    this.myCourses = [];
    this.enableOrDisabledSpinner();
    const mycourse$ = this.CommonService.getCall('CourseSchedule/GetMyCourses/', `${sessionStorage.UserId}/0/true`).subscribe((res: any) => {
      this.myCourses = res.dtCourseScehdule;
      if (this.isLogin) {
        this.isAlreadyCourseTaken = this.isEnrolled(this.courseDetails);
      }
      this.isExpired();
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(mycourse$);

  }

  isExpired() {
    // const exp: boolean = this.sessionDetails.COURSESHD_ID > 0 && (this.isCourseExpired);
    if (this.sessionDetails.COURSESHD_ID > 0 && this.isCourseExpired && !this.isAlreadyCourseTaken) {
      return this.toastr.warning('Internship registration has ended.');
      //  || 'Your course is Expired'
    }
    // if(this.isAlreadyCourseTaken == false) {
    //   return this.toastr.warning('You Have Already Taken This Course.');
    //   // this.route.navigate(['/HOME/appliedInternships']);
    // }

  }

  close() { this.sessionDetails.Total_Payable_Amount = 0; }

  GSTPercentages(val: number) {
    const totalGST = val * 18 / 100;
    return totalGST;
  }

  make_Payment(student_payment_id: number) {
    const currentDate = new Date();
    const newDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    currentDate.setDate(currentDate.getDate() + 10);
    const expiryDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const totalAmt = this.isInstallment ? this.sessionDetails.Total_Payable_Amount : this.sessionDetails.COURSESHD_AMOUNT;
    const { UserId, TenantCode } = sessionStorage;
    const payload = {
      payment_id: student_payment_id,
      user_regid: UserId,
      groupadmin_regid: 0,
      amount: totalAmt + this.GSTPercentages(totalAmt),
      payment_date: newDate,
      payment_mode: 1,
      airport_id: 1,
      course_id: 1,
      approved_tranction_details_id: 0,
      expiry_date: expiryDate,
      // tnt_code: 12345678,
      tnt_code: TenantCode,
      created_by: UserId,
      create_date: newDate
    };

    this.enableOrDisabledSpinner();
    const mycourse$ = this.CommonService.postCall('Payment/MakePayment', payload).subscribe((res: any) => {
      // this.payWithRazor(res);
      this.paymentResponse(res, 0);
      this.enableOrDisabledSpinner(false);
    }, e => {
      this.enableOrDisabledSpinner(false);
      this.toastr.warning('Please try later after some time', 'Payment failed')
    });
    this.onDestroy.add(mycourse$);

  }

  payWithRazor(val: any) {
    const options: any = {
      prefill: {
        email: sessionStorage.USERNAME,
        contact: sessionStorage.MobileNo
      },
      key: environment.RazorPay_Key,
      // key: 'rzp_test_n9kOog8GmBqfim',
      // amount: val.amount, // amount should be in paise format to display Rs 1255 without decimal point
      amount: 1, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'shiksion', // company name or product name
      description: '',  // product description
      image: './../../../assets/img/samvaad_tutor_logo.png', // company logo or product image
      order_id: val.order_id,//'order_K4gst603mrTngY', // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };

    options.handler = ((response: any, error: any) => {
      options.response = response;
      console.log(response);
      console.log(options);
      console.log(error)
      response.json = JSON.stringify(response);
      response.payment_id = val.payment_id;
      response.created_by = sessionStorage.UserId,
        this.paymentResponse(response, 1);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.on('payment.failed', function (respons: any) {
      console.log(respons);
      alert("This step of Payment Failed");
    });
    rzp.open();
  }

  paymentResponse(data: any, typ = 0) {
    this.enableOrDisabledSpinner();
    let razorpay_payment_id = `pay_${new Date().getTime().toString()}`;
    let razorpay_order_id = `pay_${new Date().getTime().toString()}`;
    let Json = {
      "id": razorpay_payment_id,
      "entity": "payment",
      "amount": data.amount,
      "currency": data.currency,
      "status": "captured",
      "order_id": data.order_id,
      "invoice_id": null,
      "international": false,
      "method": "upi",
      "amount_refunded": 0,
      "refund_status": null,
      "captured": true,
      "description": "QRv2 Payment",
      "card_id": null,
      "bank": null,
      "wallet": null,
      "vpa": "anumulamayukha@okicici",
      "email": sessionStorage.USERNAME,
      "contact": sessionStorage.MobileNo,
      "notes": [],
      "fee": 3,
      "tax": 0,
      "error_code": null,
      "error_description": null,
      "error_source": null,
      "error_step": null,
      "error_reason": null,
      "acquirer_data": {
        "rrn": "311128507664"
      },
      "created_at": new Date().getTime(),
    }
    let payload = {
      payment_id: data.payment_id,
      created_by: sessionStorage.UserId,
      json: JSON.stringify(Json),
      razorpay_signature: JSON.stringify({ "razorpay_payment_id": razorpay_payment_id, "razorpay_order_id": razorpay_order_id, "razorpay_signature": "119d4e12c6f25bee81fa0100d5412bf86a3af244d523bb2dd2fd44127d2418cf", "status_code": 200 }),
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id
    }
    this.CommonService.postCall(`Payment/${typ == 1 ? 'confirm' : 'confirmWithoutRazor'}`, typ == 1 ? data : payload).subscribe((res: any) => {
      setTimeout(() => {
        this.paymentstatus = true;
        // setTimeout(() => { this.route.navigate(['/']) }, 30000);
        document.getElementById('md_close')?.click();
        this.toastr.success('Payment Successfully');
        this.enableOrDisabledSpinner(false);
        this.route.navigate(['HOME/my-courses']);

      }, 2000);

      // this.cloasewindow();

    }, e => {
      this.toastr.error('Payment Failed')
      this.enableOrDisabledSpinner(false);
    })

  }

  compareDates(d1: string, d2: string): number {
    const date1 = new Date(d1).getTime();
    const date2 = new Date(d2).getTime();
    let returnval = 0;
    if (date1 < date2) {
      console.log(`${d1} is less than ${d2}`);
      returnval = 1;
    } else if (date1 > date2) {
      console.log(`${d1} is greater than ${d2}`);
      returnval = -1;
    } else {
      console.log(`Both dates are equal`);
      returnval = 0;
    }
    return returnval;
  }
}

interface ISessionDetails {
  COURSESHD_AMOUNT: number;
  COURSESHD_COURSE_ID: number;
  COURSESHD_ENDDATE: string;
  COURSESHD_ENDTIME: string;
  COURSESHD_ID: number;
  COURSESHD_NAME: string;
  COURSESHD_STARTDATE: string;
  COURSESHD_STARTTIME: string;
  REGISTRATION_STARTDATE: string;
  REGISTRATION_ENDDATE: string;
  COURSESHD_PAYMENT_METHOD: number;
  Total_Payable_Amount: number;
}
