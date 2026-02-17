import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AboutMeComponent } from 'src/app/components/userregistration/about-me/about-me.component';
import { AddressComponent } from 'src/app/components/userregistration/address/address.component';
import { ContactDetailsComponent } from 'src/app/components/userregistration/contact-details/contact-details.component';
import { EducationComponent } from 'src/app/components/userregistration/education/education.component';
import { LanguagesComponent } from 'src/app/components/userregistration/languages/languages.component';
import { PersonalDataComponent } from 'src/app/components/userregistration/personal-data/personal-data.component';
import { ProjectsComponent } from 'src/app/components/userregistration/projects/projects.component';
import { SkillsComponent } from 'src/app/components/userregistration/skills/skills.component';
import { WorkExperienceComponent } from 'src/app/components/userregistration/work-experience/work-experience.component';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';
import { QrCodeComponent } from 'src/app/components/userregistration/qr-code/qr-code.component';
import { AccountDetailsComponent } from 'src/app/components/userregistration/account-details/account-details.component';

@Component({
  selector: 'app-edit-user-registration',
  templateUrl: './edit-user-registration.component.html',
  styleUrls: ['./edit-user-registration.component.css']
})
export class EditUserRegistrationComponent extends BaseComponent implements OnInit {
  RoleId = sessionStorage.getItem('RoleId');
  USERTYPE = sessionStorage.getItem('USERTYPE')
  case: number = 1;
  token: string;
  editData: any = {};
  childs: any = {

  }
  // BankDetails: any;
  constructor(public CommonService: CommonService, private fb: UntypedFormBuilder, public toastr: ToastrService, private active: ActivatedRoute) {
    super(CommonService, toastr);
    const { UserId, USERTYPE } = sessionStorage;
    if ([25, 26].includes(+USERTYPE))
      this.getUserToken(UserId);
    else {
      active.queryParams.subscribe(
        (res) => {
          if (res.token) {
            this.token = res.token;
            this.edit()
          } else {
            window.history.back()
          }
        });
    }

  }

