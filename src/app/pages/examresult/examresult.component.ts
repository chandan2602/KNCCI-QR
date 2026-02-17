import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-examresult',
  templateUrl: './examresult.component.html',
  styleUrls: ['./examresult.component.css']
})
export class ExamresultComponent implements OnInit {
  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = [];
  data: any = {}
  assessments: Array<any> = [];
  assessmentId: string = '';
  results:Array<any>=[]
  constructor(private CommonService: CommonService,private toastr: ToastrService) {
    this.getCourses()
  }

  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }

  ngOnInit(): void {
  }

  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    },e=>{ this.deactivateSpinner();})
  }

  courceChange() {
    this.activeSpinner();
    let data = {
      "CourseId": this.courceId
    }
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.scheduls = res;
      this.deactivateSpinner();
    },e=>{
      this.deactivateSpinner();
    })
  }
  schedulChange() {
    this.activeSpinner();
    this.CommonService.loadAssessmentDropdown(this.courceId, this.schedulId).subscribe((res: any) => {
      this.deactivateSpinner();
      this.assessments = res;
    },e=>{ this.deactivateSpinner();})
  }
  assessmentChange(){
    this.activeSpinner();
    this.results=[];
    this.CommonService.getStudentResult(this.schedulId,this.assessmentId==''?0:this.assessmentId).subscribe((res:any)=>{
   
      this.deactivateSpinner();
      this.results=res;
    },e=>{ this.deactivateSpinner();})
  }
  submit(){
    // let check=this.results.some(x=>x.EXM_MARKS==undefined);
    this.activeSpinner();
    let data={
      CourseId:this.courceId,
      CourseScheduleId:this.schedulId,
      AssesmentId:this.assessmentId,
      ExamMarks:[]
    }
      let array:Array<any>=[];
      this.results.map((item)=>{
        let obj={
          StudentId:item.UserId,
          ExamId:item.EXM_ID||0 ,
          Marks:item.EXM_MARKS||0
        }
        array.push(obj)
      })
      data.ExamMarks=array;
      this.CommonService.setStudentResult(data).subscribe((res)=>{
         
        // alert('Information Saved Successfully');
        this.deactivateSpinner();
        this.toastr.success('Information Saved Successfully');
        this.clearAll();
        // setTimeout(()=>location.reload(),100)
      },err=>{
        this.toastr.error('Error')
        this.deactivateSpinner();})
  }
  clearAll(){
    this.courceId='';
    this.schedulId='';
    this.assessmentId='';
    this.results=[];
  }
}
