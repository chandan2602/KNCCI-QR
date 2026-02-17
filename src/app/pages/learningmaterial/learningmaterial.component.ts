import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
declare var $: any
@Component({
  selector: 'app-learningmaterial',
  templateUrl: './learningmaterial.component.html',
  styleUrls: ['./learningmaterial.component.css']
})
export class LearningmaterialComponent implements OnInit {

  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = []
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
  IsShowModel: boolean = false;


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

  getCourses() {
    this.activeSpinner();
    this.CommonService.getCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    }, e => { this.deactivateSpinner(); })
  }

  courceChange() {
    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner();
    this.CommonService.getCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.scheduls = res;
    }, e => { this.deactivateSpinner(); })
  }
  schedulChange() {
    // alert(this.schedulId)
    this.activeSpinner();
    let data = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId
    }
    this.CommonService.getLearningMeterial(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.data = res;
      this.dataTransfer(res);
      this.courseNames = this.courseNames.filter(e => e.ChapterName != "Final Assessment");
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
        return item.ChapterId == cId
      });
      this.Materialnames = filter;

    }

  }
  selectChapter(id, index) {

    if (this.cId == id) return
    let material: Array<any> = [];
    material = this.data && this.data.Materialname
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
        this.toastr.warning(msg)
        return
      }
    }
    let filter = material.filter((item) => {
      return item.ChapterId == id
    });
    this.Materialnames = filter;
    this.cId = id;


  }

  showOrHideModel(isshow: boolean = true) {
    this.IsShowModel = isshow;
    if (isshow)
      setTimeout(() => document.getElementById('btnShowModel').click(), 100);
  }

  download(data) {
    // let path = data.MATERIAL_PATH;;
    // let url = this.CommonService.fileUrl
    // let link = path.substr(1);
    let path = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 1];
    let type: string = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 2];
    let prefix = ''
    if (type?.toLowerCase() == 'adminfiles') {
      prefix = 'Uploaded Material/'
    } else if (type?.toLowerCase() == 'videos') {
      prefix = 'Webinar Info/'
    } else {
      prefix = 'E-Learning Material'
    }
    // let url = this.CommonService.fileUrl + '/LearningMeterial/MaterialDownload/' + prefix + path;
    let url = this.CommonService.fileUrl + data.MATERIAL_PATH;
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
    if (type?.toLowerCase() == 'adminfiles') {
      prefix = 'Uploaded Material/'
    } else if (type?.toLowerCase() == 'videos') {
      prefix = 'Webinar Info/'
    } else if (type?.toLowerCase() == 'Audio') {
      prefix = 'Audio/'
    }
    else {
      prefix = 'E-Learning Material'
    }
    // let url = 'http://lmstest.dhanushinfotech.com'
    // link = link.substr(1);
    let url = this.CommonService.fileUrl + '/LearningMeterial/MaterialDownload/' + prefix + path;
    // return url+link;
    window.open(url, '_blank')
  }


  action(data) {
    this.selectedData = data;
    this.startTime = moment().format('MM-DD-YYYY H:mm:ss ');
    let path = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 1];
    let type: string = data.MATERIAL_PATH.split('/')[data.MATERIAL_PATH.split('/').length - 2];
    let prefix = ''
    if (type?.toLowerCase() == 'adminfiles') {
      prefix = 'Uploaded Material/'
    } else if (type?.toLowerCase() == 'videos') {
      prefix = 'Webinar Info/'
    } else if (type?.toLowerCase() == 'Audio') {
      prefix = 'Audio/'
    }
    else {
      prefix = 'E-Learning Material'
    }
    let url = this.CommonService.fileUrl;
    // let link = path.substr(1);
    // let link = this.CommonService.fileUrl + '/LearningMeterial/MaterialDownload/' + prefix + path;
    let link = this.CommonService.fileUrl + data.MATERIAL_PATH;
    if (data.ACTIONTEXT == 'Watch Video') {
      this.openmodel()
      this.iframe = null;
      this.visualContent = null;
      // this.videoLink = link;
      this.videoLink = link;
      this.audio = null;
    } else if (data.ACTIONTEXT == 'Visual Content') {
      this.openmodel()
      this.iframe = null;
      this.visualContent = data.MATERIAL_PATH;
      this.videoLink = null;
      this.audio = null;
    } else if (data.ACTIONTEXT == 'Play') {
      this.openmodel();
      this.iframe = null;
      this.visualContent = null;
      this.videoLink = null;
      this.audio = link;
    }
    else if (data.ACTIONTEXT == 'View') {
      let index = data.MATERIAL_PATH.indexOf('www.youtube.com');
      if (index > 0) {
        this.openmodel();
        // https://www.youtube.com/embed/AydEs4WCro8?disablekb=1&modestbranding=1&iv_load_policy=3&rel=0&autoplay=1
        const video_id: string = data.MATERIAL_PATH.split('v=')[1];
        this.iframe = `https://www.youtube.com/embed/${video_id}?disablekb=1&modestbranding=1&iv_load_policy=3&rel=0&autoplay=1`;
        this.visualContent = null;
        this.videoLink = null;
        this.audio = null;
      } else {
        window.open(data.MATERIAL_PATH, 'newwindow', "width=700,height=500,winname,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350")
      }
    }
    else {
      this.openmodel();
      this.videoLink = '';
      this.iframe = link
      // ' http://lmstest.dhanushinfotech.com/Admin/E-Material_Images/'
    }
  }

  close() {
    this.showOrHideModel(false);
    let data = {
      CourseId: this.selectedData.CourseId,
      MaterialId: this.selectedData.MATERIAL_ID,
      StartTime: this.startTime,
      PageNo: 1
    }
    this.CommonService.trackMaterialTime(data).subscribe((res: any) => {
    }, (err) => { })
  }
  openmodel() {
    // document.getElementById('openpopup').click();
    this.showOrHideModel();
  }
  openIframe(link) {
    // document.getElementById('openpopup').click();
    this.showOrHideModel();
    this.iframe = link;
    this.visualContent = null;
    this.videoLink = null;
    this.audio = null;
  }
}
