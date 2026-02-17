import { Component, OnInit } from '@angular/core';
import { getWeekYearWithOptions } from 'date-fns/fp';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-upload-template',
  templateUrl: './upload-template.component.html',
  styleUrls: ['./upload-template.component.css']
})
export class UploadTemplateComponent extends BaseComponent implements OnInit {
  courses:Array<any>=[
    {
      COURSE_ID:'CourseCategory',
      COURSE_NAME:'Course Category'
    },
    {
      COURSE_ID:'Course',
      COURSE_NAME:'Course'
    },
    {
      COURSE_ID:'CourseSchedule',
      COURSE_NAME:'Course Schedule'
    },
    {
      COURSE_ID:'ProgramOutcomes',
      COURSE_NAME:'Program Outcomes'
    },
    {
      COURSE_ID:'TrainerRegistration',
      COURSE_NAME:'Trainer Registration'
    },
    {
      COURSE_ID:'AssessmentQuestionaire',
      COURSE_NAME:'Assessment Questionaire'
    },
    {
      COURSE_ID:'AssignTrainerCourse',
      COURSE_NAME:'Assign Trainer - Course'
    },
    {
      COURSE_ID:'CourseScheduleTrainer',
      COURSE_NAME:'Course - Schedule Trainer'
    },
    {
      COURSE_ID:'ExamResults',
      COURSE_NAME:'Exam Results'
    }
  ]
  constructor(CommonService: CommonService,  toastr: ToastrService,private FileuploadService: FileuploadService) {
    super(CommonService,toastr);
   }

  ngOnInit(): void {
  }
  courseChange(){}

  changeFile(event) {
    if(!this.courseId){this.toastr.warning("Please select Excel Template");
    event.target.value = ''
    return}
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['xls', 'xlr', 'xlsx', ]
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        return
        
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload Xls,xlsx file formats only.')
        event.target.value = ''
      }
    }
    }
    upload() {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('ClientDocs', 'ClientDocs');
      formData.append('Course', this.courseId);
      this.activeSpinner();
      this.FileuploadService.upload(formData, 'AssessmentQuestionarie/UploadAssessmentQuestionaries').subscribe((res: any) => {
        try {
          this.fileName = res.path;
          if (this.fileName) {
            this.deactivateSpinner()
           
          }
        } catch (e) {
          console.log(e)
        }
  
      }, err => { this.deactivateSpinner(); })
    }
  submit(){
    if(!this.courseId||!this.file)
   this.activeSpinner();
   let type=this.courseId;
   let tenantCode=this.TenantCode;
   let userId=this.userId;
   let payload={
    file:this.file
   }
   const formData = new FormData();
   formData.append('file', this.file);
   let url='ExcelUpload/TemplateType/'+type+'/'+tenantCode+'/'+userId;
   this.CommonService.postCall(url,formData).subscribe((res)=>{
     this.deactivateSpinner();
     this.toastr.success("Successfully Uploaded")
   },e=>{
     this.deactivateSpinner();
     this.toastr.error(e.error?e.error.text||e.error:e||'Something is wrong! Please Try later')
   })


  }
}
