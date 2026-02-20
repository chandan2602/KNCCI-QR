import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from '../../../app/services/common.service';
import { ToastrService } from "ngx-toastr";
import { environment } from '../../../environments/environment';
import { BaseComponent } from '../base.component';
import { FileuploadService } from '../../services/fileupload.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-student-applied-internships',
  templateUrl: './student-applied-internships.component.html',
  styleUrls: ['./student-applied-internships.component.css']
})
export class StudentAppliedInternshipsComponent extends BaseComponent implements OnInit {
  dtOptions: any = {}; cnclComments: any = ''; rowData: any = ''; isActive: boolean = false;
  dtTrigger2: Subject<any> = new Subject();
  table: Array<any> = [];
  userDetails: any = {};
  isRecommondations: boolean = false;
  comments: string = "";
  selectedObj: any;
  statusId: number;
  company_id = sessionStorage.company_id;
  RoleId = sessionStorage.RoleId;
  serverPath: string = '';
  viewDetailsForm: UntypedFormGroup;
  userStudentDetails: any = [];
  studentIDImage: any = '';
  activeTab: string = 'applied';

  // Pagination properties
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;

  tooltipContent = `
					View all the internships you’ve applied for along with their current status. Click on the <strong>Internship Details</strong> button to access full information anytime.<br><br>
          Click the delete icon on the left to revoke this application and become eligible to apply for a new internship.
					`;

  constructor(private fileuploadService: FileuploadService, CommonService: CommonService, toastr: ToastrService, private fb: UntypedFormBuilder, private rtr: Router) {
    super(CommonService, toastr);
    this.serverPath = environment.internUrlFiles;
    this.getList();


  }

  ngOnInit(): void {
    this.viewStudentDetails()
  }
  viewStudentDetails() {
    this.viewDetailsForm = this.fb.group({
      fullname: [''],
      age: [''],
      Gender: [''],
      occupation: [''],
      Country: [''],
      County: [''],
      subCounty: [''],
      address: [''],
      area: [''],
      education: [''],
      other: [''],
      pincode: [''],
      nationality: [''],
      idCard: [''],
    })

  }
  getList() {
    this.CommonService.activateSpinner();
    this.table = [];
    this.CommonService.getCall("Enroll/IntershipApprovalList/" + `${this.roleId == '3' ? 0 : this.company_id}/${this.roleId == '3' ? this.userId : 0}`).subscribe(
      (res: any) => {
        if (this.roleId == '3') {
          let resp = res.data.map(e => ({ ...e, isCourseSte: this.courseDte(e.courseshd_startdate) }));
          this.table = resp.filter(e => e.inst_userid == this.userId);
          this.getSubscriptnData();
          // this.table = res.data.map(e => ({ ...e, isCourseSte: this.courseDte(e.courseshd_startdate) }));
        }
        else
          this.table = res.data.map(e => ({ ...e, isCourseSte: this.courseDte(e.courseshd_startdate) }));
        this.CommonService.deactivateSpinner(); this.getSubscriptnData();
      },
      (e) => {
        this.CommonService.deactivateSpinner();
      }
    );
  }

  courseDte(dateEnd: any) {
    // let params = this.params
    let isFutureDate: boolean = true;
    let today = new Date();

    if (dateEnd != '' && dateEnd != null) {
      let dateToCheck = new Date(dateEnd);
      today.setHours(0, 0, 0, 0);
      dateToCheck.setHours(0, 0, 0, 0);
      return isFutureDate = (dateToCheck >= today);
    } else {
      return false;
    }
  }


  approve(item: any, statusId: number) {
    if (confirm(`Are you sure you want to ${statusId == 1 ? "Approve" : "Reject"} this Intern?`)) {
      this.activeSpinner();
      let payload = {
        inst_approvedby: statusId == 1 ? this.userId : 0,
        inst_approvalstatus_id: statusId,
        inst_company_id: this.company_id,
        inst_approved_comments: statusId == 1 ? this.comments : '',
        inst_rejectedby: statusId == 3 ? this.userId : 0,
        inst_rejected_comments: statusId == 3 ? this.comments : '',
        inst_tnt_code: this.TenantCode,
        modifiedby: this.userId,
        internship_studentid: item.internship_studentid,
        inst_approveddate: statusId == 1 ? new Date() : null,
        inst_rejecteddate: statusId == 3 ? new Date() : null,
      };
      this.CommonService.postCall("Enroll/UpdateInternshipStudents", payload).subscribe((res: any) => {
        if (res.status) {
          this.toastr.success(`Intern ${statusId == 1 ? "Approved" : "Rejected"} Successfully`);
          document.getElementById("close1")?.click();
          this.getList();
          this.close1();
        } else {
          this.toastr.warning(res.message);
        }
        this.deactivateSpinner();
      }, (e) => {
        this.toastr.error(e.error.message);
        this.deactivateSpinner();
      });
    }
  }

