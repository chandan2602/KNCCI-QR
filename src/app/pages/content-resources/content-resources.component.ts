import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
declare var $: any

@Component({
  selector: 'app-content-resources',
  templateUrl: './content-resources.component.html',
  styleUrls: ['./content-resources.component.css']
})
export class ContentResourcesComponent implements OnInit {
  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = []
  data: any = {};
  TenantCode: string = sessionStorage.getItem('TenantCode');
  assessments: Array<any> = [];
  assessmentId: string = ''
  isParam: boolean = false;
  courseNames: Array<any> = [];
  Materialnames: Array<any> = [];
  cId: String = '';
  videoLink: String = null;
  iframe: any = null;
  selectedData: any = {};
  startTime: string;
  visualContent: string = null;

  constructor(private CommonService: CommonService, active: ActivatedRoute, private sanitizer: DomSanitizer, private toastr: ToastrService,) {

    active.queryParams.subscribe((res) => {
      if (res) {
        this.courceId = res.Id ? res.Id : '';
        this.schedulId = res.CourseScheduleId ? res.CourseScheduleId : '';
        this.isParam = (this.courceId && this.schedulId) ? true : false;
        if (this.courceId) {
          this.courceChange();
        }
        if (this.courceId && this.schedulId) {
          this.schedulChange();
        }
      }
    })
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


  // getCourses() {
  //   this.activeSpinner();
  //   this.CommonService.getCourses().subscribe((res: any) => {
  //     this.deactivateSpinner();
  //     this.cources = res
  //     console.log(res)
  //   }, e => { this.deactivateSpinner(); })
  // }


  getCourses() {
    let roleId = sessionStorage.getItem('RoleId')
    if(roleId=='1'){
      this.activeSpinner();
      this.CommonService.getCall('Courses/GetAdminCoursesByPredefined/'+sessionStorage.getItem('UserId')+'/'+sessionStorage.getItem('RoleId')+'/'+sessionStorage.getItem('TenantCode')).subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    },e=>{      this.deactivateSpinner();})

    }
    else if (roleId=='3') {
      this.activeSpinner();
      this.CommonService.getCall('Courses/GetCoursesByPrdefined/'+sessionStorage.getItem('UserId')+'/'+sessionStorage.getItem('RoleId')).subscribe((res: any) => {
        this.deactivateSpinner();
        this.cources = res
      }, e => { this.deactivateSpinner(); })

    }
    
  }


  // courceChange() {
  //   let data = {
  //     "CourseId": this.courceId,
  //     "USERID": sessionStorage.getItem('UserId'),
  //   }
  //   this.activeSpinner();
  //   this.CommonService.postCall('CourseSchedule/GetCourseScheduleByPrdefined', data).subscribe((res: any) => {
  //         console.log(res);
  //     this.deactivateSpinner();
  //     this.scheduls = res;
  //   },e=>{      this.deactivateSpinner();})
  // }

  courceChange() {
    if(sessionStorage.getItem('RoleId')=='1'){
      let payLoad = {
        "CourseId": this.courceId,
        "USERID": sessionStorage.getItem('UserId')
      }
      this.activeSpinner();
      this.CommonService.postCall('CourseSchedule/GetAdminCourseScheduleByPredefined', payLoad).subscribe((res: any) => {
        this.deactivateSpinner();
        this.scheduls = res;
      },e=>{      this.deactivateSpinner();})
    
    }else if(sessionStorage.getItem('RoleId')=='3'){
      let payLoad = {
        "CourseId": this.courceId,
        "USERID": sessionStorage.getItem('UserId')
      }
      this.activeSpinner();
      this.CommonService.postCall('CourseSchedule/GetCourseScheduleByPrdefined', payLoad).subscribe((res: any) => {
        this.deactivateSpinner();
        this.scheduls = res;
      },e=>{      this.deactivateSpinner();})
    }
    }

  schedulChange() {
    // alert(this.schedulId)
    this.activeSpinner();
    let payLoad = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId,
      TenantCode: this.TenantCode,
    }
    this.CommonService.postCall('LearningMeterial/LearningMeterialsByPredefined', payLoad).subscribe((res: any) => {
      this.deactivateSpinner();
      this.data = res;
      this.dataTransfer(res);
      // this.init()
    }, (e) => { this.deactivateSpinner(); })
  }

  OpenUrl(url) {
    window.open(url, '_blank');
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
        return item.chapter_id == cId
      });
      this.Materialnames = filter;

    }

  }
  

  selectChapter(id, index) {

    if (this.cId == id) return
    let material: Array<any> = [];
    material = this.data && this.data.Materialname;

    if (index) {
      let prev = this.courseNames[index - 1];
      let prevId = prev.chapter_id
      let prevMaterial = material.filter((item) => {
        return item.chapter_id == prevId
      });
      let check = prevMaterial.some((item) => {
        return item.CriteriaMessage
      })
      if (check) {
        let f = prevMaterial.filter((item) => {
          return item.CriteriaMessage
        })
        let msg = f[0].CriteriaMessage;
        this.toastr.warning(msg)
        return
      }
    }
    let filter = material.filter((item) => {
      return item.chapter_id == id
    });
    this.Materialnames = filter;
    this.cId = id;
  }

  action(data){
    this.selectedData = data;
    this.startTime = moment().format('MM-DD-YYYY H:mm:ss ');
    let path = data.Cntrepo_filepath.split('/')[data.Cntrepo_filepath.split('/').length - 1];
    let type: string = data.Cntrepo_filepath.split('/')[data.Cntrepo_filepath.split('/').length - 2];
    let prefix = ''
    if (data.content_type == 1) {
      prefix = 'External Link/'
    }  else {
      prefix = 'Normal Content'
    }
    let url = this.CommonService.fileUrl;
    // let link = path.substr(1);
    this.makeEmpty();
    let link = this.CommonService.fileUrl + '/LearningMeterial/LearningMeterialsByPredefined/' + prefix + path;
    if (data.actiontext == 'view') {
      let index=data.Cntrepo_filepath.indexOf('youtu.be');
      if(index>0){
       
    
      window.open( data.Cntrepo_filepath,'newwindow',"width=1000,height=1000,winname,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1000,height=700");
      
      
    }else{
      
      this.openmodel()
      this.iframe = data.Cntrepo_filepath;
      this.visualContent = null;
      this.videoLink = null;
    
    }
  }
    
  }
  //window.open( data.Cntrepo_filepath,'newwindow',"width=1000,height=1000,winname,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1000,height=700")
      



  close() {
    this.makeEmpty();
    return
    let data = {
      CourseId: this.selectedData.CourseId,
      MaterialId: this.selectedData.MATERIAL_ID,
      StartTime: this.startTime,
      PageNo: 1
    }
    this.CommonService.trackMaterialTime(data).subscribe((res: any) => {
    }, (err) => { })
  }
 openmodel(){
   document.getElementById('openpopup').click();
 }
 openIframe(link){
  document.getElementById('openpopup').click();
  this.iframe = link;
  this.visualContent = null;
  this.videoLink = null;
 }
 makeEmpty(){
  this.iframe = null;
  this.visualContent = null;
  this.videoLink = null;
 }



}