import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileuploadService } from 'src/app/services/fileupload.service';

@Component({
  selector: 'app-student-address',
  templateUrl: './student-address.component.html',
  styleUrls: ['./student-address.component.css']
})
export class StudentAddressComponent implements OnInit {
  addressForm: UntypedFormGroup;
  file: File;
  fileName: string = null;
  submitted = false;
  @Output() addressEvent: EventEmitter<any> = new EventEmitter();

  educationTypes: Array<{ id: number, name: string }> = [];
  genderList: Array<string> = [];

  // ViewChild is used to access the input element.

  @ViewChild("takeInput", { static: false })

  // this InputVar is a reference to our input.

  InputVar: ElementRef;
  CountryList: any=[];
  countyList: any=[];
  subCountyList: any=[];

  reset() {

    // We will clear the value of the input
    // field using the reference variable.

    this.InputVar.nativeElement.value = "";
  }
  constructor(private fb: UntypedFormBuilder, public CommonService: CommonService, private route: Router, private toastr: ToastrService, private fileuploadService: FileuploadService) { }

  ngOnInit(): void {
    document.getElementById('btnOpenModel').click();
    this.formInit();

    this.educationTypes = [
      { id: 1, name: "SSC/HSC" },
      { id: 2, name: "Graduation" },
      { id: 3, name: "Post-Graduation" },
      { id: 4, name: "Technical Education" },
      { id: 5, name: "Ph.D." },
      { id: 6, name: "Other" },
    ];

    this.genderList = ["Male", "Female", "Other"];
    this.countries()
  }
  formInit() {
    this.addressForm = this.fb.group({
      Country_id: ['', Validators.required],
      COUNTIES_ID: ['', Validators.required],
      SUB_COUNTIES_ID: ['', Validators.required],
      area_name: [''],
      // area_name: ['', Validators.required],
      education_name: ['', Validators.required],
      other: [''],
      upload_institute: [''],
      age: [''],
      gender: ['', Validators.required],
      occupation: [''],
      pincode: [''],
      nationality: [''],
    })
  }



  others(event: any) {
    // let value = event.target.value;
    // if (value !== "Other") {
    //   this.addValidators(this.addressForm, ['upload_institute']);

    // } else {
    //   this.removeValidators(this.addressForm, ['upload_institute']);

    // }
    // this.fileName = '';
    // // this.file = null;  
    // this.reset();
  }

  addValidators(addressForm: any, controls: string[]) {

    controls.forEach(c => {
      addressForm.get(c)?.setValidators(Validators.required);
      addressForm.get(c)?.updateValueAndValidity();
      this.toastr.warning("Upload Institute ID");

    });
    this.fileName = '';


  }
  removeValidators(addressForm: any, controls: string[]) {
    controls.forEach(c => {
      addressForm.get(c)?.clearValidators();
      addressForm.get(c)?.updateValueAndValidity();
    });
  }


  close() {
    this.addressEvent.emit(null);
  }

  changeFile(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'JPEG', 'pdf', 'PDF'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload();
      }
      else {
        this.toastr.warning('Please upload png, jpg, PNG, jpeg, JPEG, pdf, PDF formats only.');
        event.target.value = '';
      }
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/Institute');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        // if (this.fileName) {
        //   this.addressForm.controls['Institute_ID'].setValue(this.fileName);


        // }
      } catch (e) { console.log(e); }

    }, err => { })
  }

  get f() { return this.addressForm.controls; }

  onSubmit(form: UntypedFormGroup) {
    this.submitted = true;

    if (this.addressForm.invalid) {
      Object.keys(this.addressForm.controls).forEach(key => {

        const controlErrors: ValidationErrors = this.addressForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      this.toastr.warning("Please enter all mandatory field");
      return;
    }

    const saveData = JSON.parse(JSON.stringify(this.addressForm.getRawValue()));
    saveData.upload_institute = this.fileName;
    saveData.age = +saveData.age;
    console.log(saveData);

    this.addressEvent.emit(saveData);
    document.getElementById("btnClose").click();
  }


  getName(folderName: string, fileName: any) {
    return fileName?.substr(fileName?.indexOf(`${folderName}_`)).replace(`${folderName}_`, '').split(/_(.*)/s)[1];
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
 countries() {
    this.CommonService.activateSpinner();
    this.CommonService.postCall('Registration/GetCountrys','').subscribe(
      (res) => {
        this.CountryList = res.data;
        let country = this.CountryList.find((e:any)=> e.country_name.toLowerCase() == 'kenya').country_id
        this.addressForm.patchValue({city_name : country});
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
}