  cancelRecord() { // Enroll/RevokeInternShipApplication
    if (this.cnclComments == '') {
      return this.toastr.warning(`Enter Comments`);
    }
    this.CommonService.activateSpinner();
    let payLoad: any = {
      internship_studentid: this.rowData?.internship_studentid, user_id: this.rowData?.inst_userid, courseshd_course_id: this.rowData?.course_id,
      Revoke_Comments: this.cnclComments
    }
    this.CommonService.postCall('Enroll/RevokeInternShipApplication', payLoad).subscribe(
      (res: any) => {
        if (res?.status == true) {
          this.deactivateSpinner();
          this.getList(); this.closeCncl(), this.getSubscriptnData()
        } else {
          this.toastr.warning(res.message);
          this.deactivateSpinner();
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Approve / Reject Record not getting');
        // window.history.back()
      })
  }

  getSubscriptnData() {
    let userId: any = sessionStorage.UserId;
    if (userId != undefined && userId != null && userId != '') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          this.deactivateSpinner();
          if (res?.status == true && res?.data?.length > 0) {
            sessionStorage.setItem('subscribeData', `${JSON.stringify(res?.data[0])}`);
          }
        },
        err => {
          this.deactivateSpinner();
          console.warn('Subscription check failed:', err);
          // Don't navigate back - let user stay on the page
        })
    } else {
      this.deactivateSpinner();
    }
  }

  getData(item, Id: number) {
    this.selectedObj = item;
    this.statusId = Id;
  }

  close1() {
    this.comments = "";
    $('#reason').modal('hide');
  }

  closeCncl() {
    this.cnclComments = "";
    $('#cancel').modal('hide');
  }

  viewDetails(item: any) {
    this.CommonService.activateSpinner();
    this.CommonService.postCallIntern("Registration/GetAudioPathForInternship", {
      USERID: item.inst_userid,
      COURSE_ID: item.inst_courseschedule_id,
      // USERID: 33418610,
      // COURSE_ID: 8474,
    }).subscribe(
      (res: any) => {
        this.userDetails = res;
        if (res.result) {
          $("#applicationForm").modal("show");
        } else
          // this.toastr.warning('Please try after some time!', "Details not found");
          this.CommonService.deactivateSpinner();
      },
      (err: any) => {
        this.toastr.error(err.error ? err.error : "Failed");
        this.CommonService.deactivateSpinner();
      }
    );
  }

  closePopup() {
    this.userDetails = {};
    $("#applicationForm").modal("hide");
  }

  ConvertToPDF(item: any) {
    if (item == "application") {
      let payload = {
        USERID: localStorage.getItem("UserId"),
        file_name: "EnrolmentForm.jrxml",
        file_type: "pdf",
        token: localStorage.getItem("tkn"),
        COURSE_ID: item.COURSEID,
      };
      this.CommonService.activateSpinner();
      this.CommonService.reportAPi(payload).subscribe(
        (res: any) => {
          const urlSegments = res.data.viewPath.split("/");
          const fileName = urlSegments[urlSegments.length - 1];
          const a = document.createElement("a");
          a.href = environment.downloadReportUrl + fileName;
          a.download = "Application Form.pdf"; // Specify the desired file name
          a.style.display = "none"; // Hide the anchor element
          document.body.appendChild(a); // Append to the DOM
          a.click(); // Trigger the download
          document.body.removeChild(a);
          document.getElementById("Closemodal")?.click();
          this.CommonService.deactivateSpinner();
        },
        (err: any) => {
          this.CommonService.deactivateSpinner();
        }
      );
      this.CommonService.deactivateSpinner();
      // html2canvas(data).then((canvas: any) => {
      //   const imgWidth = 208;
      //   const pageHeight = 295;
      //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
      //   let heightLeft = imgHeight;
      //   let position = 0;
      //   heightLeft -= pageHeight;
      //   const doc :any= new jspdf('p', 'mm');
      //   doc.text('', 10, 10); // Add the header.
      //   doc.text('', 10, doc.internal.pageSize.height - 10); // Add the footer.

      //   doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      //   while (heightLeft >= 0) {
      //     position = heightLeft - imgHeight;
      //     doc.addPage();
      //     doc.text('', 10, 10); // Add the header.
      //     doc.text('', 10, doc.internal.pageSize.height - 10); // Add the footer.
      //     doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      //     heightLeft -= pageHeight;
      //   }
      //   doc.save('ApplicationLetter.pdf');
      // });

      // const element = document.getElementById('printtable');
      // html2canvas(element, {
      //   scrollX: 0,
      //   scrollY: -window.scrollY,
      //   windowWidth: document.documentElement.scrollWidth,
      //   windowHeight: document.documentElement.scrollHeight,
      // }).then(function (canvas) {
      //   const pdf = new jspdf('p', 'mm', 'a4');
      //   const imgData = canvas.toDataURL('image/png');
      //   const imgWidth = 210; // A4 size: 210mm
      //   const pageHeight = (canvas.height * imgWidth) / canvas.width;
      //   let position = 0;

      //   pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pageHeight);
      //   position -= 297; // Height of A4 page in mm

      //   while (position >= -canvas.height) {
      //     pdf.addPage();
      //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pageHeight);
      //     position -= 297;
      //   }

      //   pdf.save('generated.pdf');
      //   document.getElementById('Closemodal')?.click();
      // });
    } else {
      let payload = {
        USERID: localStorage.getItem("UserId"),
        file_name: "AdmissionLetter.jrxml",
        file_type: "pdf",
        token: localStorage.getItem("tkn"),
        COURSE_ID: item.COURSEID,
      };
      this.CommonService.activateSpinner();
      this.CommonService.reportAPi(payload).subscribe(
        (res: any) => {
          const urlSegments = res.data.viewPath.split("/");
          const fileName = urlSegments[urlSegments.length - 1];
          const a = document.createElement("a");
          a.href = environment.downloadReportUrl + fileName;
          a.download = "Admission Letter.pdf"; // Specify the desired file name
          a.style.display = "none"; // Hide the anchor element
          document.body.appendChild(a); // Append to the DOM
          a.click(); // Trigger the download
          document.body.removeChild(a);
          document.getElementById("admsionForm")?.click();
          this.CommonService.deactivateSpinner();
        },
        (err: any) => {
          this.CommonService.deactivateSpinner();
        }
      );
      this.CommonService.deactivateSpinner();
    }
  }

  downloadForm(item: string) {
    this.ConvertToPDF(item);
  }

  viewStndtDetails(iUserId) {
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`Registration/GetStudentDetailsView/${iUserId}`).subscribe(
      (res: any) => {
        this.CommonService.deactivateSpinner();
        if (res.data && res.data.length > 0) {
          this.userStudentDetails = res.data[0];
          // this.toastr.info(res.message);
          $("#viewDetails").modal("show");
        } else {
          this.toastr.warning("No details found.");
        }
      },
      (err: any) => {
        this.CommonService.deactivateSpinner();
        this.toastr.error(err?.error || "Failed");
      }
    );
    setTimeout(() => {
      this.viewDetailsForm.patchValue({
        age: this.userStudentDetails.age,
        Gender: this.userStudentDetails.gender,
        occupation: this.userStudentDetails.occupation,
        Country: this.userStudentDetails.country_name,
        County: this.userStudentDetails.state_name,
        subCounty: this.userStudentDetails.districtname,
        address: this.userStudentDetails.area,
        education: this.userStudentDetails.education,
        other: this.userStudentDetails.other,
        pincode: this.userStudentDetails.pincode,
        nationality: this.userStudentDetails.nationality,
        fullname: this.userStudentDetails.fullname,
        // idCard:`${this.fileUrl}${this.userStudentDetails.upload_institute}`,
      })
      this.studentIDImage = `${this.fileUrl}${this.userStudentDetails.upload_institute}`
    }, 1000);


  }

  OnEditView(evnt: any) {
    this.rtr.navigate(['/HOME/internshipSummery'], { queryParams: { course_id: evnt.course_category_id, inst_company_id: evnt.inst_company_id } })
  }

  // Pagination methods
  get filteredInternships() {
    if (!this.searchTerm) {
      return this.table;
    }
    const search = this.searchTerm.toLowerCase();
    return this.table.filter(item =>
      item.company_name?.toLowerCase().includes(search) ||
      item.fullname?.toLowerCase().includes(search) ||
      item.course_name?.toLowerCase().includes(search) ||
      (item.isactive_internship ? 'active' : 'in-active').includes(search)
    );
  }

  get paginatedInternships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredInternships.slice(start, end);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredInternships.length / this.entriesPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

}