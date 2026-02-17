import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../app/services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileuploadService } from '../../services/fileupload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent implements OnInit {
  pageTitle: string = "Company";
  companyRegistrationForm: UntypedFormGroup;
  submitted: boolean = false;
  isMeeting: Boolean = false;
  isDesabled: Boolean = false;
  @Input() Data: any;
  @Input() isRead: any;
  @Output() CompanyRegistrationEvent: EventEmitter<boolean> = new EventEmitter();
  isDomainExists: boolean = false;
  countyList: Array<any> = [];
  subCountyList: Array<any> = [];
  file: any = File; serverPath: string;
  imageURL: any; fileName: any = null;
  CountryList: any []=[];

  tooltipContent = `
					You can update your company details from this screen at any time.<br><br>
<strong>Note: </strong>The <strong>Company Name, Mobile Number, </strong> and <strong>Email ID </strong>are non-editable and cannot be changed from here.

					`;
  constructor(private fileuploadService: FileuploadService, private fb: UntypedFormBuilder, public CommonService: CommonService, private route: Router, private toastr: ToastrService) {
    this.serverPath = environment.urlFiles;
  }

  ngOnInit(): void {
    if (this.Data.cmp_county_id > 0) {
      this.contyChange(this.Data.cmp_county_id);
      this.imageURL = this.serverPath + this.Data.cmp_logo;
      this.fileName = this.getName('HomePageImage', this.Data.cmp_logo);
    }
    document.getElementById('btnOpenModel')?.click();
    this.formInit();
    this.countries()
  }

  formInit() {
    this.companyRegistrationForm = this.fb.group({
      company_name: [{ value: (this.Data?.Company_Name || this.Data?.COMPANY_NAME) ?? '', disabled: true }, Validators.required],
      registration_no: [this.Data?.registration_no, Validators.required],
      contact: [{ value: (this.Data?.MobileNo || this.Data?.contact_details) ?? '', disabled: true }, Validators.required],
      email: [{ value: this.Data?.emailid ?? '', disabled: true }, Validators.required],
      address: [this.Data?.address, Validators.required],
      subdomainname: [''],
      cmp_county_id: [this.Data?.cmp_county_id, Validators.required],
      cmp_subcounty_id: [this.Data?.cmp_subcounty_id, Validators.required],
      cmp_logo: [this.Data?.cmp_logo, Validators.required],
      isRead: [false, Validators.required],
      cmp_country_id:['']
    });
  }

  countries() {
    this.CommonService.activateSpinner();
    this.CommonService.postCall('Registration/GetCountrys','').subscribe(
      (res) => {
        this.CountryList = res.data;
        let country = this.CountryList.find((e:any)=> e.country_name.toLowerCase() == 'kenya').country_id
        this.companyRegistrationForm.patchValue({cmp_country_id : country});
        this.countyDropdowns(country)
        this.CommonService.deactivateSpinner();
      }, err => {
        this.CommonService.deactivateSpinner()
      }
    )
  }
  countyDropdowns(item) {
    let payLoad = {
      "country_id": item,
    }
    this.CommonService.postCall("Registration/GetCountiesListByCountryId",payLoad).subscribe((res: any) => {
      this.countyList = res.data;
    }, (err: any) => {
      return this.toastr.error(
        err.error ? err.error : "No County's found!"
      );
    })
  }

  contyChange(scId: any) {
    this.CommonService.activateSpinner();
    this.CommonService.postCall('Registration/GetSubCountiesList', { counties_id: scId }).subscribe(
      (res) => {
        this.subCountyList = res.data;
        this.CommonService.deactivateSpinner()
      }, err => {
        this.CommonService.deactivateSpinner()
      }
    )
  }

  close() {
    this.CompanyRegistrationEvent.emit(false), this.route.navigate(['/HOME/admin-dashboard'])

  }


  get f() { return this.companyRegistrationForm.controls; }

  onSubmit(form: UntypedFormGroup) {
    this.submitted = true;
    if (this.companyRegistrationForm.invalid) {
      this.toastr.warning("Please enter all mandatory field", this.pageTitle);
      return;
    }

    if (this.isDomainExists) {
      this.toastr.error('Subdomain Already Exist', this.pageTitle);
      return;
    }

    if (!this.isDesabled && !this.isRead) {
      return this.toastr.warning("Please read and accept the Terms and Condition", this.pageTitle);
    }

    // const saveData = JSON.parse(JSON.stringify(this.companyRegistrationForm.getRawValue()));
    const saveData = { ...this.companyRegistrationForm.getRawValue() };
    console.log(saveData);
    this.CompanyRegistrationEvent.emit(saveData);
    document.getElementById("btnClose")?.click();
  }


  conditionCheck(event: any) {

    let val = event.target.checked;
    if (val) {
      this.isDesabled = true;
    } else {
      this.isDesabled = false;
    }
  }

  navToTerms() {
    this.route.navigate(['/eRP/terms-conditions']).then(() => {
      window.location.reload();
    });
  }

  navToPrivacy() {
    this.route.navigate(['/eRP/privacy-policy']).then(() => {
      window.location.reload();
    });
  }

  domainChange() {
    const subdomainname = this.companyRegistrationForm.get('subdomainname')?.value;
    if (subdomainname) {
      this.isExistDomain(subdomainname);
    }
  }

  isExistDomain(subdomain_name: string) {
    this.isDomainExists = false;
    this.CommonService.getCall(`account/IsSubDomainExists/${subdomain_name}`).subscribe((res: any) => {
      this.isDomainExists = res.data;
      if (this.isDomainExists)
        this.toastr.error('Subdomain Already Exist', this.pageTitle);
    });
  }

  changeFile(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPEG', 'JPG', 'image'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        // reader.onload = (_event) => {
        //   this.imageURL1 = reader.result;
        // }
        this.uploadImage();
        return;
      }
      else
        this.toastr.warning(' Please upload png ,jpg ,PNG ,jpeg ,gif,JPG image formats only');
      event.target.value = '';
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/HomePageImage');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if (res.path) {
          this.fileName = res.path;
          this.imageURL = `${this.serverPath}${this.fileName}`;
          this.companyRegistrationForm.patchValue({ cmp_logo: this.fileName });
        }

      } catch (e) {
      }

    }, err => { })

  }

  getName(folderName: string, fileName: any) {
    return fileName?.substr(fileName?.indexOf(`${folderName}_`)).replace(`${folderName}_`, '').split(/_(.*)/s)[1];
  }

}
