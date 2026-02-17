import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-evaluateassignments',
  templateUrl: './evaluateassignments.component.html',
  styleUrls: ['./evaluateassignments.component.css']
})
export class EvaluateassignmentsComponent implements OnInit {

  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = []
  table: any = [];
  assignmentId: string = '';
  assignments: Array<any> = []
  fileName: string;
  file: File;
  private readonly onDestroy = new Subscription();
  EV_ASSIGNMENT_ID: number = 0;
  constructor(private CommonService: CommonService, private toastr: ToastrService, private FileuploadService: FileuploadService) {
    this.getCourses()
  }
  ngOnInit(): void {
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  // getCourses() {
  //   this.activeSpinner()
  //   this.CommonService.getAdminCourses().subscribe((res: any) => {
  //     this.deactivateSpinner();
  //     this.cources = res
  //   },e=>{ this.deactivateSpinner();})
  // }
  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {
      this.cources = res;
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
      this.deactivateSpinner();
      this.scheduls = res;
    }, e => { this.deactivateSpinner(); })
  }
  schedulChange() {
    this.activeSpinner();
    this.CommonService.getAssignmentsDropDown(this.schedulId).subscribe((res: any) => {
      this.deactivateSpinner();
      this.assignments = res;
    }, err => { this.deactivateSpinner(); })
  }
  assignmentChange() {
    this.activeSpinner()
    let data = {
      CourseScheduleId: this.schedulId,
      AssessmentId: this.assignmentId
    }
    this.CommonService.loadEvaluateAssignments(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.table = res;
    }, err => { this.deactivateSpinner(); })
  }
  evaluate(data) {
    let emarks = data.EV_STUDENT_MARKS;
    let maxMarks = data.ASSIGNMENT_MAX_MARKS;
    if (!emarks) {
      // alert("please enter the marks")
      this.toastr.warning('please enter the marks');
      return
    }
    if (emarks > maxMarks) {
      this.toastr.warning("Marks not more than Max Marks")
      // alert("Marks not more than Max Marks")
      return
    }
    let param = {
      EvaluateID: data.EV_ASSIGNMENT_ID || 0,
      Marks: emarks,
      AssessmentId: data.ASSIGNMENT_ID,
      CourseScheduleId: this.schedulId
    }
    this.activeSpinner();
    this.CommonService.setEvaluateAssignments(param).subscribe((res) => {
      //  alert('Information updated successfully.');
      this.deactivateSpinner();
      this.toastr.success('Information updated successfully.');
      this.assignmentChange()
    }, err => { this.deactivateSpinner(); })

  }

  selectFile(item: any) {
    this.EV_ASSIGNMENT_ID = item.EV_ASSIGNMENT_ID;
    document.getElementById('file_upload').click();
  }

  upload(data: any) {

    this.fileName = null;
    const formData = new FormData();
    formData.append('Yes', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/UploadEvaluateAssignment');

    this.activeSpinner();
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      if (res.path) {
        const payload = {
          Course: this.courceId,
          EV_AssignmentId: this.EV_ASSIGNMENT_ID,
          filePath: res.path
        }
        this.FileuploadService.upload(payload, 'Assignments/UploadEvaluateAssignment').subscribe((res1: any) => {
          this.fileName = res1.path;
          if (this.fileName) {
            data.UploadFilePath = res1.path;
            this.deactivateSpinner();
            this.assignmentChange();
          }
        });
      }
    }, err => { this.deactivateSpinner(); })
  }
  change(event, data) {

    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf']
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload(data);
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload pdf and doc file formats only.')
        event.target.value = ''
      }
    }
  }
  // download(link: string) {
  //   let url =environment.serviceUrl;
  //   link = link.substr(18);
  //   window.open(url+ 'Assignments/SubmitAssignmentDownload'+ link, '_blank')
  // }
  download(filePath: string) {
    let url = `${this.CommonService.fileUrl}${filePath}`;
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    let filename = "exmaple.docx";
    if (filename)
      downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }
}
