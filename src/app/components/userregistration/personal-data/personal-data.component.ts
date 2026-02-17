import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { constants } from 'src/app/constants';
import { dataDictionary } from 'src/app/dataDictionary';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  myform: UntypedFormGroup;
  titles: Array<any> = [];
  genders: Array<any> = [];
  marriageStatus: Array<any> = [];
  branchs: Array<any> = [];
  maxDate: any = moment().format('yyyy-MM-DD');
  @Input() editData: any = {}
  @Input() parent: EditUserRegistrationComponent;
  changed: boolean = false;
  personalData: any = {};
  years: any;
  roleId: number = 1;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,) {
    this.getAll()
  }

  ngOnInit(): void {
    this.myform = this.fb.group({
      Title: [38],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      dob: ['', Validators.required],
      Gender: ['', Validators.required],
      MartialStatus: [135],
      idNumber: ['03B41C025'],
      Branch: [8109],
      status: [''],
      ParentRelationShip: ['s'],
      ParentMobileNumber: ['7878787825'],
      ParentName: ['Parent 125'],
      YearOfRegistration: [6]
    });
    this.parent.childs['UserProfileData'] = this;

     this.validationControls();

  }
  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.personalData = this.editData['Personal'].length && this.editData['Personal'][0];
      this.dataTransform();
      this.getBranch();
    }
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  getAll() {
    this.activeSpinner();

    let title = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Title });//title
    let gender = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Gender });//getgender
    let marriageStatus = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.MaritalStatus });//GetMarriageStatus
    forkJoin([title, gender, marriageStatus]).subscribe((res) => {
      this.deactivateSpinner();
      [this.titles, this.genders, this.marriageStatus] = [...res]
      // this.titles=res[0];this.registrationTitle=res[1];this.genders=res[2] "YYYY-MM-DD HH:mm:ss
    }, err => {
      console.log(err);
      this.deactivateSpinner()
    })
  }

  getBranch() {
    let payLoad = {
      TENANT_CODE: this.personalData['TenantCode'],
      CREATEDBY: sessionStorage.getItem('UserId'),
      RoleId: sessionStorage.getItem('RoleId')
    }
    let apiUrl = constants['GetAdminCourses'] || 'GetAdminCourses'
    let uri = apiUrl + '/' + sessionStorage.getItem('UserId');
    let id = this.personalData['ROLEID'];
    let code = this.personalData['TenantCode'];
    this.CommonService.getCall(uri + '/' + 1 + '/' + code).subscribe(
      (res: any) => {
        this.branchs = res;
      }
    )
    //  this.CommonService.postCall('GetBranch',payLoad).subscribe(
    //  (res:any)=>{
    //this.branchs=res;
    // }
    // )
  }

  keyPressAlphaNumericwithSlash(event: any) {
    //  var inp = String.fromCharCode(event.keyCode);
    var inp = event.key;
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  dataTransform() {
    let data = this.personalData; this.myform.markAllAsTouched;
    let controls = this.myform.controls;
    if (this.personalData.DOB != '0001-01-01T00:00:00')
      controls['dob'].setValue(moment(this.personalData.DOB).format('yyyy-MM-DD'));
    controls['FirstName'].setValue(data.FIRSTNAME);
    controls['LastName'].setValue(data.LASTNAME);
    controls['Gender'].setValue(data.GENDER);
    controls['Title'].setValue(data.TITLE);
    controls['MartialStatus'].setValue(data.MARTIALSTATUS);//STATUS
    controls['status'].setValue(data.STATUS ? 1 : 0);
    controls['Branch'].setValue(data['CourseId']);
    controls['idNumber'].setValue(data['RollNumber']);
    controls['YearOfRegistration'].setValue(data['YearOfRegistration']);
    controls['ParentName'].setValue(data['ParentName']);
    controls['ParentMobileNumber'].setValue(data['Parent_Mobile_Number']);
    controls['ParentRelationShip'].setValue(data['ParentRelationShip']);
    this.roleId = data['ROLEID'];
    // if (this.roleId == 3) {
    //   this.getYear();
    //   controls['YearOfRegistration'].setValidators(Validators.required);
    //   controls['YearOfRegistration'].updateValueAndValidity();
    //   controls['ParentName'].setValidators(Validators.required);
    //   controls['ParentName'].updateValueAndValidity();
    //   controls['ParentMobileNumber'].setValidators(Validators.required);
    //   controls['ParentMobileNumber'].updateValueAndValidity();
    //   controls['ParentRelationShip'].setValidators(Validators.required);
    //   controls['ParentRelationShip'].updateValueAndValidity();
    // }
    //  Object.keys(controls).map(key=>{
    //    controls[key].markAsTouched();
    //  })
  }
  getYear() {
    this.activeSpinner()
    let payload = {


    }
    this.CommonService.postCall('Loadyear', payload).subscribe((res: any) => {
      this.years = res;
      this.deactivateSpinner();
    }, e => this.deactivateSpinner());
  }

  validationControls() {
    const [dobFormControl] = [this.myform.get('dob')];
    dobFormControl.valueChanges.subscribe((val: string) => {
      const newDate = new Date(val);
      if (newDate) {
        const year = (new Date()).getFullYear();
        const age: number = year - newDate.getFullYear();
        const element = document.getElementById('age');
        if (age > 18) {  
        }else {
          (element as HTMLInputElement).value = "";
          this.toastr.error("Dob should be more than 18 years of age");
        }
      }
    });
  }

}
