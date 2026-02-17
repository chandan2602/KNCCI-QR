import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service'
import { param, type } from 'jquery';
import { FileuploadService } from '../../services/fileupload.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-submitassignments',
  templateUrl: './submitassignments.component.html',
  styleUrls: ['./submitassignments.component.css']
})
export class SubmitassignmentsComponent implements OnInit {
  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = [];
  table: Array<any> = []
  currentEditFile: any;
  file: File;
  constructor(private CommonService: CommonService, private FileuploadService: FileuploadService, private toastr: ToastrService, private route: Router) {
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

  getCourses() {
    this.activeSpinner();
    this.CommonService.getCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    }, e => { this.deactivateSpinner(); })
  }

  courceChange() {
    this.activeSpinner();
    let data = {
      "CourseId": this.courceId
    }
    this.CommonService.getCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.scheduls = res;
    }, e => { this.deactivateSpinner(); })
  }
  schedulChange() {
    this.activeSpinner();
    let data = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId
    }
    this.CommonService.getAssignments(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.table = res;
    }, e => {
      this.deactivateSpinner();
    })
  }

  getLink(link: string) {
    let url = this.CommonService.fileUrl;
    link = link.substr(1);
    window.open(url + '/Assignments' + link, '_blank');
  }
  save() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/SubmitAssignments');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      if (res.path) {
        const payload = {
          AssignmentId: this.currentEditFile.ASSIGNMENT_ID,
          UserId: sessionStorage.UserId,
          ClientDocs: 'ClientDocs',
          Course: this.courceId,
          path: res.path
        };
        this.FileuploadService.upload(payload, 'Assignments/SubmitAssignments').subscribe((res1: any) => {
          if (res1.message == 'Information Saved Successfully') {
            this.toastr.success(res1.message);
            document.getElementById('md_close').click();
            this.schedulChange();
          }
        });
      } else { }

    }, err => { });
  }
  edit(item: any) {
    this.currentEditFile = item;

  }
  download(filePath: string) {
    // let fileType = id.substr(id.length - 3)
    // if (fileType == 'pdf') {
    //   this.getLink(id)
    // }
    // else {
    //   let http = this.CommonService.http;
    //   let url = this.CommonService.fileUrl;
    //   http.get(url+'/Assignments' + id.substr(1), { responseType: 'blob' }).subscribe((res) => {
    //     let dataType = res.type;
    //     let binaryData = [];
    //     binaryData.push(res);
    //     let downloadLink = document.createElement('a');
    //     downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    //     let filename = "exmaple.docx"
    //     if (filename)
    //       downloadLink.setAttribute('download', filename);
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //   }, (e) => { 
    //     this.toastr.warning("file not found ")
    //    })
    // }
    let url = `${this.CommonService.fileUrl}${filePath}`;
    let downloadLink = document.createElement('a');
    // downloadLink.href = "https://shiksion.samvaadpro.com/home/shiksion/Attachments/UploadAssignment/UploadAssignment_3f2bee0a-03ec-4e66-82e1-97ea5b1f4bb9_8304_4874c35c-5447-44bb-8ec4-012f552b8447_Tutor%20Improvements.docx";
    downloadLink.href = url;
    let filename = "exmaple.docx";
    if (filename)
      downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();


  }
  change(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning(' Please upload pdf and doc file formats only')
        event.target.value = ''
      }
    }
  }
  writeExam(data) {
    this.route.navigate(['HOME/iscribe'], { queryParams: { id: data.ASSIGNMENT_ID, cId: this.courceId } })
  }
  // downloadEvaluateAssignment(data){
  //   let link=data.EV_ASSIGNMENT_UPLOAD;
  //   if(link){
  //   let url =this.CommonService.fileUrl;
  //   link = link.substr(1);
  //   window.open(url+ '/Assignments'+ link, '_blank');
  //   }else{
  //     this.toastr.warning('File Not uploaded');
  //   }
  // }
  downloadEvaluateAssignment(filePath: string) {
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
