import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators,} from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
@Component({
  selector: 'app-addsurvey',
  templateUrl: './addsurvey.component.html',
  styleUrls: ['./addsurvey.component.css']
})
export class AddsurveyComponent extends BaseComponent implements OnInit {

  myForm: UntypedFormGroup;
  cources: Array<any> = [

  ];
  courceId: string = '';
  dropdownSettings: any = {}
  selectedItems: { item_id: number; item_text: string; }[];
  dropdownList: { item_id: number; item_text: string; }[] = []
  isData: boolean;
  surveyId: string;
  startDate: any;
  endDate: any;
  isEdit:boolean=false;
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService, active: ActivatedRoute,  toastr: ToastrService,private location:Location ) {
    super(CommonService,toastr);
    this.getCourses();
    active.queryParams.subscribe((res) => {
      if (res.edit) {
        this.surveyId = res.edit;
      
      }
    })
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      SurveyTitle: ['', Validators.required,],
      ASSIGNMENT_COURSE: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Description: ['', Validators.required],
      QuestionPerPage: ['', Validators.required],
      FinalWords: ['', Validators.required]
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    if (this.surveyId) {
      this.getSurveyData();
      this.isEdit=true;
    }
   
  }

  getSurveyData() {
    let data = {
      "SurveyId": this.surveyId
    }
    this.CommonService.postCall('EditSurvey', data).subscribe((res: any) => {
      let Table = res.dtpoll && res.dtpoll[0];
      if (Object.keys(Table).length) {
        this.myForm.controls['SurveyTitle'].setValue(Table.SurveyTitle);
        this.startDate = Table.StartDate;
        this.endDate = Table.EndDate;
        let qPage =Table.QuestionPerPage.toString() // ( ? 1 : 0).toString()
        this.myForm.controls['QuestionPerPage'].setValue(qPage)
        this.myForm.controls['Description'].setValue(Table.Description);
        this.myForm.controls['FinalWords'].setValue(Table.FinalWords)
        let table1 = res.dtpollCourse;
        let cources = []
        table1.map((item) => {
          let id = item.CourseId;
          let index = this.dropdownList.findIndex(data => data.item_id == id);
          if (index > -1) {
            cources.push(this.dropdownList[index])
          }
        });
        //  this.myForm.controls['ASSIGNMENT_COURSE'].setValue(cources)
        this.selectedItems = cources;
      }

    }, err => { console.log(err) })

  }
  onItemSelect(e) { }
  onSelectAll(e) { }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.cources = res;
      res.map(item => {
        let obj = {
          item_id: item.COURSE_ID,
          item_text: item.COURSE_NAME
        }
        this.dropdownList.push(obj)
      })
      this.isData = true
      this.deactivateSpinner()
    }, e => {
      this.isData = true
      this.deactivateSpinner()
    })
  }

  onSubmit(form: UntypedFormGroup) {
    let data = form.value;

    let postData: any = {};
    postData.SurveyTitle = data.SurveyTitle;
    postData.QuestionPerPage = data.QuestionPerPage;
    postData.StartDate = data.StartDate;
    postData.EndDate = data.EndDate;
    postData.Description = data.Description;
    postData.FinalWords = data.FinalWords
    postData.TenantCode = sessionStorage.getItem('TenantCode');
    let cources = null;

    data.ASSIGNMENT_COURSE.map((item) => {
      let id = item.item_id;
      if (cources) {
        cources = cources + ',' + id
      } else {
        cources = id
      }

    })
    postData.CourseId = cources;
    if (this.surveyId) {
      postData.SurveyId = this.surveyId;
      postData.ModifiedBy=sessionStorage.getItem('UserId')
      this.CommonService.postCall('UpdateSurvey', postData).subscribe((res) => {

        this.location.back()
        this.toastr.success('Survey updated Successfully')
      }, err => {this.toastr.error(err.error?err.error:'survey Not Updated') ;console.log(err) })
    } else {
      postData.CreatedBy=sessionStorage.getItem('UserId')
      this.CommonService.postCall('CreateSurvey', postData).subscribe((res) => {
        this.location.back()
        this.toastr.success(' Survey  created successfully')
      }, err => {this.toastr.error(err.error?err.error:'survey Not Updated') ; console.log(err) })
    }
  }
}
