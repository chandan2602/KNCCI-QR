import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-add-asseement-questioniare',
  templateUrl: './add-asseement-questioniare.component.html',
  styleUrls: ['./add-asseement-questioniare.component.css']
})
export class AddAsseementQuestioniareComponent extends BaseComponent implements OnInit {

  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any={};
  courceId: string = "";
  courses: Array<any> = [];
  shedules: Array<any> = [];
  courseObjectives: Array<any> = [];
  levels: Array<any> = []
  chapters: Array<any> = [];
  qType: string|number = '0';
  qId:string;
  file: File;
  fileName: any;
  options: any={}
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService,  toastr: ToastrService, private active: ActivatedRoute, private FileuploadService: FileuploadService) {
    super(CommonService,toastr)
    let id = this.active.snapshot.paramMap.get('id');
   
     active.queryParams.subscribe((res)=>{
       if(res.qId) {this.qId=res.qId}
     })
  }


  ngOnInit(): void {
    this.getCourses();
    this.getLevel()
    this.myForm = this.fb.group({
      QUESTION_COURSE: ['', Validators.required],
      COURSE_OBJECTIVE: ['', Validators.required],
      QUESTION_CS_ID: ['', Validators.required],
      QUESTION_CHAPTER: ['', Validators.required],
      LEVELID: ['', Validators.required],
      ASSESSMENT_QUESTIONTYPE: [0, Validators.required],
      IsOptionRandom: ['',],
      QuestionStatus: ['1', Validators.required],
      QUESTION_QUESTION: ['', [Validators.required, Validators.minLength(3)]],
      QuestionImage: [''],
      QUESTION_ANSWER: [''],
      formArray: this.fb.array([])
    });
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    for (let i in [1, 2]) {
      let grp: UntypedFormGroup = this.getOptionGroup()
      arrayControl.push(grp);
    }
    this.setDefault();
    if(this.qId){
      this.getEditData()
    }
  }


  getEditData():void{
    this.isEdit=true;
    this.activeSpinner();
    this.CommonService.postCall('EditAssessmentQuestionaries',{"QUESTION_ID":this.qId}).subscribe((res:any)=>{
      this.editData=res.dtQuestionBank&&res.dtQuestionBank[0];
      this.options=res.dt_options||[];
      this.dataTransfer();
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner()})
  }


  dataTransfer(){
    let controls=this.myForm.controls;
    Object.keys(controls).map(key=>{
      if(key!='formArray'){
      let ctrl=controls[key];
      ctrl.setValue(this.editData[key])
      }
    })
    this.courseChange()
    controls['ASSESSMENT_QUESTIONTYPE'].setValue(this.editData['ASSESSMENT_QUESTIONTYPE']?1:0);
    controls['QuestionStatus'].setValue(this.editData['QUESTION_STATUS']?1:0);
    controls['QuestionImage'].setValue(this.editData['QUESTION_IMAGE']);
    this.fileName=this.editData['QUESTION_IMAGE'];
    this.changeType();
    this.addOptions()
  }  
  addOptions(){
    if(!this.editData['ASSESSMENT_QUESTIONTYPE']){
      let ans=this.editData['QUESTION_ANSWER']
      this.options.map((data,index)=>{
       let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
       if(index>1){
         this.add()
       }
       let controls=arrayControl.controls[index]['controls'];
       controls['option'].setValue(data.QSTOPT_OPTION);
       if(ans==data.QSTOPT_OPTION){
        controls['correct'].setValue(index)
       }
      })
    }

  }

  getOptionGroup() {
    let newGroup = this.fb.group({
      option: ['', [Validators.required, Validators.minLength(1)]],
      correct: []
    });
    return newGroup
  }



  getLevel() {
    this.CommonService.getCall('GetLevelofDifficulty').subscribe((res) => {
      this.levels = res;
    }, err => { })
  }
  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.courses = res;
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
  }
  courseChange() {
    let payload = {
      COURSE_OBJECTIVE_COURSE_ID: this.courceId
    };
    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner()
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.shedules = res;
    }, e => { this.deactivateSpinner() });
    this.CommonService.postCall('CourseObjectiveByCourseId', payload).subscribe((res: any) => {
      this.courseObjectives = res;
    }, err => {

    });
    this.loadChapters()
    
  }
  loadChapters() {
    let payload = {
      "CHAPTER_COURSE_ID": this.courceId,
    }
    this.CommonService.postCall('GetChaptersByCourseId', payload).subscribe((res: any) => {
      this.chapters = res;
    
    }, err => { this.chapters = [];  })

  }

  setDefault() {
    let ctrl = this.myForm.controls;

  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  onSubmit(form: UntypedFormGroup) {
    let ans
    let value: any = this.myForm.value;
    let payload: any ={}
    Object.keys(value).map((key)=>{
    if(key!='formArray'){
      payload[key]=value[key]
    }
    })
    let check: boolean = true
    if (this.qType == '0') {
      let formArrayValue: Array<any> = this.myForm.controls.formArray.value
      let index = formArrayValue.findIndex(x => x.correct !=null);
      if (index < 0) { this.toastr.warning('Please select answer'); check = false; return }
      ans = formArrayValue[index]['option'];
      for (let i in formArrayValue) {
        let index = parseInt(i) + 1
        let key = 'QUESTION_OPTION' + index
        payload[key] = formArrayValue[i].option
      }

    }
    if (check) {
      this.activeSpinner()
      payload.QUESTION_ANSWER = ans||  value.QUESTION_ANSWER ;
      payload.QUESTION_TYPE=1;
      if(value.ASSESSMENT_QUESTIONTYPE==0){
        payload.QUESTION_OPTION='';
      }else{
        payload.QUESTION_OPTION=payload.QUESTION_ANSWER
      }
  
      //  delete payload['formArray'];
       payload.CREATEDBY=sessionStorage.getItem('UserId');
       payload.LASTMDFBY=payload.CREATEDBY;
       payload.TENANT_CODE=sessionStorage.getItem('TenantCode')
       if(this.isEdit){
         payload.QUESTION_ID=this.qId
         this.CommonService.postCall('UpdateAssessmentQuestionaries',payload).subscribe((res:any)=>{
          this.toastr.success("Information updated successfully ");
          window.history.back();
          this.deactivateSpinner()
        },err=>{
         this.toastr.error(" not updated");
         this.deactivateSpinner()
        })
       }else{
         this.CommonService.postCall('CreateAssessmentQuestionaries',payload).subscribe((res:any)=>{
           this.toastr.success("Information saved successfully");
           window.history.back();
           this.deactivateSpinner()
         },err=>{
          this.toastr.error(" not created");
          this.deactivateSpinner()
         })

       }

    }


  }


  add() {
    if (!this.myForm.valid) { this.toastr.warning("Please Enter the all mandatory fields"); return }
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let grp: UntypedFormGroup = this.getOptionGroup()
    arrayControl.push(grp)
  }
  delete() {
    const arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    let index = arrayControl.length;
    arrayControl.removeAt(index - 1)
  }
  isVisable() {
    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl && arrayControl.controls.length > 2) {
      return true
    }
    else {
      return false
   
    }
  }
  isAdd() {

    let arrayControl = <UntypedFormArray>this.myForm.controls['formArray'];
    if (arrayControl && arrayControl.controls.length > 9) {
      return false
    }
    else {
      return true
    }

  }

  changeType() {
    let ansControl: any = this.myForm.get('QUESTION_ANSWER')
    let arrayControl: any = <UntypedFormArray>this.myForm.controls['formArray']['controls'];
    if (this.qType == '1') {
      arrayControl.map((control) => {
        let ctrl: UntypedFormControl = control.controls.option;
        ctrl.clearValidators();
        ctrl.updateValueAndValidity()
      })
      ansControl.setValidators([Validators.required])
      ansControl.updateValueAndValidity();
    } else {
      arrayControl.map((control) => {
        let ctrl: UntypedFormControl = control.controls.option;
        ctrl.setValidators([Validators.required])
        ctrl.updateValueAndValidity()
      })
      ansControl.clearValidators();
      ansControl.updateValueAndValidity();
    }
  }
  changeFile(event) {
    if(!this.courceId){this.toastr.warning("Please select the cource");return}
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['xls', 'xlr', 'xlsx', ]
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload()
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
      formData.append('Course', this.courceId);
      this.activeSpinner();
      this.FileuploadService.upload(formData, 'AssessmentQuestionarie/UploadAssessmentQuestionaries').subscribe((res: any) => {
        try {
          this.fileName = res.path;
          if (this.fileName) {
            this.deactivateSpinner()
            this.myForm.controls['QuestionImage'].setValue(this.fileName)
          }
        } catch (e) {
          console.log(e)
        }
  
      }, err => { this.deactivateSpinner(); })
    }
}
