import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { FileuploadService } from '../../services/fileupload.service'
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit {
  scheduls: [] = [];
  cource: [] = [];
  cources: [] = [];
  table: Array<any> = [];
  courceId: string = '';
  schedulId: string | number = '';  
  currentEditFile: any;
  events = [];
  discussion = {};
  isDiscussion = false;
  file: File;
  data: any = {};
  isParam: boolean = false;
  courseNames: Array<any> = [];
  Materialnames: Array<any> = [];
  cId: String = '';
  videoLink: String = null;
  audio: String = null;
  iframe: any = null;
  selectedData: any = {};
  startTime: string;
  visualContent: string = null;
  loadFaq: Array<any> = [];
  tId :String = '';
  roleId: number | string = sessionStorage.getItem('RoleId');
  myForm :UntypedFormGroup
  constructor(private route: Router,private fb: UntypedFormBuilder, private commonService: CommonService,private FileuploadService: FileuploadService, private toast: ToastrService) { 
    this.loadCourse();
    this.loadDiscussion();
    this.getCourses();
    this.loadFAQs();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      Header: ['', Validators.required,],
      ContentText: ['', Validators.required],
    })
  }

  activeSpinner(){
    this.commonService.activateSpinner();
  }

  deactivateSpinner(){
    this.commonService.deactivateSpinner()
  }

  loadCourse() {
    this.commonService.activateSpinner()
    this.commonService.getCall(`Courses/GetCourses/${sessionStorage.getItem('UserId')}/${sessionStorage.getItem('RoleId')}`).subscribe((res: any) => {
      this.cource = res;
      this.commonService.deactivateSpinner()
    }, e => {
      this.commonService.deactivateSpinner()
    })
  }

  loadDiscussion() {
    this.events = []
    let payload = {
      "TenantCode": sessionStorage.getItem('TenantCode'),
      "RoleId": sessionStorage.getItem('RoleId'),
    }
    this.commonService.postCall("Forums/GetList", payload).subscribe((response: any) => {
      this.events = response;
      console.log(response)
    })
  }

  getDiscussion(ForumId) {
    console.log(ForumId)
    let payload = {
      "ForumId": ForumId,
      "TenantCode": sessionStorage.getItem('TenantCode')
    }
    this.commonService.postCall("Forums/Get", payload).subscribe((response: any) => {
      this.isDiscussion = true;
      this.discussion = response;
      console.log(response)
    })
  }

  getCourses() {
    this.activeSpinner();
    this.commonService.getCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    },e=>{  this.deactivateSpinner();})
  }

  courceChange() {
    this.activeSpinner();
    let data = {
      "CourseId":this.courceId
    }
    this.commonService.getCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.scheduls = res;
    },e=>{ this.deactivateSpinner();})
  }
  schedulChange() {
    this.activeSpinner();
    let data = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId
    }
    this.commonService.getAssignments(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.table = res;
    },e=>{
      this.deactivateSpinner();
    })
  }

  edit(item) {
    this.currentEditFile = item;
  
  }

  change(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf']
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toast.warning(' Please upload pdf and doc file formats only')
        event.target.value = ''
      }
    }
  }

  save() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('AssignmentId',this.currentEditFile.ASSIGNMENT_ID);
    formData.append('UserId',sessionStorage.getItem('UserId'));
    formData.append('ClientDocs','ClientDocs');
    formData.append('Course',this.courceId)
    this.FileuploadService.upload(formData,'Assignments/SubmitAssignments').subscribe((res: any) => {
      if( res.message =='Information Saved Successfully'){
         this.toast.success(res.message);
        document.getElementById('md_close').click()
      }else{
        
      }
      
    }, err => {})
  }

  getLink1(link: string) {
    let url =this.commonService.fileUrl;
    link = link.substr(1);
    window.open(url+ '/Assignments'+ link, '_blank')
  }

  download1(id: string) {
    let fileType = id.substr(id.length - 3)
    if (fileType == 'pdf') {
      this.getLink1(id)
    }
    else {
      let http = this.commonService.http;
      let url = this.commonService.fileUrl;
      http.get(url+'/Assignments' + id.substr(1), { responseType: 'blob' }).subscribe((res) => {
        let dataType = res.type;
        let binaryData = [];
        binaryData.push(res);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        let filename = "exmaple.docx"
        if (filename)
          downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }, (e) => { 
        this.toast.warning("file not found ")
       })
    }

  }

  downloadEvaluateAssignment(data){
    let link=data.EV_ASSIGNMENT_UPLOAD;
    if(link){
    let url =this.commonService.fileUrl;
    link = link.substr(1);
    window.open(url+ '/Assignments'+ link, '_blank');
    }else{
      this.toast.warning('File Not uploaded');
    }
  }

  close() {
    document.getElementById('close').click()
  }


  schedulChange1() {
    // alert(this.schedulId)
    this.activeSpinner();
    let data = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId
    }
    this.commonService.getLearningMeterial(data).subscribe((res: any) => {
      console.log(res);
      this.deactivateSpinner();
      this.data = res;
      console.log(this.data);
      this.dataTransfer(res);
      // this.init()
    }, (e) => { this.deactivateSpinner(); })
  }

  dataTransfer(data) {
    this.courseNames = data && data.courseNames;
    this.courseNames = this.courseNames.sort((a, b) => { return a.ID - b.ID })
    let material: Array<any> = [];
    material = data && data.Materialname;
    if (this.courseNames.length && material.length) {
      let cId = this.courseNames[0].ChapterId;
      this.cId = cId;
      let filter = material.filter((item) => {
        return item.ChapterId == cId
      });
      //this.Materialnames = filter;

    }
    console.log(this.courseNames);

  }


  selectChapter(id, index) {
    console.log(id,'bye')
    this.Materialnames=[];
    if (this.cId == id) return
    let material: Array<any> = [];
    material = this.data && this.data.Materialname;

    if (index) {
      let prev = this.courseNames[index - 1];
      let prevId = prev.ChapterId
      let prevMaterial = material.filter((item) => {
        return item.ChapterId == prevId
      });
      let check = prevMaterial.some((item) => {
        return item.CriteriaMessage
      })
      if (check) {
        let f = prevMaterial.filter((item) => {
          return item.CriteriaMessage
        })
        let msg = f[0].CriteriaMessage;
        this.toast.warning(msg)
        return
      }
    }
    let filter = material.filter((item) => {
      return item.ChapterId == id
    });
    this.Materialnames = filter;
    this.cId = id;
  }
  

  download(data) {
    console.log(data,'hai')
    // let path = data.MATERIAL_PATH;;
    // let url = this.CommonService.fileUrl
    // let link = path.substr(1);
    let path = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 1];
    let type: string = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 2];
    let prefix = ''
    if (type.toLowerCase() == 'adminfiles') {
      prefix = 'Uploaded Material/'
    } else if (type.toLowerCase() == 'videos') {
      prefix = 'Webinar Info/'
    } else {
      prefix = 'E-Learning Material'
    }
    let url = this.commonService.fileUrl + '/LearningMeterial/MaterialDownload/' + prefix + path;
    let ext = path.split('.').pop();
    if (ext == 'pdf') {
      this.openIframe(url + '?page=hsn#toolbar=0');
    } else {
      window.open(url, '_blank')
    }
  }
  getLink(link: string) {
    let path = link.split('/')[link.split('/').length - 1];
    let type: string = link.split('/')[link.split('/').length - 2];
    let prefix = ''
    if (type.toLowerCase() == 'adminfiles') {
      prefix = 'Uploaded Material/'
    } else if (type.toLowerCase() == 'videos') {
      prefix = 'Webinar Info/'
    } else if ('Audio') {
      prefix = 'Audio/'
    }
    else {
      prefix = 'E-Learning Material'
    }
    // let url = 'http://lmstest.dhanushinfotech.com'
    // link = link.substr(1);
    let url = this.commonService.fileUrl + '/LearningMeterial/MaterialDownload/' + prefix + path;
    // return url+link;
    window.open(url, '_blank')
  }

  
  action(data) {
    console.log(data,'hai')
    this.selectedData = data;
    this.startTime = moment().format('MM-DD-YYYY H:mm:ss ');
    let path = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 1];
    let type: string = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 2];
    let prefix = ''
    if (type.toLowerCase() == 'adminfiles') {
      prefix = 'Uploaded Material/'
    } else if (type.toLowerCase() == 'videos') {
      prefix = 'Webinar Info/'
    } else if ('Audio') {
      prefix = 'Audio/'
    }
    else {
      prefix = 'E-Learning Material'
    }
    let url = this.commonService.fileUrl;
    // let link = path.substr(1);
    let link = this.commonService.fileUrl + '/LearningMeterial/MaterialDownload/' + prefix + path;
    if (data.ACTIONTEXT == 'Watch Video') {
      this.openmodel()
      this.iframe = null;
      this.visualContent = null;
      this.videoLink = link;
      this.audio = null;
    } else if (data.ACTIONTEXT == 'Visual Content') {
      this.openmodel()
      this.iframe = null;
      this.visualContent = data.MATERIAL_PATH;
      this.videoLink = null;
      this.audio = null;
    } else if (data.ACTIONTEXT == 'Play') {
      this.openmodel()
      this.iframe = null;
      this.visualContent = null;
      this.videoLink = null;
      this.audio = link;
    }
    else if (data.ACTIONTEXT == 'View') {
      let index = data.MATERIAL_PATH.indexOf('www.youtube.com');
      if (index > 0) {
        this.openmodel()
        this.iframe = null;
        this.visualContent = null;
        this.videoLink = link;
        this.audio = null;
      } else {
        window.open(data.MATERIAL_PATH, 'newwindow', "width=700,height=500,winname,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350")
      }
    }
    else {
      this.openmodel()
      this.videoLink = '';
      this.iframe = link
      // ' http://lmstest.dhanushinfotech.com/Admin/E-Material_Images/'
    }
  }

  openmodel() {
    document.getElementById('openpopup').click();
  }
  openIframe(link) {
    document.getElementById('openpopup').click();
    this.iframe = link;
    this.visualContent = null;
    this.videoLink = null;
    this.audio = null;
  }

 
  loadFAQs() {  
   
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE:this.tId|| sessionStorage.getItem('TenantCode'),
      "ContentType": 100
    }
    this.commonService.postCall("LoadDisplayFAQs", payLoad).subscribe((res: any) => {
      // table.destroy();
     
      this.loadFaq = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }
  onSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload.TENANT_CODE = sessionStorage.getItem('TenantCode');
    payload.CREATEDBY = sessionStorage.getItem('UserId');
    this.commonService.postCall('CreateDisplayFAQs', payload).subscribe((res) => {
      this.toast.success("FAQ's Created Successfully");
      document.getElementById('md_close')?.click()
      this.loadFAQs();
    }, err => {  this.toast.error(err.error ? err.error : "Create Display FAQs not created ") })
  }

  
}
