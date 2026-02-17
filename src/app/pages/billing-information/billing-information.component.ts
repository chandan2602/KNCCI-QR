import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { valHooks } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';

@Component({
  selector: 'app-billing-information',
  templateUrl: './billing-information.component.html',
  styleUrls: ['./billing-information.component.css']
})
export class BillingInformationComponent implements OnInit {
  params: { sId: string, tCode: string };
  assignData: any = {};
  userForm: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  timeZones: Array<any> = [];
  titles: Array<any> = [];
  genders: Array<any> = [];
  country: Array<any> = [];
  states: Array<any> = [];
  city: Array<any> = [];
  isShow:boolean=true;
  fileName: string;
  file: File;
  constructor(active: ActivatedRoute, private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,private FileuploadService:FileuploadService) {
    active.queryParams.subscribe((res: any) => {
      if (res) {
        this.params = res;
        this.getData();
      } else {
        window.history.back();
      }
    })
    this.getDropdowns();
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      Timezone: ['India Standard Time'],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      DOB: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.required]],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      showLogo:[false],
      logo:[''],
      IS_SMS:[false],
      IS_EMAIL:[false]
    })
    this.paymentForm = this.fb.group({
      PaymentType: ['', Validators.required],
      BankName: ['', Validators.required],
      AccountNo: ['', Validators.required],
      ChequeNo: ['', Validators.required],
      ChequeDate: ['', Validators.required,],
      Amount: [''],
      noAcoounts: ['', Validators.required]
    })

  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getData() {
    this.activeSpinner();
    let payLoad = {
      TenantID: this.params.tCode,
      SubscriptionID: this.params.sId
    }
    this.CommonService.postCall('AssignPayment', payLoad).subscribe(
      (res: any) => {
        this.assignData = res;
        this.deactivateSpinner();
      }, err => {
        console.log(err);
        this.deactivateSpinner();
      }
    )
  }

  getTimeZones() {
    this.CommonService.postCall('GetSystemTimeZones', {}).subscribe(
      (res: any) => {
        this.timeZones = res;
      }, err => {

      }
    )
  }
  getDropdowns() {
    let title = this.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.Title});//GetTitle
    let gender = this.CommonService.postCall('GetDictionaryByKey',{DictionaryCode:dataDictionary.Gender});//GetGender
    let timeZone = this.CommonService.postCall('GetSystemTimeZones', {});
    let country = this.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.Country});//GetCountry
    forkJoin([title, gender, timeZone, country]).subscribe(
      (res) => {
        [this.titles, this.genders, this.timeZones, this.country] = [...res]
      }, err => {
        console.log(err)
      }
    )
  }
  changeCountry(value) {
    this.city = [];
    this.activeSpinner();//GetStateByCountryId
    this.CommonService.postCall('GetChildDictionary', { DictionaryID: value }).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.states = res;
      },
      err => {
        this.deactivateSpinner();
      }
    )
  }
  changeState(value) {
    this.activeSpinner();//GetCityByStateId
    this.CommonService.postCall('GetChildDictionary', { DictionaryID: value }).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.city = res;
      },
      err => {
        this.deactivateSpinner();
      }
    )
  }

  confirmPassword(value) {
    let psdCtrl: AbstractControl = this.userForm.controls['password'];
    let cnfCtrl: AbstractControl = this.userForm.controls['confirmPassword']
    if (!psdCtrl.value) {
      this.toastr.warning('Please Enter the Password');
      cnfCtrl.setValue(null);
      return
    }
    if (psdCtrl.value == value) {

    } else {
      this.toastr.warning('Password and Confirm Password Should be Same');
      cnfCtrl.setValue(null);
    }
  }
  
  setAmount(value){
    let ctrls=this.paymentForm.controls;
    let oAmount=parseInt(this.assignData.Amount);
    (ctrls['Amount'] as AbstractControl ).setValue(value*oAmount)
  }
  typeChange(value){
    
    let number:AbstractControl=this.paymentForm.controls['ChequeNo'];
    let date :AbstractControl=this.paymentForm.controls['ChequeDate'];
    if(value==1){
      number.clearValidators();
      date.clearValidators();
      this.isShow=false;
    }else{
      number.setValidators([Validators.required]);
      date.setValidators([Validators.required]);
      this.isShow=true;
    }
    number.updateValueAndValidity();
    date.updateValueAndValidity();
  }
  
  submit() {
   
      if(this.userForm.valid&&this.paymentForm.valid){
        let userData=this.userForm.value;
        let paymentData=this.paymentForm.value;
        let payLoad={
          CREATEDBY:sessionStorage.getItem('UserId'),
          OrganizationName:this.assignData['OrganizationName'],
          SubscriptionName:this.assignData['SubscriptionName'],
          Duration:this.assignData['Duration'],
          SubscriberImageUrl:userData['logo'],
          IsShowProviderLogo:userData['showLogo'],
          IS_EMAIL:userData['IS_EMAIL']||false,
          IS_SMS:userData['IS_SMS']||false,
          UserProfileObj:{
            FirstName:userData['firstName'],
            LastName:userData['lastName'],
            UserName:userData['email'],
            Title:userData['title'],
            TenantCode:this.params.tCode,
            Timezone:userData['Timezone'],
            objMembership:{
              Password:userData['password']
            },
            objAddress:{
              Country:userData['country'],
              State:userData['state'],
              City:userData['city'],
              AddressDetails:userData['address'],

            },
            objUserpersonal:{
              DOB:userData['DOB'],
              Gender:userData['gender']
            },
            objCommunication:{
              MobileNo:userData['mobile'],
              EmailId:userData['email'],
            }
          },
          TntSubscriptionObj:{
            NoofAccounts:paymentData['noAcoounts'],
            SubscriptionId:this.params.sId
          },
          PaymentObj:paymentData
        }
        this.activeSpinner();
        this.CommonService.postCall('ProceedPayment',payLoad).subscribe(
          (res:any)=>{
           this.deactivateSpinner();
           this.toastr.success(res.message)
           window.history.back();
          },err=>{
           this.deactivateSpinner();
           this.toastr.error(err.error?err.error.text||err.error:'error occured please try later')
          }
          )

      }else{
        this.toastr.warning('Please Enter The Mandatory fileds');
        let userControls=this.userForm.controls;
        Object.keys(userControls).map(fName=>{
          let ctrl:AbstractControl=userControls[fName];
          ctrl.markAsTouched();
        });
        let pControls=this.paymentForm.controls;
        Object.keys(pControls).map(fName=>{
          let ctrl:AbstractControl=pControls[fName];
          ctrl.markAsTouched();
        });
      }
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', "JPEG"]
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload();
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload image file formats only.')
        event.target.value = ''
      }
    }
  }
  
  upload() {
    if(!this.file) return
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('ClientDocs','ClientDocs');
    
    this.activeSpinner();
    this.FileuploadService.upload(formData,'UploadSubscriberImage').subscribe((res: any) => {
      // this.file = null
      this.fileName=res.path;
      if(this.fileName&&res.path) { 
        this.userForm.controls['logo'].setValue(this.fileName)
         this.file=null;
        this.deactivateSpinner()
       
      }
    }, err =>{ this.deactivateSpinner(); })
  }

}