  ngOnInit(): void {
    this.loadNextPre();
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  selectTab(tab) {
    this.case = tab;
  }

  edit() {
    this.activeSpinner();
    this.CommonService.postCall('EditRegistration', { VerificationToken: this.token }).subscribe(
      (res: any) => {
        this.editData = res;
        this.deactivateSpinner()
      }, err => {
        this.deactivateSpinner()
      }
    )
  }
  save() {
    let prControl: UntypedFormGroup = this.childs['UserProfileData'].myform;
    let addressControl: UntypedFormGroup = this.childs['AddressData'].myForm;
    let educationControl: UntypedFormGroup = this.childs['EducationData'].myForm;
    let brControl: UntypedFormGroup = this.childs['BankDetailsData'].myform;
    let IdControl: UntypedFormGroup = this.childs['IdProof'].myform;
    let prValue = prControl.value;
    let brValue = brControl.value;
    let IdValue = IdControl.value;
    if (!prControl.valid) {
      let controls = prControl.controls
      Object.keys(controls).map(key => {
        controls[key].markAsTouched();
      });
      this.toastr.warning('Please Enter PersonalData Mandatory Fields');
      return;
    }

    // Validate Education mandatory field!
    if (!educationControl.valid) {
      let controls = educationControl.controls
      Object.keys(controls).map(key => {
        controls[key].markAsTouched();
      });
      this.toastr.warning('Please Enter Education Mandatory Fields');
      return;
    }

    // Validate Address mandatory field!
    if (!addressControl.valid) {
      let controls = addressControl.controls
      Object.keys(controls).map(key => {
        controls[key].markAsTouched();
      });
      this.toastr.warning('Please Enter Address Mandatory Fields');
      return;
    }

    if (!brControl.valid && this.RoleId == '2') {
      let controls = brControl.controls
      Object.keys(controls).map(key => {
        controls[key].markAsTouched();
      });
      this.toastr.warning('Please Enter Bank Details Mandatory Fields');
      return;
    }
    if (!IdControl.valid && this.RoleId == '2') {
      let controls = IdControl.controls
      Object.keys(controls).map(key => {
        controls[key].markAsTouched();
      });
      this.toastr.warning('Please Enter Id Proof Mandatory Fields');
      return;
    }

    let addressObj = addressControl.getRawValue();
    addressObj.TYPE = addressObj.AddressId > 0 ? 'update' : 'insert';

    let educationObj = educationControl.getRawValue();
    educationObj.TYPE = educationObj.USEREDUCATIONID > 0 ? 'update' : 'insert';

    let payLoad: any = {
      UserProfileData: {},
      ContactDetailsList: [],
      // EducationTypeList: (this.childs['EducationTypeList'] as EducationComponent).educationData,
      EducationTypeList: [{ ...educationObj, UserEductionID: educationObj.USEREDUCATIONID }],
      SkillsList: (this.childs['SkillsList'] as SkillsComponent).skillData,
      // AddressList: (this.childs['AddressList'] as AddressComponent).Address,
      AddressList: [addressObj],
      LanguagesList: (this.childs['LanguagesList'] as LanguagesComponent).lanuageData,
      // ProjectsList:(this.childs['ProjectsList'] as ProjectsComponent).projectData,
      WorkExperienceList: (this.childs['WorkExperienceList'] as WorkExperienceComponent).WorkExperienceData,
      UserImageUrl: (this.childs['aboutMe'] as AboutMeComponent).fileName,
    }
    let personalData = (this.childs['UserProfileData'] as PersonalDataComponent).personalData;
    let contactDetails = (this.childs['ContactDetailsList'] as ContactDetailsComponent).personalData;
    const aboutMe = (this.childs['aboutMe'] as AboutMeComponent);
    let array = [];
    contactDetails.map(item => {
      let obj = {
        type: item['TYPE'],
        CommunicationId: item['COMMUNICATIONID'],
        EmailId: item['EMAILID'],
        MobileNo: item['MOBILENO'],
        secondary_mobileno: item['secondary_mobileno'],
        IsPrimary: item['ISPRIMARY'],
        IsConfirmed: item['IsConfirmed']
      }
      array.push(obj)
    })
    payLoad.UserProfileData = {
      UserImage: personalData['USERIMAGE'],
      TenantCode: personalData['TenantCode'],
      CreatedBy: personalData['UserId'],
      Status: prValue['status'],
      Title: prValue['Title'],
      FirstName: prValue['FirstName'],
      LastName: prValue['LastName'],
      UserId: personalData['UserId'],
      objUserpersonal: {
        DOB: prValue['dob'],
        Gender: prValue['Gender'],
        MartialStatus: prValue['MartialStatus'],
        PROFILESUMMARY: personalData['PROFILESUMMARY'] || ''
      },
      YearOfRegistration: prValue['YearOfRegistration'] || personalData['YearOfRegistration'],
      CourseId: prValue['Branch'],
      RollNumber: prValue['idNumber'],
      "ParentName": prValue['ParentName'] || personalData['ParentName'] || "",
      "ParentMobileNumber": prValue['ParentMobileNumber'] || personalData['Parent_Mobile_Number'] || "",
      "ParentRelationShip": prValue['ParentRelationShip'] || personalData['ParentRelationShip'] || null
    }
    payLoad.ContactDetailsList = array;

    for (const contact of payLoad.ContactDetailsList) {
      if (!contact.MobileNo || contact.MobileNo < 10) {
        this.toastr.warning('Please enter mobile number in Contact Details');
        return;
      }
    }
    const bankData = { ...JSON.parse(JSON.stringify(brControl.getRawValue())), USER_ID: sessionStorage.UserId, TENANTCODE: sessionStorage.TenantCode };
    if (this.RoleId == '2' || this.USERTYPE == '25') {
      this.CommonService.postCall("Registration/SaveOrUpdateBankDetails", bankData).subscribe((res: any) => {
        this.toastr.success(" your BankDetails Registration Success");
      }, e => { });
    }

    const IdProof = { ...JSON.parse(JSON.stringify(IdControl.getRawValue())), USERID: sessionStorage.UserId };
    if (this.RoleId == '2' || this.USERTYPE == '25') {
      this.CommonService.postCall("Registration/UpdateIdProof", IdProof).subscribe((res: any) => {
        this.toastr.success(" your Id Proof Registration Success");
      }, e => { });
    }


    const signaturePayload = { SIGNATURE: aboutMe.signatureImagePath, USERID: aboutMe.userId };
    if (aboutMe.signatureImagePath?.length > 0) {
      this.CommonService.postCall("Registration/InsertOrUpdateUserSignature", signaturePayload).subscribe((res: any) => {
        //this.toastr.success("your Id Proof Registration Success");
      }, e => { });
    }

    // saveSignature(signature: string = '') {
    //   // let payLoad = {
    //   //   "SIGNATURE": signature,
    //   //   "USERID": this.userId,
    //   // }
    //   let payLoad = {
    //     "SIGNATURE": this.signatureImagePath,
    //     "USERID": this.userId,
    //   }
    //   console.log(payLoad)
    //   this.CommonService.postCall('Registration/InsertOrUpdateUserSignature', payLoad).subscribe((res: any) => {
    //     this.toastr.success("Signature Saved Succuessfully");
    //   }, err => {
    //     this.toastr.error(err.error ? err.error : 'Signature Not Updated')
    //   })
    // }

    // return
    this.activeSpinner();
    this.CommonService.postCall('UpdateRegistration', payLoad).subscribe((res) => {
      this.deactivateSpinner();
      this.toastr.success('User Updated Successfully');
      this.CommonService.userImage.next(payLoad.UserImageUrl);
      this.close();
    }, err => {
      this.deactivateSpinner();
      this.toastr.warning(err.error ? err.error : 'user not updated');
    });
  }
  close() {
    const { RoleId } = sessionStorage;
    if (+RoleId == 1)
      window.history.back();
  }

  getUserToken(userId: any) {
    this.activeSpinner();
    this.CommonService.postCall('EditRegistrationByUserId', { CREATEDBY: userId }).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res) {
          this.token = res.value;
          this.edit()
        } else {
          window.history.back();
        }
      }, err => {
        this.deactivateSpinner();
      }
    )
  }

  loadNextPre() {
    $('.btnNext').on('click', () => {
      $('.nav-tabs > .nav-item > .active').parent().next('li').trigger('click');
    });

    $('.btnPrevious').on('click', () => {
      $('.nav-tabs > .nav-item > .active').parent().prev('li').trigger('click');
    });
  }

}
